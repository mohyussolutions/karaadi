import { DAYS_FOR_UPLOADING_AGAIN, MS_PER_DAY } from "config/contstanst.ts";

export const useResetOldPaidItems = () => {
  const thresholdDate = new Date(
    Date.now() - DAYS_FOR_UPLOADING_AGAIN * MS_PER_DAY
  );

  return {
    where: {
      isPaid: true,
      createdAt: { lte: thresholdDate },
    },
    data: { isPaid: false },
  };
};
