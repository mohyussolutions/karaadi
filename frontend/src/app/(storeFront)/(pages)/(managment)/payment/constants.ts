const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type PaymentMethod = "waafi" | "evc" | "zaad" | "edahab";
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
  { key: "edahab", label: "E-Dahab", provider: "edahab" },
];

export const PHONE_PREFIX = "+252";
export const MAX_POLL_ATTEMPTS = 10;
export const POLL_INTERVAL_MS = 3000;
export const SUCCESS_REDIRECT_DELAY_MS = 2000;

export const WAAFI_INITIATE_URL = `${BASE}/api/payments/waafi/initiate`;
export const WAAFI_STATUS_URL = (ref: string) => `${BASE}/api/payments/waafi/status/${ref}`;
export const MOBILE_INITIATE_URL = `${BASE}/api/payments/mobile/initiate`;
export const MOBILE_STATUS_URL = (ref: string) => `${BASE}/api/payments/mobile/status/${ref}`;
export const AD_PATCH_URL = (id: string) => `${BASE}/api/ads/${id}`;
