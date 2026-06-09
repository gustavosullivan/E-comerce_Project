import type { Product } from '@/src/types/product';

/** URLs extras para galeria no modal (mock até a API enviar múltiplas imagens). */
export function getProductGalleryUrls(product: Product): string[] {
  const base = product.imageUrl;
  const extras = [
    `https://picsum.photos/seed/bugiganga-${product.id}-angle/640/640`,
    `https://picsum.photos/seed/bugiganga-${product.id}-detail/640/640`,
  ];
  return [base, ...extras.filter((url) => url !== base)];
}
