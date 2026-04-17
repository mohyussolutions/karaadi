export interface FavoriteItem {
  id: string;
  userId: string;
  itemId: string;
  itemType: string;
  title: string;
  description: string;
  image: string;
  imageUrl: string;
  price: string | number;
  category: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    _id: string;
    username: string;
    email: string;
    phone: string;
    profileImage: string;
  };
}
