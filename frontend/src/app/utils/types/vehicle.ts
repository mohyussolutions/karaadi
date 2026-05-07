export type VehicleType = "car" | "boat" | "motorcycle" | "farmequipment";

export interface FieldDef {
  key: string;
  label: string;
  format?: (v: any) => string;
}

export interface VehicleItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  images: string[];
  mainCategory?: string;
  category?: string[];
  subcategory?: string[];
  region?: string;
  city?: string;
  user?: any;
  userId?: string;
  maGaday?: boolean;
  make?: string;
  brand?: string;
  model?: string;
  modelName?: string;
  vehicleModel?: string;
  boatModel?: string;
  farmequipmentModel?: string;
  trim?: string;
  year?: number | string;
  mileage?: number | string;
  fuelType?: string;
  transmission?: string;
  gearbox?: string;
  engineSize?: string;
  engineCc?: string;
  condition?: string;
  color?: string;
  doors?: number | string;
  vehicleKind?: string;
  type?: string;
  boatType?: string;
  length?: number | string;
  hullMaterial?: string;
  engineHours?: number | string;
  bikeType?: string;
  equipmentType?: string;
  horsepower?: number | string;
  enginePower?: string;
  hoursUsed?: number | string;
  hours?: number | string;
  attachmentsIncluded?: boolean;
}
