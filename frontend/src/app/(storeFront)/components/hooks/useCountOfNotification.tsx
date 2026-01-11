import { useMemo } from "react";

export const useCountOfNotifications = (
  notifications: { isRead: boolean }[] | null
) => {
  return useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n) => !n.isRead).length;
  }, [notifications]);
};
