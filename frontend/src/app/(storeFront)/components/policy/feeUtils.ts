import {
  FeeConfig,
  CalculatedFee,
  AppCategories,
} from "@/app/utils/types/fee.types";

export const calculateLocalFee = (
  feeConfig: FeeConfig,
  keyOrCategory: keyof FeeConfig | keyof AppCategories = "subscription",
  subType?: keyof Pick<FeeConfig, "basic30" | "standard60" | "premium90">,
): CalculatedFee => {
  let baseFee = 0;

  if (keyOrCategory === "subscription") {
    baseFee = Number(feeConfig[subType || "basic30"]) || 0;
  } else if (keyOrCategory === "marketplace") {
    baseFee = Number(feeConfig.electronics) || 0;
  } else {
    baseFee = Number(feeConfig[keyOrCategory as keyof FeeConfig]) || 0;
  }

  const taxRate = Number(feeConfig.taxRate) || 0;
  const taxAmount = (baseFee * taxRate) / 100;
  const platformFee = Number(feeConfig.platformFee) || 0;
  const waafiFee = Number(feeConfig.waafi) || 0;

  const totalAmount = baseFee + taxAmount + platformFee + waafiFee;
  const isFree = totalAmount <= 0;

  return {
    type: isFree ? 0 : 1,
    isFree,
    baseFee: Math.round(baseFee * 100) / 100,
    taxAmount: Math.round(taxAmount * 100) / 100,
    platformFee,
    waafiFee,
    totalAmount: Math.round(totalAmount * 100) / 100,
    currency: feeConfig.currency || "USD",
  };
};

export const calculateCarFee = (
  config: FeeConfig,
  key: "carSale" | "carRent" | "truck" | "trailer" | "carParts",
) => calculateLocalFee(config, key);

export const calculateRealEstateFee = (
  config: FeeConfig,
  key: "sale" | "rent" | "land" | "farm" | "business",
) => calculateLocalFee(config, key);
