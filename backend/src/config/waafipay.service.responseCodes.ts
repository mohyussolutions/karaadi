export const ResponseCodes = {
  SUCCESS: {
    code: 2001,
    message: "Request/Transaction is approved/successful",
    key: "RCS_SUCCESS",
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
} as const;
