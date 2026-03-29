import { WaafiService } from "../../config/waafiConfig.ts";
import {
  ItemCategory,
  PaymentMethod,
  PaymentStatus,
  PaymentRequest,
  ListingType,
} from "../../types/payment.ts";
import {
  truncateAmount,
  generateTransactionId,
  parseWaafiResponse,
  validateAccountNumber,
} from "../../core/utils/payment.utils.ts";
import prisma from "../../core/utils/db.ts";
import {
  CATEGORY_FIELD_MAP,
  MODEL_MAP,
} from "../../constants/payment.constants.ts";
import { CardPaymentService } from "./CardPaymentService.ts";

export class PaymentError extends Error {
  public userFriendly: boolean;
  public responseCode: number;
  public key: string;

  constructor(
    message: string,
    userFriendly = true,
    responseCode = 400,
    key = "PAYMENT_ERROR",
  ) {
    super(message);
    this.name = "PaymentError";
    this.userFriendly = userFriendly;
    this.responseCode = responseCode;
    this.key = key;
  }
}

interface ExtendedPaymentRequest extends PaymentRequest {
  userId: string;
}

export class PaymentService {
  private waafiService: WaafiService;
  private cardService: CardPaymentService | null = null;

  constructor() {
    this.waafiService = new WaafiService();
    if (process.env.STRIPE_SECRET_KEY || process.env.STRIPE_MODE === "mock") {
      this.cardService = new CardPaymentService();
    }
  }

  async processPayment(params: ExtendedPaymentRequest) {
    const { paymentMethod = PaymentMethod.WAAFI } = params;

    switch (paymentMethod) {
      case PaymentMethod.CARD:
        return this.processCardPayment(params);
      case PaymentMethod.WAAFI:
      default:
        return this.processWaafiPayment(params);
    }
  }

  private async processCardPayment(params: ExtendedPaymentRequest) {
    try {
      this.validatePaymentRequest(params);

      if (!this.cardService) {
        return {
          success: false,
          message: "Card payment service is not configured",
          responseCode: 503,
          key: "SERVICE_UNAVAILABLE",
          userFriendly: true,
        };
      }

      const totalAmount = this.calculateTotalAmount(params);
      const finalAmount = Number(truncateAmount(totalAmount));

      if (finalAmount <= 0) {
        throw new PaymentError(
          "Payment amount must be greater than zero.",
          true,
          400,
          "INVALID_AMOUNT",
        );
      }

      if (!params.paymentIntentId) {
        const result = await this.cardService.createPaymentIntent(
          finalAmount,
          params.currency || "usd",
          {
            userId: params.userId,
            itemId: params.itemId,
            itemCategory: params.itemCategory,
          },
        );

        const payment = await this.createPaymentWithCategory(
          params.userId,
          params.itemCategory,
          params.itemId,
          params.listingType || ListingType.FEE,
          PaymentMethod.CARD,
          finalAmount,
          result.paymentIntentId,
          params.taxAmount || 0,
          params.platformFee || 0,
          params.feeAmount || 0,
          params.baseFee || totalAmount,
          params.currency || "USD",
          PaymentStatus.PENDING,
        );

        return {
          success: true,
          requiresConfirmation: true,
          clientSecret: result.clientSecret,
          paymentIntentId: result.paymentIntentId,
          transactionId: result.paymentIntentId,
          payment,
          amount: finalAmount,
          key: "CARD_PAYMENT_INITIATED",
          responseCode: 200,
        };
      } else {
        const result = await this.cardService.confirmPayment(
          params.paymentIntentId,
        );

        if (result.success) {
          const payment = await prisma.payment.update({
            where: { transactionId: params.paymentIntentId },
            data: {
              status: PaymentStatus.COMPLETED,
              paidAt: new Date(),
            },
          });

          await this.updateItemStatus(params.itemCategory, params.itemId, true);

          return {
            success: true,
            message: "Payment completed successfully!",
            transactionId: result.transactionId,
            payment,
            responseCode: 2001,
            key: "SUCCESS",
            amount: finalAmount,
          };
        } else {
          return {
            success: false,
            message: result.message || "Payment confirmation failed",
            responseCode: 400,
            key: "PAYMENT_DECLINED",
            userFriendly: true,
          };
        }
      }
    } catch (error: unknown) {
      if (error instanceof PaymentError) {
        return {
          success: false,
          message: error.message,
          responseCode: error.responseCode,
          key: error.key,
          userFriendly: error.userFriendly,
        };
      }

      return {
        success: false,
        message: "We encountered an issue processing your card payment.",
        responseCode: 500,
        key: "PROCESSING_ERROR",
        userFriendly: true,
      };
    }
  }

