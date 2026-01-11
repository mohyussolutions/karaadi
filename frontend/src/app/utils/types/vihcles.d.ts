export interface Item {
  category: string;
  _id: any;
  id: string;
  title: string;
  price: number;
  city: string;
  images: string[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  description: string | string[];
  user?: {
    _id: any;
    username?: string;
    profileImage?: string;
    phone?: string | null;
  };
}

export interface User {
  _id?: string;
  username: string;
  profileImage?: string;
  phone?: string | null;
}

export interface Item {
  id: string;
  title: string;
  price: number;
  image?: string;
  model?: string;
}

interface Message {
  _id: string;
  sender: User | string;
  content?: string;
  text?: string;
  createdAt?: string;
  created_at?: string;
  item?: Item;
}

export interface Chat {
  _id: string;
  users: Array<User | string>;
  ad: Item | string;
  adModel?: string;
  createdAt?: string;
  updatedAt?: string;
}
