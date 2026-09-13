const API_BASE = import.meta.env.VITE_API_URL || '';

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
}

export interface ApiOrder {
  id: number;
  items: ApiOrderItem[];
  totalPrice: number;
  orderType: string;
  status: 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';
  createdAt: string;
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

export async function fetchUserOrders(userId: number): Promise<ApiOrder[]> {
  const res = await fetch(`${API_BASE}/api/orders/user/${userId}`, {
    headers: headers(),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  return res.json();
}
