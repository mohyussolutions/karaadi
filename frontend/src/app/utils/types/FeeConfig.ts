export interface FeeConfig {
  id?: string;
  art: number;
  electronics: number;
  animal: number;
  sports: number;
  furniture: number;
  fashion: number;
  rent: number;
  sale: number;
  land: number;
  farm: number;
  business: number;
  carSale: number;
  carRent: number;
  trailer: number;
  carParts: number;
  truck: number;
  electricCar: number;
  boatSale: number;
  boatRent: number;
  boatEngine: number;
  boatParts: number;
  tractorSale: number;
  agriTool: number;
  fertilizer: number;
  harvester: number;
  motoSale: number;
  motoRent: number;
  motoParts: number;
  motoOther: number;
  fullTime: number;
  partTime: number;
  freelance: number;
  subStandard: number;
  subPremium: number;
  taxRate: number;
  waafi: number;
  platformFee: number;
  currency: string;
  isActive?: boolean;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;

  // Add index signature
  [key: string]: any;
}
