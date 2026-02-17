export interface Tractor {
  id: string;
  userId: string;
  title: string;
  description: string;
  price: number;
  mainCategory: string;
  category: string[];
  subcategory: string[];
  type: string;
  make: string;
  traktortModel: string;
  year: number;
  condition: string;
  hours: number;
  enginePower: string;
  fuelType: string;
  color: string;
  region: string;
  city: string;
  images: string[];
  maGaday: boolean;
  isPaid: boolean;
  fee: any;
  createdAt: string;
  updatedAt: string;
}

interface TractorsState {
  tractors: Tractor[];
}

const initialState: TractorsState = {
  tractors: [],
};
