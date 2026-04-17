export interface CartItem {
  id: string;
  title: string;
  price: number;
  image: string;
  category: string;
}

export interface CartState {
  items: CartItem[];
}
