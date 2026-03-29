export interface ResponseCodeDetail {
  readonly code: number;
  readonly message: string;
  readonly key: string;
}

export const ResponseCodes = {
  SUCCESS: {
    code: 2001,
    message: "Transaction approved successfully",
    key: "RCS_SUCCESS",
  },
  INVALID_ACCOUNT: {
    code: 2002,
    message: "Invalid account number",
    key: "RCS_INVALID_ACCOUNT",
  },
  INSUFFICIENT_BALANCE: {
    code: 2003,
    message: "Insufficient balance",
    key: "RCS_INSUFFICIENT_BALANCE",
  },
  TRANSACTION_FAILED: {
    code: 2004,
    message: "Transaction failed",
    key: "RCS_TRANSACTION_FAILED",
  },
  TIMEOUT: {
    code: 2005,
    message: "Transaction timeout",
    key: "RCS_TIMEOUT",
  },
  INVALID_HPPKEY: {
    code: 5301,
    message: "Transaction cannot be performed due to wrong hpp key",
    key: "RCS_INVALID_HPPKEY",
  },
  INVALID_HPPTOKEN: {
    code: 5302,
    message: "Transaction cannot be performed due to wrong hpp Token",
    key: "RCS_INVALID_HPPTOKEN",
  },
  INVALID_HPPRESULTTOKEN: {
    code: 5303,
    message: "Wrong hpp Token result",
    key: "RCS_INVALID_HPPRESULTTOKEN",
  },
  HPP_MERCHANT_REFERENCEID_MISMATCH: {
    code: 5304,
    message: "Reference ID mismatch",
    key: "RCS_HPP_MERCHANT_REFERENCEID_MISMATCH",
  },
  HPP_REQUESTID_MISMATCH: {
    code: 5305,
    message: "RequestId mismatch",
    key: "RCS_HPP_REQUESTID_MISMATCH",
  },
  HPP_USERACTION_CANCELLED: {
    code: 5306,
    message: "User cancelled the transaction",
    key: "RCS_HPP_USERACTION_CANCELLED",
  },
  HPPTOKEN_EXPIRED: {
    code: 5307,
    message: "Token expired",
    key: "RCS_HPPTOKEN_EXPIRED",
  },
  HPP_SUBSCRIPTION_ISNOT_ENABLED: {
    code: 5308,
    message: "Merchant not allowed for this service",
    key: "RCS_HPP_SUBSCRIPTION_ISNOT_ENABLED",
  },
  HPP_USERACTION_TIMEOUT: {
    code: 5309,
    message: "User timeout",
    key: "RCS_HPP_USERACTION_TIMEOUT",
  },
  SERVICE_UNAVAILABLE: {
    code: 5310,
    message:
      "Payment service is currently unavailable. Please try again later.",
    key: "RCS_SERVICE_UNAVAILABLE",
  },
  CONFIGURATION_ERROR: {
    code: 5311,
    message:
      "We're experiencing technical difficulties. Our team has been notified.",
    key: "RCS_CONFIGURATION_ERROR",
  },
  INVALID_CONFIGURATION: {
    code: 5312,
    message: "Invalid payment configuration detected",
    key: "RCS_INVALID_CONFIGURATION",
  },
  GATEWAY_ERROR: {
    code: 5313,
    message: "Payment gateway error occurred",
    key: "RCS_GATEWAY_ERROR",
  },
  PAYMENT_DECLINED: {
    code: 5314,
    message: "Payment was not approved",
    key: "RCS_PAYMENT_DECLINED",
  },
  PROCESSING_ERROR: {
    code: 5315,
    message: "We encountered an issue processing your payment",
    key: "RCS_PROCESSING_ERROR",
  },
  MISSING_FIELDS: {
    code: 5316,
    message: "Required payment information is missing",
    key: "RCS_MISSING_FIELDS",
  },
  INVALID_AMOUNT: {
    code: 5317,
    message: "Payment amount must be greater than zero",
    key: "RCS_INVALID_AMOUNT",
  },
} as const;
