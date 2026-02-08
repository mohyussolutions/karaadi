import { ResponseCodes } from "../config/waafipay.service.responseCodes.ts";

export const useErrorHandler = (error: any) => {
  if (!error) {
    return {
      success: false,
      message: "An unknown error occurred.",
      responseCode: ResponseCodes.HPP_USERACTION_TIMEOUT.code,
      key: ResponseCodes.HPP_USERACTION_TIMEOUT.key,
    };
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      responseCode: ResponseCodes.HPP_USERACTION_TIMEOUT.code,
      key: ResponseCodes.HPP_USERACTION_TIMEOUT.key,
    };
  }

  return {
    success: false,
    message: error.message || "An unexpected error occurred.",
    responseCode:
      error.responseCode || ResponseCodes.HPP_USERACTION_TIMEOUT.code,
    key: error.key || ResponseCodes.HPP_USERACTION_TIMEOUT.key,
  };
};
