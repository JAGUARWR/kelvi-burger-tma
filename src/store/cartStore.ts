import { create } from 'zustand';
import type { CartItem, MenuItem } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (item: MenuItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (item: MenuItem) => {
    const { items } = get();
    const existing = items.find((i) => i.item.id === item.id);

    if (existing) {
      set({
        items: items.map((i) =>
          i.item.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...items, { item, quantity: 1 }] });
    }
  },

  removeItem: (itemId: string) => {
    set({ items: get().items.filter((i) => i.item.id !== itemId) });
  },

  updateQuantity: (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set({
      items: get().items.map((i) =>
        i.item.id === itemId ? { ...i, quantity } : i
      ),
    });
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.item.price * i.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