  async processWaafiPayment(params: ExtendedPaymentRequest) {
    try {
      this.validatePaymentRequest(params);

      if (!validateAccountNumber(params.accountNo || "")) {
        throw new PaymentError(
          "Invalid account number format.",
          true,
          400,
          "INVALID_ACCOUNT",
        );
      }

      const referenceId = generateTransactionId("WAAFI");
      const totalAmount = this.calculateTotalAmount(params);
      const finalAmount = Number(truncateAmount(totalAmount));

      if (finalAmount <= 0) {
        throw new PaymentError(
          "Payment amount must be greater than zero.",
          true,
          400,
          "INVALID_AMOUNT",
        );
      }

      const rawResponse = await this.waafiService.processPayment(
        params.accountNo || "",
        finalAmount,
        params.description || "Payment",
        referenceId,
      );

      const result = parseWaafiResponse(rawResponse);
      const isSuccess = result.isSuccess;

      if (!isSuccess) {
        return {
          success: false,
          message: result.message || "Payment was not approved.",
          responseCode: result.responseCode || 400,
          key: "PAYMENT_DECLINED",
          userFriendly: true,
        };
      }

      const finalTxId = result.params?.transactionId
        ? String(result.params.transactionId)
        : referenceId;

      const payment = await this.createPaymentWithCategory(
        params.userId,
        params.itemCategory,
        params.itemId,
        params.listingType || ListingType.FEE,
        params.paymentMethod || PaymentMethod.WAAFI,
        finalAmount,
        finalTxId,
        params.taxAmount || 0,
        params.platformFee || 0,
        params.feeAmount || 0,
        params.baseFee || totalAmount,
        params.currency || "USD",
        PaymentStatus.COMPLETED,
      );

      await this.updateItemStatus(params.itemCategory, params.itemId, true);

      return {
        success: true,
        message: "Payment processed successfully!",
        transactionId: finalTxId,
        payment,
        responseCode: 2001,
        key: "SUCCESS",
        amount: finalAmount,
      };
    } catch (error: unknown) {
      if (error instanceof PaymentError) {
        return {
          success: false,
          message: error.message,
          responseCode: error.responseCode,
          key: error.key,
          userFriendly: error.userFriendly,
        };
      }

      if (error instanceof Error) {
        if (
          error.message.includes("WaafiPay configuration error") ||
          error.message.includes("WAAFIPAY_PRODUCTION_URL")
        ) {
          return {
            success: false,
            message: "Payment service is temporarily unavailable.",
            responseCode: 503,
            key: "SERVICE_UNAVAILABLE",
            userFriendly: true,
          };
        }

        try {
          const parsedError = JSON.parse(error.message);
          return parsedError;
        } catch {
          return {
            success: false,
            message: "We encountered an issue processing your payment.",
            responseCode: 500,
            key: "PROCESSING_ERROR",
            userFriendly: true,
          };
        }
      }

      return {
        success: false,
        message: "An unexpected error occurred.",
        responseCode: 500,
        key: "UNKNOWN_ERROR",
        userFriendly: true,
      };
    }
  }

  async confirmCardPayment(paymentIntentId: string) {
    try {
      if (!this.cardService) {
        return {
          success: false,
          message: "Card payment service is not configured",
          responseCode: 503,
          key: "SERVICE_UNAVAILABLE",
        };
      }

      const result = await this.cardService.confirmPayment(paymentIntentId);

      if (result.success) {
        const payment = await prisma.payment.findUnique({
          where: { transactionId: paymentIntentId },
        });

        if (!payment) {
          return {
            success: false,
            message: "Payment not found",
            responseCode: 404,
            key: "PAYMENT_NOT_FOUND",
          };
        }

        const updatedPayment = await prisma.payment.update({
          where: { transactionId: paymentIntentId },
          data: {
            status: PaymentStatus.COMPLETED,
            paidAt: new Date(),
          },
          include: {
            user: true,
          },
        });

        const itemCategory = this.determineItemCategory(updatedPayment);
        if (itemCategory) {
          const itemId = this.getItemIdFromPayment(
            updatedPayment,
            itemCategory,
          );
          if (itemId) {
            await this.updateItemStatus(itemCategory, itemId, true);
          }
        }

        return {
          success: true,
          transactionId: result.transactionId,
          amount: result.amount,
          payment: updatedPayment,
        };
      }

      return {
        success: false,
        message: result.message || "Payment confirmation failed",
        responseCode: 400,
        key: "CONFIRMATION_FAILED",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to confirm payment",
        responseCode: 500,
        key: "CONFIRMATION_ERROR",
      };
    }
  }

