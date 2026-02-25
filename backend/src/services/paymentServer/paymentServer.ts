import prisma from "../../core/utils/db.ts";
import {
  CATEGORY_FIELD_MAP,
  MODEL_MAP,
} from "../../constanst/payment.constants.ts";
import {
  generateTransactionId,
  parseWaafiResponse,
  truncateAmount,
  validateAccountNumber,
} from "../../core/utils/payment.utils.ts";
import {
  ItemCategory,
  ListingType,
  PaymentMethod,
  PaymentRequest,
} from "../../types/payment.ts";
import { WaafiService } from "../../config/waafiConfig.ts";

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

export class PaymentService {
  private waafiService: WaafiService;

  constructor() {
    this.waafiService = new WaafiService();
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
  ) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new PaymentError("User account not found.");

    const itemExists = await this.validateItemExists(itemCategory, itemId);
    if (!itemExists)
      throw new PaymentError(
        "The item you are trying to pay for does not exist.",
      );

    const paymentData: any = {
      userId,
      listingType,
      feeAmount,
      taxAmount,
      platformFee,
      totalAmount,
      currency,
      paymentMethod: paymentMethod as any,
      transactionId,
      status: transactionId ? "COMPLETED" : "PENDING",
      paidAt: transactionId ? new Date() : null,
    };

    const categoryField =
      CATEGORY_FIELD_MAP[itemCategory as keyof typeof CATEGORY_FIELD_MAP];
    if (categoryField) paymentData[categoryField] = itemId;

    return prisma.payment.create({ data: paymentData });
  }

  private async validateItemExists(
    itemCategory: ItemCategory,
    itemId: string,
  ): Promise<boolean> {
    const modelName = MODEL_MAP[itemCategory as keyof typeof MODEL_MAP];
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
    const modelName = MODEL_MAP[itemCategory as keyof typeof MODEL_MAP];
    if (!modelName) return;

    const model = prisma[modelName as keyof typeof prisma] as any;
    if (!model || typeof model.update !== "function") return;

    await model.update({ where: { id: itemId }, data: { isPaid } });
  }

  async processWaafiPayment(params: PaymentRequest & { userId: string }) {
    try {
      this.validatePaymentRequest(params);

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
      const successCodes = ["2001"];
      const isSuccess =
        successCodes.includes(String(result.responseCode)) ||
        result.params?.state === "APPROVED";

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

  private validatePaymentRequest(params: any): void {
    const missingFields: string[] = [];

    if (!params.userId) missingFields.push("userId");
    if (!params.itemId) missingFields.push("itemId");
    if (!params.itemCategory) missingFields.push("itemCategory");
    if (!params.accountNo && !params.paymentMethod)
      missingFields.push("payment method");

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

  async getItemDetail(id: string) {
    const includeOptions = {
      include: { user: { select: { id: true, username: true, email: true } } },
    };

    const [car, motorcycle, realEstate, boat, marketplace] = await Promise.all([
      prisma.car.findUnique({ where: { id }, ...includeOptions }),
      prisma.motorcycle.findUnique({ where: { id }, ...includeOptions }),
      prisma.realEstate.findUnique({ where: { id }, ...includeOptions }),
      prisma.boat.findUnique({ where: { id }, ...includeOptions }),
      prisma.marketplace.findUnique({ where: { id }, ...includeOptions }),
    ]);

    const item = car || motorcycle || realEstate || boat || marketplace;
    if (!item) return null;

    let category = "";
    if (car) category = "car";
    else if (motorcycle) category = "motorcycle";
    else if (realEstate) category = "real-estate";
    else if (boat) category = "boat";
    else if (marketplace) category = "marketplace";

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
