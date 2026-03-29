import {
  truncateAmount,
  validateAccountNumber,
} from "../core/utils/payment.utils.ts";
import { ResponseCodes } from "./waafipay.service.responseCodes.ts";
import chalk from "chalk";

export class WaafiService {
  private isProduction(): boolean {
    return (
      process.env.NODE_ENV === "production" &&
      process.env.USE_WAAFIPAY_PROD === "true"
    );
  }

  async processPayment(
    accountNo: string,
    amount: number,
    description: string,
    referenceId: string,
  ): Promise<any> {
    const finalAmount = Number(truncateAmount(amount));

    if (!validateAccountNumber(accountNo)) {
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.INVALID_ACCOUNT.message,
          responseCode: ResponseCodes.INVALID_ACCOUNT.code,
          key: ResponseCodes.INVALID_ACCOUNT.key,
        }),
      );
    }

    if (!this.isProduction()) {
      throw new Error(
        JSON.stringify({
          success: false,
          message:
            "Payment processing is only available in production environment.",
          responseCode: 403,
          key: "PRODUCTION_ONLY",
        }),
      );
    }

    return this.processRealPayment(
      accountNo,
      finalAmount,
      description,
      referenceId,
    );
  }

  private validateUrl(url: string): void {
    if (!url || url.trim() === "" || !url.startsWith("https")) {
      console.error(
        chalk.red("Production URL must be a valid HTTPS endpoint."),
      );
      throw new Error(
        JSON.stringify({
          success: false,
          message: ResponseCodes.CONFIGURATION_ERROR.message,
          responseCode: ResponseCodes.CONFIGURATION_ERROR.code,
          key: ResponseCodes.CONFIGURATION_ERROR.key,
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
    const baseUrl = process.env.WAAFIPAY_PRODUCTION_URL;

    if (!baseUrl) {
      throw new Error(
        JSON.stringify({
          success: false,
          message: "WAAFIPAY_PRODUCTION_URL is not configured",
          responseCode: ResponseCodes.CONFIGURATION_ERROR.code,
          key: ResponseCodes.CONFIGURATION_ERROR.key,
        }),
      );
    }

    this.validateUrl(baseUrl);

    const merchantUid = process.env.WAAFIPAY_MERCHANT_UID;
    const apiUserId = process.env.WAAFIPAY_API_USER_ID;
    const apiKey = process.env.WAAFIPAY_API_KEY;

    if (!merchantUid || !apiUserId || !apiKey) {
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

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const payload = {
        schemaVersion: "1.0",
        requestId: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        channelName: "WEB",
        serviceName: "API_PURCHASE",
        serviceParams: {
          merchantUid: merchantUid,
          apiUserId: parseInt(apiUserId, 10),
          apiKey: apiKey,
          paymentMethod: "MWALLET_ACCOUNT",
          payerInfo: { accountNo },
          transactionInfo: {
            referenceId,
            invoiceId: referenceId,
            amount: amount.toFixed(2),
            currency: "USD",
            description,
          },
        },
      };

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseData = await response.json();

      if (!response.ok) {
        console.error(chalk.red(ResponseCodes.GATEWAY_ERROR.message));
        throw new Error(
          JSON.stringify({
            success: false,
            message:
              responseData.description || ResponseCodes.GATEWAY_ERROR.message,
            responseCode: ResponseCodes.GATEWAY_ERROR.code,
            key: ResponseCodes.GATEWAY_ERROR.key,
          }),
        );
      }

      return responseData;
    } catch (error: any) {
      clearTimeout(timeoutId);

      if (error.name === "AbortError") {
        throw new Error(
          JSON.stringify({
            success: false,
            message: "Payment request timeout",
            responseCode: 408,
            key: "REQUEST_TIMEOUT",
          }),
        );
      }

      throw error;
    }
  }
}