  async refundCardPayment(paymentIntentId: string, amount?: number) {
    try {
      if (!this.cardService) {
        return {
          success: false,
          message: "Card payment service is not configured",
          responseCode: 503,
          key: "SERVICE_UNAVAILABLE",
        };
      }

      const payment = await prisma.payment.findUnique({
        where: { transactionId: paymentIntentId },
      });

      if (!payment) {
        return {
          success: false,
          message: "Payment not found",
          responseCode: 404,
          key: "PAYMENT_NOT_FOUND",
        };
      }

      if (payment.status === PaymentStatus.REFUNDED) {
        return {
          success: false,
          message: "Payment has already been refunded",
          responseCode: 400,
          key: "ALREADY_REFUNDED",
        };
      }

      const result = await this.cardService.refundPayment(
        paymentIntentId,
        amount,
      );

      if (result.success) {
        await prisma.payment.update({
          where: { transactionId: paymentIntentId },
          data: {
            status: PaymentStatus.REFUNDED,
            updatedAt: new Date(),
          },
        });

        return {
          success: true,
          refundId: result.refundId,
          amount: result.amount,
          status: result.status,
        };
      }

      return {
        success: false,
        message: result.message || "Refund failed",
        responseCode: 400,
        key: "REFUND_FAILED",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Failed to process refund",
        responseCode: 500,
        key: "REFUND_ERROR",
      };
    }
  }

  private determineItemCategory(payment: any): ItemCategory | null {
    if (payment.carId) return ItemCategory.CAR;
    if (payment.motorcycleId) return ItemCategory.MOTORCYCLE;
    if (payment.realEstateId) return ItemCategory.REAL_ESTATE;
    if (payment.boatId) return ItemCategory.BOAT;
    if (payment.marketplaceId) return ItemCategory.MARKETPLACE;
    if (payment.jobId) return ItemCategory.JOB;
    if (payment.farmequipmentId) return ItemCategory.FARMEQUIPMENT;
    return null;
  }

  private getItemIdFromPayment(
    payment: any,
    category: ItemCategory,
  ): string | null {
    const fieldName = CATEGORY_FIELD_MAP[category];
    return fieldName ? payment[fieldName] : null;
  }

  private validatePaymentRequest(params: ExtendedPaymentRequest): void {
    const missingFields: string[] = [];

    if (!params.itemId) missingFields.push("itemId");
    if (!params.itemCategory) missingFields.push("itemCategory");
    if (!params.accountNo && !params.paymentMethod && !params.paymentIntentId) {
      missingFields.push("payment method");
    }

    if (missingFields.length > 0) {
      throw new PaymentError(
        `Please provide: ${missingFields.join(", ")}.`,
        true,
        400,
        "MISSING_FIELDS",
      );
    }
  }

  private calculateTotalAmount(params: PaymentRequest): number {
    if (params.totalAmount !== undefined) return params.totalAmount;
    return (
      Number(params.feeAmount || 0) +
      Number(params.taxAmount || 0) +
      Number(params.platformFee || 0) +
      Number(params.baseFee || 0)
    );
  }

