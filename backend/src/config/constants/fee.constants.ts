export const MARKETPLACE_FEE_KEYS = [
  "art",
  "electronics",
  "animal",
  "sports",
  "furniture",
  "fashion",
  "other",
  "isActive",
] as const;

export const REAL_ESTATE_FEE_KEYS = [
  "rent",
  "sale",
  "land",
  "farm",
  "business",
  "other",
  "isActive",
] as const;

export const CAR_FEE_KEYS = [
  "carSale",
  "carRent",
  "trailer",
  "carParts",
  "truck",
  "electricCar",
  "other",
  "isActive",
] as const;

export const MOTORCYCLE_FEE_KEYS = [
  "motoSale",
  "motoRent",
  "motoParts",
  "other",
  "isActive",
] as const;

export const BOAT_FEE_KEYS = [
  "boatSale",
  "boatRent",
  "boatEngine",
  "boatParts",
  "other",
  "isActive",
] as const;

export const EQUIPMENT_FEE_KEYS = [
  "tractorSale",
  "agriTool",
  "harvester",
  "other",
  "isActive",
] as const;

export const JOB_FEE_KEYS = [
  "fullTime",
  "partTime",
  "freelance",
  "other",
  "isActive",
] as const;

export const SUB_PLAN_KEYS = [
  "basic30",
  "standard60",
  "premium90",
  "isActive",
] as const;

export const SYSTEM_CONFIG_KEYS = [
  "taxRate",
  "platformFee",
  "waafiFee",
  "currency",
] as const;

export const SYSTEM_CONFIG_FIELD = {
  TAX_RATE: "taxRate",
  PLATFORM_FEE: "platformFee",
  WAAFI_FEE: "waafiFee",
  CURRENCY: "currency",
} as const;

export const SYSTEM_CONFIG_NUMERIC_FIELDS = new Set<string>([
  "taxRate",
  "platformFee",
  "waafiFee",
]);

export const BP_DURATIONS = {
  BASIC: 30,
  STANDARD: 60,
  PREMIUM: 90,
} as const;

export const BP_NAMES = {
  BASIC: "30-Day Plan",
  STANDARD: "60-Day Plan",
  PREMIUM: "90-Day Plan",
} as const;

export const FEE_TAKE = 20;
