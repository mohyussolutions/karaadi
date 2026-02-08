import {
  truncateAmount,
  validateAccountNumber,
} from "../core/utils/payment.utils.ts";
import { WaaFiConfig } from "./waafipay.config.ts";
import { ResponseCodes } from "./waafipay.service.responseCodes.ts";
import chalk from "chalk";

export class WaafiService {
  private useMock(): boolean {
    return (
      process.env.WAAFIPAY_ENVIRONMENT === "development" ||
      process.env.USE_WAAFIPAY_PROD === "false" ||
      process.env.WAAFIPAY_MODE === "mock" ||
      (typeof process.env.WAAFIPAY_API_KEY === "string" &&
        process.env.WAAFIPAY_API_KEY.includes("DUMMY")) ||
      (typeof process.env.WAAFIPAY_API_USER_ID === "string" &&
        process.env.WAAFIPAY_API_USER_ID.includes("DUMMY"))
    );
  }

  async processPayment(
    accountNo: string,
    amount: number,
    description: string,
    referenceId: string,
  ): Promise<any> {
    const useMock = this.useMock();
    const finalAmount = Number(truncateAmount(amount));

    if (!validateAccountNumber(accountNo)) {
      throw new Error(ResponseCodes.INVALID_HPPKEY.message);
    }

    if (useMock) {
      console.log(ResponseCodes.SUCCESS.key);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        responseCode: ResponseCodes.SUCCESS.code,
        responseKey: ResponseCodes.SUCCESS.key,
        params: { transactionId: `WAAFI-${Date.now()}`, state: "APPROVED" },
      };
    }

    return this.processRealPayment(
      accountNo,
      finalAmount,
      description,
      referenceId,
    );
  }

  private validateUrl(
    url: string,
    errorResponse = ResponseCodes.CONFIGURATION_ERROR,
  ): void {
    if (!url || url.trim() === "") {
      console.error(chalk.red(errorResponse.message));
      throw new Error(
        JSON.stringify({
          success: false,
          message: errorResponse.message,
          responseCode: errorResponse.code,
          key: errorResponse.key,
        }),
      );
    }

    if (url === "CANCELLED") {
      console.error(
        chalk.yellow(ResponseCodes.HPP_USERACTION_CANCELLED.message),
      );
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.HPP_USERACTION_CANCELLED.message,
          responseCode: ResponseCodes.HPP_USERACTION_CANCELLED.code,
          key: ResponseCodes.HPP_USERACTION_CANCELLED.key,
        }),
      );
    }

    try {
      new URL(url);
    } catch {
      console.error(chalk.red(ResponseCodes.SERVICE_UNAVAILABLE.message));
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.SERVICE_UNAVAILABLE.message,
          responseCode: ResponseCodes.SERVICE_UNAVAILABLE.code,
          key: ResponseCodes.SERVICE_UNAVAILABLE.key,
        }),
      );
    }
  }

  private async processRealPayment(
    accountNo: string,
    amount: number,
    description: string,
    referenceId: string,
  ): Promise<any> {
    this.validateUrl(WaaFiConfig.baseUrl);

    const apiUserId = parseInt(WaaFiConfig.credentials.apiUserId, 10);
    if (isNaN(apiUserId)) {
      console.error(chalk.red(ResponseCodes.INVALID_CONFIGURATION.message));
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.INVALID_CONFIGURATION.message,
          responseCode: ResponseCodes.INVALID_CONFIGURATION.code,
          key: ResponseCodes.INVALID_CONFIGURATION.key,
        }),
      );
    }

    const payload = {
      schemaVersion: "1.0",
      requestId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      channelName: "WEB",
      serviceName: "API_PURCHASE",
      serviceParams: {
        merchantUid: WaaFiConfig.credentials.merchantUid,
        apiUserId: apiUserId,
        apiKey: WaaFiConfig.credentials.apiKey,
        paymentMethod: WaaFiConfig.defaults.paymentMethod,
        payerInfo: { accountNo },
        transactionInfo: {
          referenceId,
          invoiceId: referenceId,
          amount: amount.toFixed(2),
          currency: WaaFiConfig.defaults.currency,
          description,
        },
      },
    };

    const response = await fetch(WaaFiConfig.baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error(chalk.red(ResponseCodes.GATEWAY_ERROR.message));
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.GATEWAY_ERROR.message,
          responseCode: ResponseCodes.GATEWAY_ERROR.code,
          key: ResponseCodes.GATEWAY_ERROR.key,
        }),
      );
    }

    return await response.json();
  }
}
