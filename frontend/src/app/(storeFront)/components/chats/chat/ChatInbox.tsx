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

  const totalUnread = chatrooms.reduce((s, c) => s + (c.unreadCount || 0), 0);

  return (
    <div className="flex w-full h-full bg-white overflow-hidden sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-sm">

      <div className="flex flex-col h-full w-[72px] sm:w-[88px] lg:w-[320px] xl:w-[360px] flex-shrink-0 border-r border-gray-200 bg-white">

        <div className="hidden lg:block px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <h1 className="text-lg font-bold text-gray-900">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                {totalUnread}
              </span>
            )}
          </div>
          <input
            type="search"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder:text-gray-400 touch-manipulation"
            style={{ fontSize: "16px" }}
          />
        </div>

        <div
          className="flex-1 overflow-y-auto"
          style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {loading ? (
            <>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-center lg:justify-start gap-3 px-2 lg:px-4 py-3 border-b border-gray-100 animate-pulse">
                  <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-full bg-gray-200 flex-shrink-0" />
                  <div className="hidden lg:flex flex-1 flex-col gap-2">
                    <div className="h-3.5 bg-gray-200 rounded w-28" />
                    <div className="h-3 bg-gray-100 rounded w-44" />
                  </div>
                </div>
              ))}
            </>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-2 text-center">
              <MessageSquare className="w-7 h-7 text-gray-300 mb-1" />
              <p className="hidden lg:block text-xs text-gray-400 font-medium">
                {search ? "No results" : "No conversations"}
              </p>
            </div>
          ) : (
            filtered.map((room) => {
              const isSender = room.senderId === currentUserId;
              const otherName = isSender ? room.receiverName : room.senderName;
              const otherAvatar = isSender ? room.receiverAvatar : room.senderAvatar;
              const unread = room.unreadCount || 0;
              const isActive = activeChatId === room.chatId;

              return (
                <div key={room.chatId}>
                  <div
                    className="hidden lg:block"
                    onClick={() => handleSelect(room.chatId)}
                  >
                    <ConversationRow
                      chatroom={room}
                      isActive={isActive}
                      currentUserId={currentUserId}
                      onClick={handleSelect}
                      onDelete={handleDelete}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelect(room.chatId)}
                    className={`lg:hidden w-full flex items-center justify-center py-2.5 border-b border-gray-100 transition-colors touch-manipulation ${
                      isActive ? "bg-blue-50" : "active:bg-gray-50"
                    }`}
                  >
                    <div className="relative">
                      {otherAvatar ? (
                        <img
                          src={otherAvatar}
                          alt={otherName}
                          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover ring-2 ${isActive ? "ring-blue-500" : "ring-transparent"}`}
                          onError={(e) => { e.currentTarget.style.display = "none" }}
                        />
                      ) : (
                        <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-base ring-2 ${isActive ? "ring-blue-500" : "ring-transparent"}`}>
                          {(otherName || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      {unread > 0 && (
                        <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-0.5 leading-none">
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col min-w-0 h-full">
        {activeChatId && activeChatroom ? (
          <MessageThread
            chatId={activeChatId}
            chatroom={activeChatroom}
            currentUserId={currentUserId}
            onBack={undefined}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
              <MessageSquare className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" />
            </div>
            <p className="text-sm sm:text-base font-semibold text-gray-500">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}
