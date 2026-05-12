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

  const sorted = [...chatrooms].sort((a, b) => {
    const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
    const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
    return tb - ta;
  });

  const filtered = sorted.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    const isSender = c.senderId === currentUserId;
    const name = isSender ? c.receiverName : c.senderName;
    return (
      name.toLowerCase().includes(q) ||
      (c.lastMessage || "").toLowerCase().includes(q) ||
      (c.itemTitle || "").toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "white" }}>

      {/* Desktop sidebar */}
      <div
        style={{ flexShrink: 0, height: "100%", flexDirection: "column", borderRight: "1px solid #e5e7eb", backgroundColor: "white" }}
        className="hidden lg:flex lg:w-[300px] xl:w-[340px]"
      >
        <div className="flex flex-col px-4 pt-4 pb-3 border-b border-gray-200 flex-shrink-0 gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-gray-900 flex-1">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                {totalUnread}
              </span>
            )}
          </div>
          <input
            type="search"
            placeholder="Search conversations…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#0063fb] bg-gray-50 placeholder:text-gray-400 text-sm font-medium text-gray-900"
            style={{ fontSize: "16px" }}
          />
        </div>
        <div style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 animate-pulse">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded w-28" />
                  <div className="h-3 bg-gray-100 rounded w-44" />
                </div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                <MessageSquare className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-semibold text-gray-600 text-sm">No conversations</p>
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

      {/* Mobile layout — full column */}
      <div className="flex lg:hidden flex-col flex-1 min-w-0" style={{ height: "100%" }}>

        {/* Users strip */}
        <div className="flex-shrink-0 bg-white border-b-2 border-gray-200">
          <div className="flex items-center justify-between px-4 pt-3 pb-1">
            <h1 className="text-sm font-bold text-gray-900">Messages</h1>
            {totalUnread > 0 && (
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {totalUnread}
              </span>
            )}
          </div>

          {loading ? (
            <div style={{ display: "flex", gap: "16px", padding: "12px 16px", overflowX: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#e5e7eb" }} />
                  <div style={{ width: 44, height: 10, borderRadius: 4, backgroundColor: "#e5e7eb" }} />
                </div>
              ))}
            </div>
          ) : sorted.length === 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", color: "#9ca3af" }}>
              <MessageSquare size={16} />
              <span style={{ fontSize: 13 }}>No conversations yet</span>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                gap: "20px",
                padding: "12px 16px",
                overflowX: "auto",
                WebkitOverflowScrolling: "touch",
              } as React.CSSProperties}
            >
              {sorted.map((room) => {
                const isSender = room.senderId === currentUserId;
                const name = isSender ? room.receiverName : room.senderName;
                const avatar = isSender ? room.receiverAvatar : room.senderAvatar;
                const unread = room.unreadCount || 0;
                const isActive = activeChatId === room.chatId;

                return (
                  <button
                    key={room.chatId}
                    type="button"
                    onClick={() => handleSelect(room.chatId)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0, background: "none", border: "none", padding: 0, cursor: "pointer" }}
                  >
                    <div style={{ position: "relative", width: 56, height: 56, borderRadius: "50%", outline: isActive ? "3px solid #0063fb" : "3px solid transparent", outlineOffset: 2 }}>
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          style={{ width: 56, height: 56, borderRadius: "50%", objectFit: "cover" }}
                        />
                      ) : (
                        <div style={{ width: 56, height: 56, borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontWeight: "bold", fontSize: 20 }}>
                          {(name || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                      {unread > 0 && (
                        <span style={{ position: "absolute", top: -2, right: -2, minWidth: 18, height: 18, backgroundColor: "#ef4444", color: "white", fontSize: 10, fontWeight: "bold", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", padding: "0 3px" }}>
                          {unread > 9 ? "9+" : unread}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? "#0063fb" : "#374151", maxWidth: 56, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textAlign: "center" }}>
                      {(name || "?").split(" ")[0]}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Thread area */}
        <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
          {activeChatId && activeChatroom ? (
            <MessageThread
              chatId={activeChatId}
              chatroom={activeChatroom}
              currentUserId={currentUserId}
              onNewMessage={handleNewMessage}
            />
          ) : (
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: "#f9fafb", gap: 12, padding: "0 24px", textAlign: "center" }}>
                <MessageSquare size={40} color="#d1d5db" />
                <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Tap a user above to start chatting</p>
              </div>
              <div style={{ backgroundColor: "white", borderTop: "2px solid #e5e7eb", padding: "12px", paddingBottom: "max(12px, env(safe-area-inset-bottom, 0px))" }}>
                <div style={{ display: "flex", alignItems: "center", minHeight: 56, backgroundColor: "white", border: "2px solid #d1d5db", borderRadius: 16, padding: "12px 16px" }}>
                  <span style={{ fontSize: 15, color: "#9ca3af" }}>Write a message…</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop thread panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", height: "100%", minWidth: 0, overflow: "hidden" }} className="hidden lg:flex">
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
            <p className="text-sm font-semibold text-gray-600">Select a conversation</p>
          </div>
        )}
      </div>

    </div>
  );
}
