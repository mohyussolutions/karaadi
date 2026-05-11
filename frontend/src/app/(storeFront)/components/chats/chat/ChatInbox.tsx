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
  const [showThread, setShowThread] = useState(!!initialChatId || !!(sellerId && itemId));
  const chatroomsRef = useRef<Chatroom[]>([]);
  const activeChatIdRef = useRef<number | null>(activeChatId);

  const currentUserId = user?._id || user?.id || "";

  useEffect(() => {
    chatroomsRef.current = chatrooms;
  }, [chatrooms]);

  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  useEffect(() => {
    if (!currentUserId) {
      setLoading(true);
      return;
    }

    if (initialChatId) {
      getUserChatrooms(currentUserId).then((rooms) => {
        setChatrooms(rooms);
        setActiveChatId(initialChatId);
        setLoading(false);
      });
      return;
    }

    if (sellerId && itemId) {
      const roomsPromise = getUserChatrooms(currentUserId);
      const chatPromise = createOrGetChat({
        senderId: currentUserId,
        receiverId: sellerId,
        itemId,
        itemModel: itemModel || "Marketplace",
      });

      Promise.all([roomsPromise, chatPromise])
        .then(([rooms, newRoom]) => {
          setChatrooms(() => {
            const exists = rooms.some((r) => r.chatId === newRoom.chatId);
            return exists ? rooms : [newRoom, ...rooms];
          });
          setActiveChatId(newRoom.chatId);
          setShowThread(true);
        })
        .catch(() => {
          setShowThread(false);
          roomsPromise.then((rooms) => setChatrooms(rooms));
        })
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

    const handleNew = (data: unknown) => {
      const { chatId, message } = data as { chatId: string; message: any };
      const numId = Number(chatId);
      if (!numId || !message) return;

      setChatrooms((prev) => {
        const idx = prev.findIndex((c) => c.chatId === numId);

        if (idx === -1) {
          getUserChatrooms(currentUserId).then((rooms) => {
            const fresh = rooms.find((r) => r.chatId === numId);
            if (fresh) {
              setChatrooms((cur) => {
                if (cur.some((c) => c.chatId === numId)) return cur;
                return [fresh, ...cur];
              });
            }
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
    };

    const off = socketService.on("newMessage", handleNew);
    return () => off();
  }, [currentUserId]);

  const handleSelect = useCallback((chatId: number) => {
    const room = chatroomsRef.current.find((c) => c.chatId === chatId);
    const unread = room?.unreadCount || 0;
    setActiveChatId(chatId);
    setShowThread(true);
    setChatrooms((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c)));
    if (unread > 0 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("karaadi:messages-read", { detail: { unread } }));
    }
  }, []);

  const handleBack = useCallback(() => {
    setShowThread(false);
  }, []);

  const handleDelete = useCallback(async (chatId: number) => {
    const ok = await deleteChatroom(chatId, currentUserId);
    if (!ok) return;
    setChatrooms((prev) => prev.filter((c) => c.chatId !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setShowThread(false);
    }
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

  const listPanelClass = showThread && !!activeChatroom
    ? "hidden lg:flex lg:flex-col lg:w-[320px] xl:w-[360px] lg:flex-shrink-0 lg:min-h-0 lg:border-r lg:border-gray-200 lg:bg-white"
    : "flex flex-col w-full lg:w-[320px] xl:w-[360px] flex-shrink-0 min-h-0 border-r border-gray-200 bg-white";

  const threadPanelClass = showThread && !!activeChatroom
    ? "flex flex-1 flex-col min-h-0 min-w-0"
    : "hidden lg:flex lg:flex-1 lg:flex-col lg:min-h-0 lg:min-w-0";

  return (
    <div className="flex flex-1 min-h-0 h-full bg-white overflow-hidden sm:rounded-xl sm:border sm:border-gray-200 sm:shadow-sm">
      <div className={listPanelClass}>
        <div className="px-4 pt-4 pb-3 border-b border-gray-100 flex-shrink-0">
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
          className="flex-1 min-h-0 overflow-y-auto"
          style={{ overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}
        >
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-44" />
                  <div className="h-3 bg-gray-100 rounded w-36" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="font-semibold text-gray-700">No conversations</p>
              <p className="text-sm text-gray-400 mt-1">
                {search ? "No results found" : "Start by contacting a seller"}
              </p>
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

      <div className={threadPanelClass}>
        {activeChatId && activeChatroom ? (
          <MessageThread
            chatId={activeChatId}
            chatroom={activeChatroom}
            currentUserId={currentUserId}
            onBack={handleBack}
            onNewMessage={handleNewMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-center px-6">
            <div className="w-20 h-20 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-4 shadow-sm">
              <MessageSquare className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-lg font-semibold text-gray-600">Select a conversation</p>
            <p className="text-sm text-gray-400 mt-1">Choose a conversation from the list</p>
          </div>
        )}
      </div>
    </div>
  );
}
