import { useCallback, useEffect, useState } from 'react';

import { orderService } from '@/src/services/orderService';
import { useAuthStore } from '@/src/store/authStore';
import { useCurrencyStore } from '@/src/store/currencyStore';
import type { Order } from '@/src/types/order';

export function useOrders(userId: number | undefined) {
  const user = useAuthStore((s) => s.user);
  const currency = useCurrencyStore((s) => s.currency);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!userId) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await orderService.listOrders(userId, {
        buyerName: user?.name,
        buyerEmail: user?.email,
      });
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar compras');
    } finally {
      setIsLoading(false);
    }
  }, [currency, user?.email, user?.name, userId]);

  useEffect(() => {
    void load();
  }, [load]);

  return { orders, isLoading, error, reload: load };
}

export function useOrder(id: number) {
  const user = useAuthStore((s) => s.user);
  const currency = useCurrencyStore((s) => s.currency);
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id <= 0) {
      setOrder(null);
      setIsLoading(false);
      return;
    }

    let active = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await orderService.getOrderById(id, {
          userId: user?.id ?? 0,
          buyerName: user?.name,
          buyerEmail: user?.email,
        });
        if (active) setOrder(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Compra não encontrada');
      } finally {
        if (active) setIsLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [currency, id, user?.email, user?.id, user?.name]);

  return { order, isLoading, error };
}