  async createPaymentWithCategory(
    userId: string,
    itemCategory: ItemCategory,
    itemId: string,
    listingType: ListingType,
    paymentMethod: PaymentMethod,
    totalAmount: number,
    transactionId?: string,
    taxAmount: number = 0,
    platformFee: number = 0,
    feeAmount: number = 0,
    baseFee: number = 0,
    currency: string = "USD",
    status: PaymentStatus = PaymentStatus.PENDING,
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new PaymentError("User account not found.");

    const itemExists = await this.validateItemExists(itemCategory, itemId);
    if (!itemExists) {
      throw new PaymentError(
        "The item you are trying to pay for does not exist.",
      );
    }

    const paymentData: any = {
      userId,
      listingType,
      feeAmount,
      taxAmount,
      platformFee,
      totalAmount,
      currency,
      paymentMethod,
      transactionId,
      status,
      paidAt: status === PaymentStatus.COMPLETED ? new Date() : null,
    };

    const categoryField = CATEGORY_FIELD_MAP[itemCategory];
    if (categoryField) {
      paymentData[categoryField] = itemId;
    }

    return prisma.payment.create({
      data: paymentData,
    });
  }

  private async validateItemExists(
    itemCategory: ItemCategory,
    itemId: string,
  ): Promise<boolean> {
    const modelName = MODEL_MAP[itemCategory];
    if (!modelName) return false;

    const model = prisma[modelName as keyof typeof prisma] as any;
    if (!model || typeof model.findUnique !== "function") return false;

    const item = await model.findUnique({ where: { id: itemId } });
    return !!item;
  }

  async updateItemStatus(
    itemCategory: ItemCategory,
    itemId: string,
    isPaid: boolean,
  ) {
    const modelName = MODEL_MAP[itemCategory];
    if (!modelName) return;

    const model = prisma[modelName as keyof typeof prisma] as any;
    if (!model || typeof model.update !== "function") return;

    await model.update({
      where: { id: itemId },
      data: { isPaid },
    });
  }

  async getItemDetail(id: string) {
    const includeOptions = {
      include: { user: { select: { id: true, username: true, email: true } } },
    };

    const [car, motorcycle, realEstate, boat, marketplace, job, farmequipment] =
      await Promise.all([
        prisma.car.findUnique({ where: { id }, ...includeOptions }),
        prisma.motorcycle.findUnique({ where: { id }, ...includeOptions }),
        prisma.realEstate.findUnique({ where: { id }, ...includeOptions }),
        prisma.boat.findUnique({ where: { id }, ...includeOptions }),
        prisma.marketplace.findUnique({ where: { id }, ...includeOptions }),
        prisma.job.findUnique({ where: { id }, ...includeOptions }),
        prisma.farmequipment.findUnique({ where: { id }, ...includeOptions }),
      ]);

    const item =
      car ||
      motorcycle ||
      realEstate ||
      boat ||
      marketplace ||
      job ||
      farmequipment;
    if (!item) return null;

    let category: ItemCategory | null = null;
    if (car) category = ItemCategory.CAR;
    else if (motorcycle) category = ItemCategory.MOTORCYCLE;
    else if (realEstate) category = ItemCategory.REAL_ESTATE;
    else if (boat) category = ItemCategory.BOAT;
    else if (marketplace) category = ItemCategory.MARKETPLACE;
    else if (job) category = ItemCategory.JOB;
    else if (farmequipment) category = ItemCategory.FARMEQUIPMENT;

    return { category, data: item };
  }

  async getPaymentStats(region?: string, city?: string) {
    const where: any = {};

    const [aggregate, statusData, methodData] = await Promise.all([
      prisma.payment.aggregate({
        where,
        _sum: {
          totalAmount: true,
          taxAmount: true,
          platformFee: true,
          feeAmount: true,
        },
        _count: { id: true },
        _avg: { totalAmount: true },
        _min: { totalAmount: true },
        _max: { totalAmount: true },
      }),
      prisma.payment.groupBy({
        by: ["status"],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
      prisma.payment.groupBy({
        by: ["paymentMethod"],
        where,
        _count: { id: true },
        _sum: { totalAmount: true },
      }),
    ]);

    return {
      summary: {
        totalAmount: aggregate._sum?.totalAmount || 0,
        totalPayments: aggregate._count?.id || 0,
        averagePayment: aggregate._avg?.totalAmount || 0,
        minPayment: aggregate._min?.totalAmount || 0,
        maxPayment: aggregate._max?.totalAmount || 0,
        totalTax: aggregate._sum?.taxAmount || 0,
        totalPlatformFee: aggregate._sum?.platformFee || 0,
        totalFee: aggregate._sum?.feeAmount || 0,
      },
      breakdown: {
        status: statusData,
        paymentMethods: methodData,
      },
    };
  }
}
