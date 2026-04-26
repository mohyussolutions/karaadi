"use client";

import { useState, useEffect } from "react";
import { getUnreadMessageCount } from "@/services/chatService";
import { socketService } from "@/actions/sockets/socketService";

export function useMessageCount(userId: string | undefined) {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const handler = (e: Event) => {
      const unread = (e as CustomEvent).detail?.unread;
      if (typeof unread === "number" && unread > 0) {
        setMessageCount((prev) => Math.max(0, prev - unread));
      } else {
        setMessageCount(0);
      }
    };
    window.addEventListener("karaadi:messages-read", handler);
    return () => window.removeEventListener("karaadi:messages-read", handler);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    let active = true;

    getUnreadMessageCount(userId)
      .then((count) => { if (active) setMessageCount(count); })
      .catch(() => { if (active) setMessageCount(0); });

    socketService.connect(userId);

    const offUnread = socketService.on("unreadCountUpdate", (data: unknown) => {
      const { count } = data as { count: number };
      if (typeof count === "number" && active) setMessageCount(count);
    });

    const offNewMessage = socketService.on("newMessage", (data: unknown) => {
      const { message } = (data as any) || {};
      if (message?.senderId && message.senderId !== userId) {
        if (active) setMessageCount((prev) => prev + 1);
      }
    });

    const offMarkedRead = socketService.on("messagesMarkedAsRead", () => {});

    return () => {
      active = false;
      offUnread();
      offNewMessage();
      offMarkedRead();
    };
  }, [userId]);

  return { messageCount };
}
