import { create } from 'zustand';
import type { Order, CartItem, OrderStatus } from '../types';
import { createOrder, fetchMyOrders, type ApiOrder } from '../services/api';

function formatCreatedAt(iso: string): string {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

function mapApiOrder(o: ApiOrder): Order {
  return {
    id: o.id,
    items: o.items.map((i) => ({
      item: {
        id: i.id,
        name: i.name,
        description: '',
        price: i.price,
        weight: i.weight,
        image: '',
        category: 'burgers',
        tags: [],
        ingredients: [],
      },
      quantity: i.quantity,
    })),
    total: o.totalPrice,
    status: o.status as OrderStatus,
    createdAt: formatCreatedAt(o.createdAt),
  };
}

interface OrderStore {
  orders: Order[];
  loading: boolean;
  submitting: boolean;
  error: string | null;
  addOrder: (items: CartItem[], orderType: 'takeaway' | 'dine_in', bonusToUse?: number, pickupTime?: string) => Promise<boolean>;
  loadOrders: () => Promise<void>;
  clearError: () => void;
}

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  loading: false,
  submitting: false,
  error: null,

  addOrder: async (items, orderType, bonusToUse, pickupTime) => {
    set({ submitting: true, error: null });
    try {
      const payload = {
        items: items.map(({ item, quantity }) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity,
          weight: item.weight,
        })),
        orderType,
        bonusToUse: bonusToUse ?? 0,
        pickup_time: pickupTime ?? 'asap',
      };

      const apiOrder = await createOrder(payload);
      const order = mapApiOrder(apiOrder);
      set({ orders: [order, ...get().orders], submitting: false });
      return true;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось оформить заказ';
      set({ error: msg, submitting: false });
      return false;
    }
  },

  loadOrders: async () => {
    set({ loading: true, error: null });
    try {
      const apiOrders = await fetchMyOrders();
      set({ orders: apiOrders.map(mapApiOrder), loading: false });
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Не удалось загрузить заказы';
      set({ error: msg, loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
