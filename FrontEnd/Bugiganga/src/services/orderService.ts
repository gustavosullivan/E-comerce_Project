import type { UserAddress } from '@/src/types/address';
import type { CartItem } from '@/src/types/cart';
import type { Order } from '@/src/types/order';
import type { Product } from '@/src/types/product';

import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, getErrorMessage, mapAxiosError } from '@/src/services/api/client';
import { productService } from '@/src/services/productService';
import { useCurrencyStore } from '@/src/store/currencyStore';
import type { User } from '@/src/types/auth';

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  total: number;
  deliveryAddress?: UserAddress | null;
}

export interface CreateOrderContext {
  items: CartItem[];
  userId: number;
  buyerName: string;
  buyerEmail: string;
  deliveryAddress?: UserAddress | null;
}

export interface AdminSalesSummary {
  totalSalesValue: number;
  soldProducts: {
    product: Product;
    quantity: number;
    totalPrice: number;
  }[];
}

interface ApiProductSnapshot {
  id: number;
  description: string;
  brand: string;
  model: string;
  price: number;
  currency: string;
  stock: number;
  imageURL?: string;
  convertedPrice?: number;
}

interface ApiOrderItem {
  id: number;
  productId: number;
  quantity: number;
  priceAtPurchase: number;
  currencyAtPurchase: string;
  convertedPriceAtPruchase?: number;
  product?: ApiProductSnapshot;
}

interface ApiOrder {
  id: number;
  orderDate: string;
  items: ApiOrderItem[];
  totalPrice?: number;
  totalConvertedPrice?: number;
}

interface ApiOrderPage {
  content: ApiOrder[];
  last: boolean;
  totalElements: number;
}

function mapSnapshotToProduct(item: ApiOrderItem): Product {
  const snapshot = item.product;
  const unitPrice = item.convertedPriceAtPruchase ?? item.priceAtPurchase;

  return {
    id: snapshot?.id ?? item.productId,
    name: snapshot?.description || `Produto #${item.productId}`,
    description: snapshot?.description ?? '',
    brand: snapshot?.brand ?? '',
    model: snapshot?.model ?? '',
    price: unitPrice,
    stock: snapshot?.stock ?? 0,
    imageUrl:
      snapshot?.imageURL || `https://picsum.photos/seed/order-product-${item.productId}/600/600`,
    categoryId: 1,
    categoryName: 'Sebo',
    userId: 1,
    isFeatured: false,
    isNew: false,
    isBestseller: false,
  };
}

function mapApiOrder(
  api: ApiOrder,
  context: {
    userId?: number;
    buyerName?: string;
    buyerEmail?: string;
    deliveryAddress?: UserAddress | null;
  },
): Order {
  const items: CartItem[] = (api.items ?? []).map((item) => ({
    product: mapSnapshotToProduct(item),
    quantity: item.quantity,
  }));

  const computedTotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  return {
    id: api.id,
    userId: context.userId ?? 0,
    buyerName: context.buyerName ?? '',
    buyerEmail: context.buyerEmail ?? '',
    deliveryAddress: context.deliveryAddress ?? undefined,
    status: 'PAID',
    items,
    total: api.totalConvertedPrice ?? api.totalPrice ?? computedTotal,
    createdAt: api.orderDate,
  };
}

async function fetchAllOrderPages(
  url: string,
  params: Record<string, string | number>,
): Promise<ApiOrder[]> {
  const currency = useCurrencyStore.getState().currency;
  const orders: ApiOrder[] = [];
  let page = 0;
  const size = 50;

  while (true) {
    const response = await apiClient.get<ApiOrderPage>(url, {
      params: { ...params, targetCurrency: currency, page, size },
    });

    orders.push(...response.data.content);

    if (response.data.last || response.data.content.length === 0) {
      break;
    }

    page += 1;
  }

  return orders;
}

export const orderService = {
  async createOrder(
    data: CreateOrderRequest,
    context?: CreateOrderContext,
  ): Promise<Order> {
    if (!context) {
      throw new Error('Dados do pedido incompletos');
    }

    try {
      const response = await apiClient.post<ApiOrder>(API_ENDPOINTS.orders, {
        items: data.items,
      });

      return mapApiOrder(response.data, {
        userId: context.userId,
        buyerName: context.buyerName,
        buyerEmail: context.buyerEmail,
        deliveryAddress: context.deliveryAddress,
      });
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível criar o pedido'));
    }
  },

  async listOrders(
    userId: number,
    context?: Partial<Pick<CreateOrderContext, 'buyerName' | 'buyerEmail'>>,
  ): Promise<Order[]> {
    try {
      const apiOrders = await fetchAllOrderPages(API_ENDPOINTS.orders, {});
      return apiOrders.map((order) =>
        mapApiOrder(order, {
          userId,
          buyerName: context?.buyerName,
          buyerEmail: context?.buyerEmail,
        }),
      );
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Erro ao carregar compras'));
    }
  },

  async getOrderById(
    id: number,
    context?: Partial<Pick<CreateOrderContext, 'userId' | 'buyerName' | 'buyerEmail' | 'deliveryAddress'>>,
  ): Promise<Order | null> {
    try {
      const currency = useCurrencyStore.getState().currency;
      const response = await apiClient.get<ApiOrder>(API_ENDPOINTS.ordersById(id), {
        params: { targetCurrency: currency },
      });

      if (!context?.userId) {
        return mapApiOrder(response.data, { userId: 0 });
      }

      return mapApiOrder(response.data, {
        userId: context.userId,
        buyerName: context.buyerName,
        buyerEmail: context.buyerEmail,
        deliveryAddress: context.deliveryAddress,
      });
    } catch (error) {
      const mapped = mapAxiosError(error);
      if (mapped.statusCode === 404) {
        return null;
      }
      throw new Error(mapped.message);
    }
  },

  fromCartItems(items: CartItem[]): CreateOrderRequest {
    return {
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };
  },

  async getAdminSalesSummary(adminId: User['id']): Promise<AdminSalesSummary> {
    try {
      const [apiOrders, products] = await Promise.all([
        fetchAllOrderPages(API_ENDPOINTS.ordersAdmin, {}),
        productService.getAdminProducts(adminId),
      ]);

      let totalSalesValue = 0;
      const soldProductsMap = new Map<
        number,
        { product: Product; quantity: number; totalPrice: number }
      >();

      apiOrders.forEach((apiOrder) => {
        const order = mapApiOrder(apiOrder, { userId: 0 });
        order.items.forEach((cartItem) => {
          const product = products.find((item) => item.id === cartItem.product.id);
          if (!product) return;

          const lineTotal = cartItem.product.price * cartItem.quantity;
          const current = soldProductsMap.get(product.id);

          soldProductsMap.set(product.id, {
            product,
            quantity: (current?.quantity ?? 0) + cartItem.quantity,
            totalPrice: (current?.totalPrice ?? 0) + lineTotal,
          });
          totalSalesValue += lineTotal;
        });
      });

      return {
        totalSalesValue,
        soldProducts: Array.from(soldProductsMap.values()),
      };
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Erro ao carregar vendas'));
    }
  },
};