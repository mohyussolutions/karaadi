// types/favorite.ts
export interface User {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
}

export interface FavoriteItem {
  id: string;
  title: string;
  description: string;
  price: string | null;
  image: string | null;
  category: string | null;
  itemId?: string; // Optional: if you need the original item ID
  userId: string;
  createdAt: string;
  updatedAt: string;
  user: User; // User who created/saved this favorite
}
