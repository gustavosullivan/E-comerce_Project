import { useCallback, useEffect, useState } from 'react';

import { productService } from '@/src/services/productService';
import type { Product, ProductInput } from '@/src/types/product';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.list();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, []);

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
        const data = await productService.getById(id);
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
  }, [id]);

  return { product, isLoading, error };
}

export function useAdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await productService.list();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const createProduct = useCallback(
    async (data: ProductInput) => {
      const created = await productService.create(data);
      await load();
      return created;
    },
    [load],
  );

  const updateProduct = useCallback(
    async (id: number, data: Partial<ProductInput>) => {
      const updated = await productService.update(id, data);
      await load();
      return updated;
    },
    [load],
  );

  const deleteProduct = useCallback(
    async (id: number) => {
      await productService.remove(id);
      await load();
    },
    [load],
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
