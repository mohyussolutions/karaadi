import { PAYMENT_ENDPOINTS, ADS_ENDPOINTS } from "@/actions/constant/constant";

export type PaymentMethod = "waafi" | "evc" | "zaad" | "sahal";
export type PaymentStatus = "idle" | "polling" | "success" | "failed";

export interface PaymentMethodOption {
  key: PaymentMethod;
  label: string;
  provider?: string;
}

export const PAYMENT_METHODS: PaymentMethodOption[] = [
  { key: "waafi", label: "Waafi" },
  { key: "evc", label: "EVC Plus", provider: "evc" },
  { key: "zaad", label: "Zaad", provider: "zaad" },
  { key: "sahal", label: "Sahal", provider: "sahal" },
];

export const PHONE_PREFIX = "+252";
export const MAX_POLL_ATTEMPTS = 30;
export const POLL_INTERVAL_MS = 3000;
export const SUCCESS_REDIRECT_DELAY_MS = 2000;

export const WAAFI_INITIATE_URL = PAYMENT_ENDPOINTS.WAAFI_INITIATE;
export const WAAFI_STATUS_URL = PAYMENT_ENDPOINTS.WAAFI_STATUS;
export const MOBILE_INITIATE_URL = PAYMENT_ENDPOINTS.MOBILE_INITIATE;
export const MOBILE_STATUS_URL = PAYMENT_ENDPOINTS.MOBILE_STATUS;
export const AD_PATCH_URL = ADS_ENDPOINTS.PATCH;
