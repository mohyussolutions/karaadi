"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { socketService } from "@/actions/sockets/socketServiceAction";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { addNotification } from "@/store/slices/reducers/notificationsSlice";

const useNotificationSocket = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const userId: string | undefined = user?.id || user?._id;
    if (!userId) return;

    socketService.connect(userId);

    const removeWantedMatch = socketService.on(
      "wanted_match",
      (data: unknown) => {
        const d = data as Record<string, any>;
        dispatch(
          addNotification({
            id: d?.id || String(Date.now()),
            type: "wanted_match",
            message: d?.message || "A new match was found for your wanted post",
            link: d?.link || "/wanted",
            read: false,
            createdAt: d?.createdAt || new Date().toISOString(),
          }),
        );
      },
    );

    const removeIHaveThis = socketService.on(
      "i_have_this",
      (data: unknown) => {
        const d = data as Record<string, any>;
        dispatch(
          addNotification({
            id: d?.id || String(Date.now()),
            type: "i_have_this",
            message: d?.message || "Someone responded to your wanted post",
            link: d?.link || "/wanted",
            read: false,
            createdAt: d?.createdAt || new Date().toISOString(),
          }),
        );
      },
    );

    const removeNewNotification = socketService.on(
      "newNotification",
      (data: unknown) => {
        const notifications = Array.isArray(data) ? data : [data];
        notifications.forEach((n: any) => {
          dispatch(
            addNotification({
              id: n?.id || String(Date.now()),
              type: n?.category || "subscription_alert",
              message: n?.message || "A new item matches your alert",
              link: "/notifications",
              read: false,
              createdAt: n?.createdAt || new Date().toISOString(),
            }),
          );
        });
      },
    );

    const removeSubscriptionMatch = socketService.on(
      "subscription_match",
      (data: unknown) => {
        const d = data as Record<string, any>;
        dispatch(
          addNotification({
            id: d?.id || String(Date.now()),
            type: "subscription_match",
            message: d?.message || "A new listing matches your subscription",
            link: d?.link || "/notifications",
            read: false,
            createdAt: d?.createdAt || new Date().toISOString(),
          }),
        );
      },
    );

    const removeNotification = socketService.on(
      "notification",
      (data: unknown) => {
        const d = data as Record<string, any>;
        dispatch(
          addNotification({
            id: d?.id || String(Date.now()),
            type: d?.type || "notification",
            message: d?.message || "You have a new notification",
            link: d?.link || "/notifications",
            read: false,
            createdAt: d?.createdAt || new Date().toISOString(),
          }),
        );
      },
    );

    return () => {
      removeWantedMatch();
      removeIHaveThis();
      removeNewNotification();
      removeSubscriptionMatch();
      removeNotification();
    };
  }, [user, dispatch]);
};

export default useNotificationSocket;
