import { WaafiError, WaafiRawResponse } from "types/payment.ts";
import { ResponseCodes } from "./waafipay.service.responseCodes.ts";

export const parseWaafiError = (text: unknown): WaafiError => {
  try {
    const isString = typeof text === "string";
    const parsed = (
      isString ? JSON.parse(text as string) : text
    ) as WaafiRawResponse;

    const rCode =
      parsed.responseCode?.toString() || parsed.errorCode?.toString();
    const rMsg = parsed.responseMsg || parsed.errorMsg || parsed.details;

    const knownStatus = Object.values(ResponseCodes).find(
      (item) =>
        item.code.toString() === rCode ||
        item.key === rCode ||
        item.key === rMsg
    );

    const isSuccess =
      rCode === ResponseCodes.SUCCESS.code.toString() ||
      rCode === ResponseCodes.SUCCESS.key ||
      rMsg === ResponseCodes.SUCCESS.key ||
      rMsg === ResponseCodes.SUCCESS.message ||
      parsed.params?.state === "APPROVED";

    return {
      isSuccess,
      message: isSuccess
        ? "Payment confirmed. Your item is now live on the website."
        : String(knownStatus?.message || rMsg || "Payment failed"),
      error: isSuccess
        ? ResponseCodes.SUCCESS.key
        : String(knownStatus?.key || rCode || "UNKNOWN_ERROR"),
      responseCode: rCode,
      params: parsed.params as Record<string, any>,
    };
  } catch {
    return {
      isSuccess: false,
      message: "Failed to parse payment response",
      error: "PARSE_ERROR",
    };
  }
};
