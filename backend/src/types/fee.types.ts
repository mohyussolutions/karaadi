export interface MarketplaceFee {
  id?: string;
  art: number;
  electronics: number;
  animal: number;
  sports: number;
  furniture: number;
  fashion: number;
  isActive?: boolean;
}

export interface RealEstateFee {
  id?: string;
  rent: number;
  sale: number;
  land: number;
  farm: number;
  business: number;
  isActive?: boolean;
}

export interface VehicleFee {
  id?: string;
  carSale: number;
  carRent: number;
  trailer: number;
  carParts: number;
  truck: number;
  electricCar: number;
  motoSale: number;
  motoRent: number;
  motoParts: number;
  motoOther: number;
  isActive?: boolean;
}

export interface BoatFee {
  id?: string;
  boatSale: number;
  boatRent: number;
  boatEngine: number;
  boatParts: number;
  isActive?: boolean;
}

export interface EquipmentAndJobFee {
  id?: string;
  tractorSale: number;
  agriTool: number;
  fertilizer: number;
  harvester: number;
  fullTime: number;
  partTime: number;
  freelance: number;
  isActive?: boolean;
}

export interface SubPlanConfig {
  id?: string;
  subStandard: number;
  subStandard60: number;
  subPremium: number;
  isActive?: boolean;
}

export interface SystemConfig {
  id?: string;
  taxRate: number;
  waafi: number;
  platformFee: number;
  currency: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Date;
}

export type GlobalFeeConfig = MarketplaceFee &
  RealEstateFee &
  VehicleFee &
  BoatFee &
  EquipmentAndJobFee &
  SubPlanConfig &
  SystemConfig;

export type FeeConfigKeyType = keyof GlobalFeeConfig;
