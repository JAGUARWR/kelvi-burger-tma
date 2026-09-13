import { create } from 'zustand';
import type { Order, CartItem } from '../types';

interface OrderStore {
  orders: Order[];
  addOrder: (items: CartItem[], total: number) => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],

  addOrder: (items, total) => {
    const now = new Date();
    const createdAt = new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(now);

    const order: Order = {
      id: String(Date.now()),
      items,
      total,
      status: 'pending',
      createdAt,
    };

    set({ orders: [order, ...get().orders] });
  },
}));
