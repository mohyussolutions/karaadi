declare module "evc-plus" {
  export interface PaymentConfig {
    baseUrl: string;
    credentials: {
      apiKey?: string;
      merchantUid?: string;
      apiUserId?: string;
    };
    defaults?: {
      currency?: string;
      paymentMethod?: string;
    };
  }

  const evcPlus: any;
  export default evcPlus;
}
