import type { OrderStatus } from '@/src/types/order';

const LABELS: Record<OrderStatus, string> = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregue',
  CANCELLED: 'Cancelado',
};

export function getOrderStatusLabel(status: OrderStatus): string {
  return LABELS[status];
}
