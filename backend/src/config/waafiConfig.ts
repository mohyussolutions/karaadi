import {
  truncateAmount,
  validateAccountNumber,
} from "../core/utils/payment.utils.ts";
import { WaaFiConfig } from "../constants/payment.constants.ts";
import { ResponseCodes } from "./waafipay.service.responseCodes.ts";
import chalk from "chalk";

export class WaafiService {
  private isProduction(): boolean {
    return (
      process.env.NODE_ENV === "production" ||
      process.env.WAAFIPAY_ENVIRONMENT === "production"
    );
  }

  async processPayment(
    accountNo: string,
    amount: number,
    description: string,
    referenceId: string,
  ): Promise<any> {
    if (!this.isProduction()) {
      throw new Error(
        "Payment processing is only available in production environment.",
      );
    }

    const finalAmount = Number(truncateAmount(amount));

    if (!validateAccountNumber(accountNo)) {
      throw new Error(ResponseCodes.INVALID_HPPKEY.message);
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
    if (!url || url.trim() === "" || !url.startsWith("https")) {
      console.error(
        chalk.red("Production URL must be a valid HTTPS endpoint."),
      );
      throw new Error(
        JSON.stringify({
          success: false,
          message: errorResponse.message,
          responseCode: errorResponse.code,
          key: errorResponse.key,
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
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        JSON.stringify({
          success: false,
          message: errorData.description || ResponseCodes.GATEWAY_ERROR.message,
          responseCode: ResponseCodes.GATEWAY_ERROR.code,
          key: ResponseCodes.GATEWAY_ERROR.key,
        }),
      );
    }

    return await response.json();
  }
}
