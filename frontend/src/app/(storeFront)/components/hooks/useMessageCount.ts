"use client";

import { useState, useEffect } from "react";
import { getUnreadMessageCount } from "@/services/chatService";
import { socketService } from "@/actions/sockets/socketServiceAction";
import { SOCKET_EVENTS } from "@/actions/constant/sockets";

export function useMessageCount(userId: string | undefined) {
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (!userId) return;
    let active = true;

    getUnreadMessageCount(userId)
      .then((count) => { if (active) setMessageCount(count); })
      .catch(() => { if (active) setMessageCount(0); });

    socketService.connect(userId);

    const offUnread = socketService.on(SOCKET_EVENTS.ON.UNREAD_COUNT_UPDATE, (data: unknown) => {
      const d = data as { count?: number };
      if (typeof d?.count === "number" && active) setMessageCount(d.count);
    });

    const offNewMessage = socketService.on(SOCKET_EVENTS.ON.NEW_MESSAGE, (data: unknown) => {
      const msg = (data as any)?.message ?? data;
      if (msg?.senderId && msg.senderId !== userId && active) {
        setMessageCount((prev) => prev + 1);
      }
    });

    const offMarkedRead = socketService.on(SOCKET_EVENTS.ON.MESSAGES_MARKED_AS_READ, () => {
      if (active) setMessageCount(0);
    });

    const onWindowRead = (e: Event) => {
      const unread = (e as CustomEvent).detail?.unread;
      if (typeof unread === "number") {
        setMessageCount((prev) => Math.max(0, prev - unread));
      } else {
        setMessageCount(0);
      }
    };
    window.addEventListener("karaadi:messages-read", onWindowRead);

    return () => {
      active = false;
      offUnread();
      offNewMessage();
      offMarkedRead();
      window.removeEventListener("karaadi:messages-read", onWindowRead);
    };
  }, [userId]);

  return { messageCount };
}
