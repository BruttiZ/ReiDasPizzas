import { business } from '../data/config';
import type { OrderItem } from '../types/menu';
export const orderSubtotal = (items: OrderItem[]): number | null =>
  items.length === 0 || items.some((item) => item.unitPrice === null)
    ? null
    : items.reduce((sum, item) => sum + Math.round(item.unitPrice! * 100) * item.quantity, 0) / 100;
export const orderTotal = (items: OrderItem[]): number | null => {
  const subtotal = orderSubtotal(items);
  return subtotal === null
    ? null
    : (Math.round(subtotal * 100) + Math.round(business.deliveryFee * 100)) / 100;
};
