import {
  createPaymentWithCategory,
  generateTransactionId,
  updateItemStatus,
  truncateAmount,
} from "./paymentHelpers.ts";
import {
  ItemCategory,
  ListingType,
  PaymentMethod,
  PaymentProcessingResult,
} from "types/payment.ts";
import { parseWaafiError } from "config/waafipay.errors.ts";
import { waafiPayPurchaseTest } from "mock/mock.ts";

export const processWaafiPayment = async (
  userId: string,
  itemCategory: ItemCategory,
  itemId: string,
  listingType: ListingType,
  paymentMethod: PaymentMethod,
  accountNo: string,
  totalAmount: number,
  taxAmount: number,
  platformFeeAmount: number,
  description: string,
  baseFee: number,
  feeAmount: number,
  currency: string = "USD"
): Promise<PaymentProcessingResult> => {
  try {
    const referenceId = generateTransactionId("WAAFI");
    const finalAmount = Number(truncateAmount(totalAmount));

    const rawResponse = await waafiPayPurchaseTest(
      accountNo,
      finalAmount,
      referenceId,
      description
    );

    const result = parseWaafiError(rawResponse);

    if (result.isSuccess) {
      const finalTxId = result.params?.transactionId
        ? String(result.params.transactionId)
        : referenceId;

      const payment = await createPaymentWithCategory(
        userId,
        itemCategory,
        itemId,
        listingType,
        paymentMethod,
        finalAmount,
        finalTxId,
        taxAmount,
        platformFeeAmount,
        feeAmount,
        baseFee,
        currency
      );

      await updateItemStatus(itemCategory, itemId, true);

      return {
        success: true,
        message: result.message,
        transactionId: finalTxId,
        payment,
        details: {
          waafiResponseCode: result.error,
        },
      };
    }

    return {
      success: false,
      error: result.message,
      details: {
        waafiResponseCode: result.error,
      },
    };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: "WaafiPay Connection Error",
      details: {
        error: errorMessage,
      },
    };
  }
};
