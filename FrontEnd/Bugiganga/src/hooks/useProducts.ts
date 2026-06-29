import { useCallback, useEffect, useState } from 'react';

import { productService, type AdminProductSubmit } from '@/src/services/productService';
import { useAdminProductsStore } from '@/src/store/adminProductsStore';
import { useAuthStore } from '@/src/store/authStore';
import { useCurrencyStore } from '@/src/store/currencyStore';
import type { Product } from '@/src/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currency = useCurrencyStore((s) => s.currency);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.list(currency);
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, [currency]);

  useEffect(() => {
    void load();
  }, [load]);

  const novidades = products.filter((p) => p.isNew);
  const destaques = products.filter((p) => p.isFeatured);
  const maisVendidos = products.filter((p) => p.isBestseller);

  return { products, novidades, destaques, maisVendidos, isLoading, error, reload: load };
}

export function useProduct(id: number) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currency = useCurrencyStore((s) => s.currency);

  useEffect(() => {
    if (id <= 0) {
      setProduct(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let active = true;
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await productService.getById(id, currency);
        if (active) setProduct(data);
      } catch (err) {
        if (active) setError(err instanceof Error ? err.message : 'Produto não encontrado');
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [id, currency]);

  return { product, isLoading, error };
}

const EMPTY_PRODUCT_IDS: number[] = [];

export function useAdminProducts() {
  const user = useAuthStore((state) => state.user);
  const myProductIdsRecord = useAdminProductsStore((state) => state.myProductIds);
  const addProductId = useAdminProductsStore((state) => state.addProductId);
  const removeProductId = useAdminProductsStore((state) => state.removeProductId);

  const currency = useCurrencyStore((s) => s.currency);

  const myProductIds = user ? (myProductIdsRecord[user.id] || EMPTY_PRODUCT_IDS) : EMPTY_PRODUCT_IDS;

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = user
        ? await productService.getAdminProducts(user.id, currency)
        : await productService.list(currency);
      
      setProducts(data.filter(p => myProductIds.includes(p.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, [user, myProductIds, currency]);

  useEffect(() => {
    void load();
  }, [load]);

  const createProduct = useCallback(
    async (submit: AdminProductSubmit) => {
      if (!user) {
        throw new Error('Usuário não autenticado');
      }
      const created = await productService.createFromAdminForm(user.id, submit);
      addProductId(user.id, created.id);
      await load();
      return created;
    },
    [load, user, addProductId],
  );

  const updateProduct = useCallback(
    async (id: number, submit: AdminProductSubmit) => {
      const updated = await productService.updateFromAdminForm(id, submit);
      await load();
      return updated;
    },
    [load],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      if (!user) return;
      await productService.deleteProduct(id);
      removeProductId(user.id, id);
      await load();
    },
    [load, user, removeProductId],
  );

  return {
    products,
    isLoading,
    error,
    reload: load,
    createProduct,
    updateProduct,
    deleteProduct,
  };
}
