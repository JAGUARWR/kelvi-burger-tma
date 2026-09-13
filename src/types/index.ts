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

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'preparing' | 'ready';
  createdAt: string;
}
