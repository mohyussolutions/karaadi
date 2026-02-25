import { logger } from "src/core/middelware/logger.ts";
import { ResponseCodes } from "../config/waafipay.service.responseCodes.ts";

export const useErrorHandler = (error: any) => {
  if (!error) {
    logger.error("Unknown error occurred");
    return {
      success: false,
      message: "An unknown error occurred.",
      responseCode: ResponseCodes.HPP_USERACTION_TIMEOUT.code,
      key: ResponseCodes.HPP_USERACTION_TIMEOUT.key,
    };
  }

  if (error instanceof Error) {
    logger.error(error.message, { stack: error.stack });
    return {
      success: false,
      message: error.message,
      responseCode: ResponseCodes.HPP_USERACTION_TIMEOUT.code,
      key: ResponseCodes.HPP_USERACTION_TIMEOUT.key,
    };
  }

  logger.error(error.message || "An unexpected error occurred.", error);
  return {
    success: false,
    message: error.message || "An unexpected error occurred.",
    responseCode:
      error.responseCode || ResponseCodes.HPP_USERACTION_TIMEOUT.code,
    key: error.key || ResponseCodes.HPP_USERACTION_TIMEOUT.key,
  };
};
