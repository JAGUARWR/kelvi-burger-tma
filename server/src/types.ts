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
  bonusToUse?: number;
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';

export interface TelegramUser {
  id: number;
  username?: string;
  first_name?: string;
}

export interface DbUser {
  id: number;
  telegramId: bigint;
  firstName: string | null;
  username: string | null;
  phone: string | null;
  address: string | null;
  bonusBalance: number;
}
