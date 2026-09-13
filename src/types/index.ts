export type Tag = 'hit' | 'spicy' | 'new' | 'veg';

export type Category = 'burgers' | 'snacks' | 'sauces' | 'drinks' | 'sides';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  weight?: string;
  badge?: string;
  image: string;
  category: Category;
  tags: Tag[];
  ingredients: string[];
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
}

export type OrderStatus = 'new' | 'cooking' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: number;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
}
