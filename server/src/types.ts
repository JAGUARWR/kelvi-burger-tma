export interface OrderItemPayload {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
}

export interface CreateOrderBody {
  items: OrderItemPayload[];
  orderType: 'takeaway' | 'dine_in';
  initData?: string;
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
}
