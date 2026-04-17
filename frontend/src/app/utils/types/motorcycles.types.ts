import type { ID } from "./common.types";

export interface Motorcycle {
  _id: ID;
  id: ID;
  user: string;
  title: string;
  description: string;
  price: number;
  category: string;
  subCategory?: string;
  city: string;
  region: string;
  condition: "New" | "Used";
  make: string;
  model: string;
  year: number;
  engineSize?: string;
  mileage?: number;
  images: string[];
  isPaid: boolean;
  createdAt?: string;
  updatedAt?: string;
  priority: boolean;
}

export type CreateMotorcycleData = Omit<
  Motorcycle,
  "_id" | "id" | "user" | "createdAt" | "updatedAt"
>;

export type AdminMotorcycle = Partial<Motorcycle> & {
  user?:
    | {
        _id?: string;
        id?: string;
        username?: string;
        email?: string;
        phone?: string;
        profileImage?: string;
      }
    | string;
  subCategory?: string;
};
