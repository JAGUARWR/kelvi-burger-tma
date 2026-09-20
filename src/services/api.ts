const API_BASE = import.meta.env.VITE_API_URL || 'https://api.kelviburger.ru';

function getInitData(): string | undefined {
  return window.Telegram?.WebApp?.initData;
}

function headers(): Record<string, string> {
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  const initData = getInitData();
  if (initData) h['x-telegram-init-data'] = initData;
  return h;
}

export interface ApiOrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  weight?: string;
}

export interface CreateOrderPayload {
  items: ApiOrderItem[];
  orderType: 'takeaway' | 'dine_in';
  bonusToUse?: number;
  pickup_time?: string;
  total_price?: number;
}

export interface ApiOrder {
  id: number;
  items: ApiOrderItem[];
  totalPrice: number;
  bonusUsed: number;
  bonusEarned: number;
  orderType: string;
  pickupTime?: string;
  status: 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface ApiUserProfile {
  id: number;
  telegram_id: number;
  first_name: string | null;
  username: string | null;
  phone: string | null;
  address: string | null;
  bonus_balance: number;
  bonusBalance?: number;
}

export async function fetchMe(): Promise<ApiUserProfile> {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: headers(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  const data = await res.json();
  return data.user;
}

export async function createOrder(payload: CreateOrderPayload): Promise<ApiOrder> {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export interface ApiProduct {
  id: string;
  name: string;
  isAvailable: boolean;
  canUseBonuses: boolean;
}

export async function fetchProducts(): Promise<ApiProduct[]> {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) return [];
  return res.json();
}

export async function fetchMyOrders(): Promise<ApiOrder[]> {
  const res = await fetch(`${API_BASE}/api/orders/my`, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}
