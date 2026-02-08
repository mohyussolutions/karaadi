export const truncateAmount = (amount: number): string =>
  (Math.floor(amount * 100) / 100).toFixed(2);

export const generateTransactionId = (prefix: string): string =>
  `${prefix.replace(/[^a-zA-Z0-9.-]/g, "")}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 11)}`.toUpperCase();

export const parseWaafiResponse = (text: unknown) => {
  try {
    const parsed = typeof text === "string" ? JSON.parse(text) : text;
    const rCode =
      parsed.responseCode?.toString() || parsed.errorCode?.toString() || "";
    const rMsg = parsed.responseMsg || parsed.errorMsg || parsed.details || "";
    const successCodes = ["2001", "200", "0"];
    const isSuccess =
      successCodes.includes(rCode) || parsed.params?.state === "APPROVED";

    return {
      isSuccess,
      message: isSuccess ? "Payment confirmed" : rMsg || "Payment failed",
      responseCode: rCode,
      params: parsed.params || {},
    };
  } catch {
    return {
      isSuccess: false,
      message: "Failed to parse response",
      responseCode: "PARSE_ERROR",
      params: {},
    };
  }
};
