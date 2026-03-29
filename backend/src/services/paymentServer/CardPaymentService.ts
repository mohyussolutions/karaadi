import Stripe from "stripe";

export class CardPaymentError extends Error {
  public userFriendly: boolean;
  public responseCode: number;
  public key: string;

  constructor(
    message: string,
    userFriendly = true,
    responseCode = 400,
    key = "CARD_PAYMENT_ERROR",
  ) {
    super(message);
    this.name = "CardPaymentError";
    this.userFriendly = userFriendly;
    this.responseCode = responseCode;
    this.key = key;
  }
}

export class CardPaymentService {
  private stripe: Stripe | null = null;

  constructor() {
    if (
      process.env.USE_STRIPE_PROD === "true" &&
      process.env.STRIPE_SECRET_KEY
    ) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2026-02-25.clover",
      });
    }
  }

  private isMockMode(): boolean {
    return process.env.STRIPE_MODE === "mock" || !this.stripe;
  }

  async createPaymentIntent(
    amount: number,
    currency: string = "usd",
    metadata: Record<string, any> = {},
  ) {
    if (this.isMockMode()) {
      return this.createMockPaymentIntent(amount, currency, metadata);
    }

    try {
      if (!this.stripe) {
        throw new CardPaymentError(
          "Stripe is not configured",
          true,
          500,
          "STRIPE_CONFIG_ERROR",
        );
      }

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: currency.toLowerCase(),
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
      };
    } catch (error: any) {
      throw new CardPaymentError(
        error.message || "Failed to create payment intent",
        true,
        400,
        "CREATE_PAYMENT_INTENT_ERROR",
      );
    }
  }

  private createMockPaymentIntent(
    amount: number,
    currency: string,
    metadata: Record<string, any>,
  ) {
    console.log("🔧 MOCK MODE: Creating Stripe payment intent");
    const mockId = `pi_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    return {
      success: true,
      clientSecret: `${mockId}_secret_mock`,
      paymentIntentId: mockId,
      amount,
      currency,
      status: "requires_confirmation",
    };
  }

  async confirmPayment(paymentIntentId: string) {
    if (this.isMockMode()) {
      return this.confirmMockPayment(paymentIntentId);
    }

    try {
      if (!this.stripe) {
        throw new CardPaymentError(
          "Stripe is not configured",
          true,
          500,
          "STRIPE_CONFIG_ERROR",
        );
      }

      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status === "succeeded") {
        return {
          success: true,
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          status: "COMPLETED",
          paymentMethod: paymentIntent.payment_method_types[0],
          metadata: paymentIntent.metadata,
        };
      } else if (paymentIntent.status === "processing") {
        return {
          success: false,
          message: "Payment is still processing",
          status: "PROCESSING",
        };
      } else if (paymentIntent.status === "requires_payment_method") {
        return {
          success: false,
          message: "Payment requires a valid payment method",
          status: "REQUIRES_PAYMENT_METHOD",
        };
      } else if (paymentIntent.status === "canceled") {
        return {
          success: false,
          message: "Payment was canceled",
          status: "CANCELED",
        };
      } else {
        return {
          success: false,
          message: `Payment status: ${paymentIntent.status}`,
          status: paymentIntent.status.toUpperCase(),
        };
      }
    } catch (error: any) {
      throw new CardPaymentError(
        error.message || "Failed to confirm payment",
        true,
        400,
        "CONFIRM_PAYMENT_ERROR",
      );
    }
  }

  private confirmMockPayment(paymentIntentId: string) {
    console.log("🔧 MOCK MODE: Confirming payment", paymentIntentId);

    const isSuccess = !paymentIntentId.includes("fail");

    if (isSuccess) {
      return {
        success: true,
        transactionId: paymentIntentId,
        amount: 100,
        currency: "usd",
        status: "COMPLETED",
        paymentMethod: "card",
        metadata: {},
      };
    }

    return {
      success: false,
      message: "Payment failed in mock mode",
      status: "FAILED",
    };
  }

  async refundPayment(paymentIntentId: string, amount?: number) {
    if (this.isMockMode()) {
      return this.refundMockPayment(paymentIntentId, amount);
    }

    try {
      if (!this.stripe) {
        throw new CardPaymentError(
          "Stripe is not configured",
          true,
          500,
          "STRIPE_CONFIG_ERROR",
        );
      }

      const refundParams: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = Math.round(amount * 100);
      }

      const refund = await this.stripe.refunds.create(refundParams);

      return {
        success: true,
        refundId: refund.id,
        amount: refund.amount / 100,
        currency: refund.currency,
        status: refund.status,
        paymentIntentId: refund.payment_intent as string,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process refund",
      };
    }
  }

  private refundMockPayment(paymentIntentId: string, amount?: number) {
    console.log("🔧 MOCK MODE: Processing refund", { paymentIntentId, amount });

    return {
      success: true,
      refundId: `re_mock_${Date.now()}`,
      amount: amount || 100,
      currency: "usd",
      status: "succeeded",
      paymentIntentId,
    };
  }

  async getPaymentDetails(paymentIntentId: string) {
    if (this.isMockMode()) {
      return this.getMockPaymentDetails(paymentIntentId);
    }

    try {
      if (!this.stripe) {
        throw new CardPaymentError(
          "Stripe is not configured",
          true,
          500,
          "STRIPE_CONFIG_ERROR",
        );
      }

      const paymentIntent =
        await this.stripe.paymentIntents.retrieve(paymentIntentId);

      interface ChargeDetail {
        id: string;
        amount: number;
        status: string;
        refunded: boolean;
        receiptUrl: string | null;
      }

      const charges: ChargeDetail[] = [];

      if (paymentIntent.latest_charge) {
        const charge = await this.stripe.charges.retrieve(
          paymentIntent.latest_charge as string,
        );
        charges.push({
          id: charge.id,
          amount: charge.amount / 100,
          status: charge.status,
          refunded: charge.refunded,
          receiptUrl: charge.receipt_url,
        });
      }

      return {
        success: true,
        id: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        status: paymentIntent.status,
        metadata: paymentIntent.metadata,
        created: new Date(paymentIntent.created * 1000),
        paymentMethod: paymentIntent.payment_method_types[0],
        clientSecret: paymentIntent.client_secret,
        charges,
      };
    } catch (error: any) {
      throw new CardPaymentError(
        error.message || "Failed to retrieve payment details",
        true,
        400,
        "RETRIEVAL_ERROR",
      );
    }
  }

  private getMockPaymentDetails(paymentIntentId: string) {
    return {
      success: true,
      id: paymentIntentId,
      amount: 100,
      currency: "usd",
      status: "succeeded",
      metadata: { mock: true },
      created: new Date(),
      paymentMethod: "card",
      clientSecret: `${paymentIntentId}_secret_mock`,
      charges: [
        {
          id: `ch_mock_${Date.now()}`,
          amount: 100,
          status: "succeeded",
          refunded: false,
          receiptUrl: null,
        },
      ],
    };
  }
}
