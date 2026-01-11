export const WaaFiConfig = {
  baseUrl:
    process.env.WAAFIPAY_ENVIRONMENT === "production"
      ? process.env.WAAFIPAY_PRODUCTION_URL
      : process.env.WAAFIPAY_SANDBOX_URL,
  credentials: {
    apiKey: process.env.WAAFIPAY_API_KEY,
    merchantUid: process.env.WAAFIPAY_MERCHANT_UID,
    apiUserId: process.env.WAAFIPAY_API_USER_ID,
  },
  defaults: {
    currency: "USD",
    paymentMethod: "MWALLET_ACCOUNT",
  },
} as const;
