import { WaaFiConfig } from "config/waafipay.config.ts";
import { parseWaafiError } from "config/waafipay.errors.ts";

export const waafiPayPurchase = async (
  accountNo: string,
  amount: number,
  referenceId: string,
  description: string
): Promise<any> => {
  const payload = {
    schemaVersion: "1.0",
    requestId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    channelName: "WEB",
    serviceName: "API_PURCHASE",
    serviceParams: {
      merchantUid: WaaFiConfig.credentials.merchantUid,
      apiUserId: WaaFiConfig.credentials.apiUserId,
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

  const response = await fetch(WaaFiConfig.baseUrl!, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const text = await response.text();

  if (!response.ok) {
    const errorResult = parseWaafiError(text);
    throw new Error(`${errorResult.message} (${errorResult.error})`);
  }

  const data = JSON.parse(text);
  const result = parseWaafiError(data);

  if (!result.isSuccess) {
    throw new Error(`${result.message} - Code: ${result.responseCode}`);
  }

  return data;
};
