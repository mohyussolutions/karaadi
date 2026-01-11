export const waafiPayPurchaseTest = async (
  accountNo: string,
  amount: number,
  transactionId: string,
  description: string
) => {
  await new Promise((resolve) => setTimeout(resolve, 500));

  return {
    errorCode: "0",
    responseCode: "2001",
    responseMsg: "Done Successfully",
    params: {
      transactionId: `MOCK-${transactionId}-${Date.now()}`,
    },
  };
};
