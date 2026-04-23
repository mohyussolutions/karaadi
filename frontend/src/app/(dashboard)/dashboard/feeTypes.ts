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
  ],
  realEstate: ["rent", "sale", "land", "farm", "business"],
  cars: ["carSale", "carRent", "trailer", "carParts", "truck", "electricCar"],
  motorcycles: ["motoSale", "motoRent", "motoParts", "motoOther"],
  boats: ["boatSale", "boatRent", "boatEngine", "boatParts"],
  equipment: [
    "tractorSale",
    "agriTool",
    "fertilizer",
    "harvester",
    "fullTime",
    "partTime",
    "freelance",
  ],
  subPlans: ["basic30", "standard60", "premium90"],
  system: ["taxRate", "platformFee", "waafiFee", "currency"],
  businessPlans: ["bp30", "bp60", "bp90"],
};
