import { Request } from "express";
import { User } from "@prisma/client";

export interface AuthRequest extends Request {
  user?: User & { _id?: string; sub?: string };
}

export interface CreateFarmequipmentBody {
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  region: string;
  city: string;
  make: string;
  farmequipmentModel: string;
  type: string;
  condition: string;
  enginePower: string;
  fuelType: string;
  year: number;
  hours?: number;
  images: string[];
  isPaid?: boolean;
  planId?: string;
  planAmount?: number;
  userId?: string;
}
