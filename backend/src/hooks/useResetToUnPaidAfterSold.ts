import { DAYS_FOR_SOLD_RESET, MS_PER_DAY } from "../config/contstanst.js";

export const useResetToUnPaidAfterSold = () => {
  const thresholdDate = new Date(Date.now() - DAYS_FOR_SOLD_RESET * MS_PER_DAY);

  return {
    where: {
      maGaday: true,
      soldAt: { lte: thresholdDate },
    },
    data: {
      maGaday: false,
      isPaid: false,
    },
  };
};
