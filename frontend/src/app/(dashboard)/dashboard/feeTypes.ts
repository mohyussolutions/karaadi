export interface FeeIds {
  m: string;
  r: string;
  c: string;
  mc: string;
  b: string;
  e: string;
  s: string;
  sys: string;
  bp: string;
}

interface FieldMappings {
  marketplace: string[];
  realEstate: string[];
  cars: string[];
  motorcycles: string[];
  boats: string[];
  equipment: string[];
  subPlans: string[];
  system: string[];
  businessPlans: string[];
}

export const fieldMappings: FieldMappings = {
  marketplace: [
    "art",
    "electronics",
    "animal",
    "sports",
    "furniture",
    "fashion",
    "other",
  ],
  realEstate: ["rent", "sale", "land", "farm", "business", "other"],
  cars: ["carSale", "carRent", "trailer", "carParts", "truck", "electricCar", "other"],
  motorcycles: ["motoSale", "motoRent", "motoParts", "other"],
  boats: ["boatSale", "boatRent", "boatEngine", "boatParts", "other"],
  equipment: ["tractorSale", "agriTool", "harvester", "other"],
  subPlans: ["basic30", "standard60", "premium90"],
  system: ["taxRate", "platformFee", "waafiFee", "currency"],
  businessPlans: ["bp30", "bp60", "bp90"],
};
