"use client";

import { useEffect, useState, useRef } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { socketService } from "@/actions/sockets/socketServiceAction";
import { SOCKET_EVENTS } from "@/actions/constant/sockets";
import { browserSupportsPush } from "./usePushNotifications";
import { playNotificationSound, initSound } from "./mobile/sound";

type MsgNotif = {
  key: string;
  href: string;
  senderName: string;
  content: string;
  avatar: string | null;
};

function extractMessage(data: unknown): {
  chatId: number;
  senderId: string;
  senderName: string;
  content: string;
  avatar: string | null;
  id?: number;
} | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, any>;
  const msg = d.message ?? d;
  if (!msg?.chatId) return null;
  return {
    chatId: msg.chatId,
    senderId: msg.senderId ?? msg.sender?.id ?? "",
    senderName: msg.senderName ?? msg.sender?.username ?? "Someone",
    content: msg.content ?? "",
    avatar: msg.senderAvatar ?? msg.sender?.profileImage ?? null,
    id: msg.id,
  };
}

export default function MessageNotificationToast() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [queue, setQueue] = useState<MsgNotif[]>([]);
  const seenIds = useRef<Set<number>>(new Set());
  const recentChats = useRef<Set<number>>(new Set());
  const onMessagesPage = !!pathname?.startsWith("/messages");

  const push = (notif: MsgNotif) =>
    setQueue((prev) => [...prev.slice(-2), notif]);

  useEffect(() => { initSound(); }, []);

  useEffect(() => {
    if (!user) return;
    const userId: string = user._id ?? user.id ?? "";

    const handle = (data: unknown) => {
      if (onMessagesPage) return;
      const msg = extractMessage(data);
      if (!msg) return;
      if (msg.senderId === userId) return;
      if (msg.id != null && seenIds.current.has(msg.id)) return;
      if (msg.id != null) seenIds.current.add(msg.id);

      recentChats.current.add(msg.chatId);
      setTimeout(() => recentChats.current.delete(msg.chatId), 8000);

      playNotificationSound();
      push({
        key: `${msg.id ?? Date.now()}-${Math.random()}`,
        href: `/messages/${msg.chatId}`,
        senderName: msg.senderName,
        content: msg.content || "Sent you a message",
        avatar: msg.avatar,
      });
    };

    const offNew = socketService.on(SOCKET_EVENTS.ON.NEW_MESSAGE, handle);
    const offReceive = socketService.on(SOCKET_EVENTS.ON.RECEIVE_MESSAGE, handle);
    return () => { offNew(); offReceive(); };
  }, [user, onMessagesPage]);

  useEffect(() => {
    if (!browserSupportsPush()) return;
    const handler = (event: MessageEvent) => {
      if (event.data?.type !== "push") return;
      if (onMessagesPage) return;
      const { title, body, url } = event.data.data as { title?: string; body?: string; url?: string };
      const pathMatch = url?.match(/\/messages\/(\d+)/);
      const chatId = pathMatch ? Number(pathMatch[1]) : 0;
      if (chatId && recentChats.current.has(chatId)) return;
      playNotificationSound();
      push({
        key: `sw-${Date.now()}-${Math.random()}`,
        href: url || "/messages",
        senderName: title || "New message",
        content: body || "",
        avatar: null,
      });
    };
    navigator.serviceWorker.addEventListener("message", handler);
    return () => navigator.serviceWorker.removeEventListener("message", handler);
  }, [onMessagesPage]);

  useEffect(() => {
    if (!queue.length) return;
    const t = setTimeout(() => setQueue((prev) => prev.slice(1)), 5000);
    return () => clearTimeout(t);
  }, [queue]);

  const dismiss = (key: string) =>
    setQueue((prev) => prev.filter((n) => n.key !== key));

  if (!queue.length) return null;

  return (
    <div className="fixed bottom-24 left-4 right-4 sm:left-auto sm:right-4 sm:w-80 z-50 flex flex-col gap-2 pointer-events-none">
      {queue.map((notif) => (
        <Link
          key={notif.key}
          href={notif.href}
          onClick={() => dismiss(notif.key)}
          className="flex items-center gap-3 bg-white rounded-2xl border border-gray-200 shadow-xl p-3 pr-2 animate-in slide-in-from-bottom-4 pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
            {notif.avatar ? (
              <img
                src={notif.avatar}
                alt={notif.senderName}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = "none"; }}
              />
            ) : (
              <span className="text-blue-600 font-bold text-sm">
                {notif.senderName.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm leading-tight">{notif.senderName}</p>
            <p className="text-xs text-gray-500 mt-0.5 truncate">{notif.content}</p>
          </div>
          <button
            onClick={(e) => { e.preventDefault(); dismiss(notif.key); }}
            className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0 touch-manipulation"
          >
            <X size={16} />
          </button>
        </Link>
      ))}
    </div>
  );
}
