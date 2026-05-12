"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getUserChatrooms,
  createOrGetChat,
  deleteChatroom,
} from "@/services/chatService";
import { socketService } from "@/actions/sockets/socketServiceAction";
import ConversationRow from "./ConversationRow";
import MessageThread from "./MessageThread";
import type { Chatroom } from "@/app/utils/types/chat.types";
import { MessageSquare } from "lucide-react";

interface Props {
  initialChatId?: number;
  sellerId?: string;
  itemId?: string;
  itemModel?: string;
}

export default function ChatInbox({ initialChatId, sellerId, itemId, itemModel }: Props) {
  const { user } = useAuth();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<number | null>(initialChatId ?? null);
  const [search, setSearch] = useState("");
  const chatroomsRef = useRef<Chatroom[]>([]);
  const activeChatIdRef = useRef<number | null>(activeChatId);

  const currentUserId = user?._id || user?.id || "";

  useEffect(() => { chatroomsRef.current = chatrooms; }, [chatrooms]);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  useEffect(() => {
    if (!currentUserId) { setLoading(true); return; }

    if (initialChatId) {
      getUserChatrooms(currentUserId).then((rooms) => {
        setChatrooms(rooms);
        setActiveChatId(initialChatId);
        setLoading(false);
      });
      return;
    }

    if (sellerId && itemId) {
      const roomsP = getUserChatrooms(currentUserId);
      const chatP = createOrGetChat({
        senderId: currentUserId,
        receiverId: sellerId,
        itemId,
        itemModel: itemModel || "Marketplace",
      });
      Promise.all([roomsP, chatP])
        .then(([rooms, newRoom]) => {
          setChatrooms(() => {
            const exists = rooms.some((r) => r.chatId === newRoom.chatId);
            return exists ? rooms : [newRoom, ...rooms];
          });
          setActiveChatId(newRoom.chatId);
        })
        .catch(() => roomsP.then((rooms) => setChatrooms(rooms)))
        .finally(() => setLoading(false));
      return;
    }

    getUserChatrooms(currentUserId).then((rooms) => {
      setChatrooms(rooms);
      setLoading(false);
    });
  }, [currentUserId, initialChatId, sellerId, itemId, itemModel]);

  useEffect(() => {
    if (!currentUserId) return;
    socketService.connect(currentUserId);

    const off = socketService.on("newMessage", (data: unknown) => {
      const { chatId, message } = data as { chatId: string; message: any };
      const numId = Number(chatId);
      if (!numId || !message) return;
      setChatrooms((prev) => {
        const idx = prev.findIndex((c) => c.chatId === numId);
        if (idx === -1) {
          getUserChatrooms(currentUserId).then((rooms) => {
            const fresh = rooms.find((r) => r.chatId === numId);
            if (fresh) setChatrooms((cur) => cur.some((c) => c.chatId === numId) ? cur : [fresh, ...cur]);
          });
          return prev;
        }
        const updated = [...prev];
        const room = { ...updated[idx] };
        room.lastMessage = message.content;
        room.lastMessageAt = message.timestamp || new Date().toISOString();
        if (message.senderId !== currentUserId && numId !== (activeChatIdRef.current ?? -1)) {
          room.unreadCount = (room.unreadCount || 0) + 1;
        }
        updated.splice(idx, 1);
        return [room, ...updated];
      });
    });

    return () => off();
  }, [currentUserId]);

  const handleSelect = useCallback((chatId: number) => {
    const room = chatroomsRef.current.find((c) => c.chatId === chatId);
    const unread = room?.unreadCount || 0;
    setActiveChatId(chatId);
    setChatrooms((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c)));
    if (unread > 0 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("karaadi:messages-read", { detail: { unread } }));
    }
  }, []);

  const handleDelete = useCallback(async (chatId: number) => {
    const ok = await deleteChatroom(chatId, currentUserId);
    if (!ok) return;
    setChatrooms((prev) => prev.filter((c) => c.chatId !== chatId));
    if (activeChatId === chatId) setActiveChatId(null);
  }, [currentUserId, activeChatId]);

  const handleNewMessage = useCallback((chatId: number, lastMessage: string, lastMessageAt: string) => {
    setChatrooms((prev) => {
      const idx = prev.findIndex((c) => c.chatId === chatId);
      if (idx === -1) return prev;
      const updated = [...prev];
      const room = { ...updated[idx], lastMessage, lastMessageAt };
      updated.splice(idx, 1);
      return [room, ...updated];
    });
  }, []);

  const activeChatroom = chatrooms.find((c) => c.chatId === activeChatId);
  const totalUnread = chatrooms.reduce((s, c) => s + (c.unreadCount || 0), 0);

  const filtered = chatrooms
    .filter((c) => {
      if (!search) return true;
      const q = search.toLowerCase();
      const isSender = c.senderId === currentUserId;
      const name = isSender ? c.receiverName : c.senderName;
      return (
        name.toLowerCase().includes(q) ||
        (c.lastMessage || "").toLowerCase().includes(q) ||
        (c.itemTitle || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return tb - ta;
    });

  return (
    <div style={{ display: "flex", flexDirection: "row", width: "100%", height: "100%", backgroundColor: "white" }}>

      <div
        style={{ flexShrink: 0, height: "100%", flexDirection: "column", borderRight: "1px solid #e5e7eb", backgroundColor: "white" }}
        className="flex w-[72px] sm:w-[260px] lg:w-[300px] xl:w-[340px]"
      >
        <div className="flex flex-col px-2 sm:px-4 pt-3 pb-2 border-b border-gray-200 flex-shrink-0 gap-2 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="hidden sm:block text-base font-bold text-gray-900 flex-1">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalUnread}
              </span>
            )}
          </div>
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="hidden sm:block w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0063fb] bg-gray-50 placeholder:text-gray-400 touch-manipulation text-sm font-medium text-gray-900"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div
          style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-2 px-2 sm:px-4 py-3 border-b border-gray-100 animate-pulse">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="hidden sm:flex flex-1 flex-col gap-2">
                  <div className="h-3.5 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-36" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-2 text-center gap-2">
              <MessageSquare className="w-6 h-6 text-gray-300" />
              <p className="hidden sm:block text-xs text-gray-400">No conversations</p>
            </div>
          ) : (
            filtered.map((room) => (
              <ConversationRow
                key={room.chatId}
                chatroom={room}
                isActive={activeChatId === room.chatId}
                currentUserId={currentUserId}
                onClick={handleSelect}
                onDelete={handleDelete}
              />
            ))
          )}
        </div>
      </div>

      <div style={{ flex: 1, flexDirection: "column", height: "100%", minWidth: 0, overflow: "hidden" }} className="flex">
        {activeChatId && activeChatroom ? (
          <MessageThread
            chatId={activeChatId}
            chatroom={activeChatroom}
            currentUserId={currentUserId}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-6 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <MessageSquare className="w-7 h-7 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600">No conversation selected</p>
              <p className="text-xs text-gray-400 mt-0.5">Pick one from the list</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
