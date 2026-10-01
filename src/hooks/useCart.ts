import { useState } from 'react';
import type { OrderItem } from '../types/menu';
import { orderTotal } from '../utils/order';

export function useCart() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const count = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = orderTotal(items);

  function addItem(item: OrderItem) {
    setItems((current) => [...current, item]);
  }

  return { items, setItems, addItem, count, total };
}
