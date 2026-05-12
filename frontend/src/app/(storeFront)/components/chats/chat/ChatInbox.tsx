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

interface SidebarProps {
  filtered: Chatroom[];
  loading: boolean;
  search: string;
  onSearch: (v: string) => void;
  totalUnread: number;
  activeChatId: number | null;
  currentUserId: string;
  onSelect: (id: number) => void;
  onDelete: (id: number) => void;
}

function Sidebar({ filtered, loading, search, onSearch, totalUnread, activeChatId, currentUserId, onSelect, onDelete }: SidebarProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "white" }}>
      <div style={{ padding: "16px 16px 12px", borderBottom: "2px solid #e5e7eb", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <h1 style={{ fontSize: 15, fontWeight: 700, color: "#111827", flex: 1, margin: 0 }}>Messages</h1>
          {totalUnread > 0 && (
            <span style={{ backgroundColor: "#2563eb", color: "white", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999 }}>
              {totalUnread}
            </span>
          )}
        </div>
        <input
          type="search"
          placeholder="Search conversations…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          style={{ width: "100%", fontSize: 16, padding: "10px 14px", border: "2px solid #e5e7eb", borderRadius: 12, backgroundColor: "#f9fafb", color: "#111827", outline: "none", boxSizing: "border-box" }}
        />
      </div>
      <div style={{ flex: 1, overflowY: "auto", WebkitOverflowScrolling: "touch" } as React.CSSProperties}>
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderBottom: "1px solid #f3f4f6" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", backgroundColor: "#e5e7eb", flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ height: 13, backgroundColor: "#e5e7eb", borderRadius: 4, width: 110, marginBottom: 8 }} />
                <div style={{ height: 11, backgroundColor: "#f3f4f6", borderRadius: 4, width: 160 }} />
              </div>
            </div>
          ))
        ) : filtered.length === 0 ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 24px", gap: 12, textAlign: "center" }}>
            <MessageSquare size={36} color="#d1d5db" />
            <p style={{ fontWeight: 600, color: "#6b7280", fontSize: 14, margin: 0 }}>No conversations</p>
            <p style={{ color: "#9ca3af", fontSize: 12, margin: 0 }}>{search ? "No results found" : "Start by contacting a seller"}</p>
          </div>
        ) : (
          filtered.map((room) => (
            <ConversationRow
              key={room.chatId}
              chatroom={room}
              isActive={activeChatId === room.chatId}
              currentUserId={currentUserId}
              onClick={onSelect}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default function ChatInbox({ initialChatId, sellerId, itemId, itemModel }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeChatId, setActiveChatId] = useState<number | null>(initialChatId ?? null);
  const [showThread, setShowThread] = useState(!!initialChatId || !!(sellerId && itemId));
  const [search, setSearch] = useState("");
  const chatroomsRef = useRef<Chatroom[]>([]);
  const activeChatIdRef = useRef<number | null>(activeChatId);
  const lastFetchedUserId = useRef<string>("");

  const currentUserId = user?._id || user?.id || "";
  const authToken = (user as any)?.token || (user as any)?.accessToken || (user as any)?.idToken || "";

  useEffect(() => { chatroomsRef.current = chatrooms; }, [chatrooms]);
  useEffect(() => { activeChatIdRef.current = activeChatId; }, [activeChatId]);

  useEffect(() => {
    if (authLoading) return;
    if (!currentUserId) { setLoading(false); return; }
    if (lastFetchedUserId.current === currentUserId) return;
    lastFetchedUserId.current = currentUserId;

    setLoading(true);

    if (initialChatId) {
      getUserChatrooms(currentUserId, authToken).then((rooms) => {
        if (rooms.length > 0) setChatrooms(rooms);
        setActiveChatId(initialChatId);
        setShowThread(true);
        setLoading(false);
      }).catch(() => setLoading(false));
      return;
    }

    if (sellerId && itemId) {
      const roomsP = getUserChatrooms(currentUserId, authToken);
      const chatP = createOrGetChat({ senderId: currentUserId, receiverId: sellerId, itemId, itemModel: itemModel || "Marketplace" });
      Promise.all([roomsP, chatP])
        .then(([rooms, newRoom]) => {
          setChatrooms(() => {
            const exists = rooms.some((r) => r.chatId === newRoom.chatId);
            return exists ? rooms : [newRoom, ...rooms];
          });
          setActiveChatId(newRoom.chatId);
          setShowThread(true);
        })
        .catch(() => roomsP.then((rooms) => setChatrooms(rooms)))
        .finally(() => setLoading(false));
      return;
    }

    getUserChatrooms(currentUserId, authToken).then((rooms) => {
      if (rooms.length > 0) {
        setChatrooms(rooms);
        setLoading(false);
      } else {
        setTimeout(() => {
          getUserChatrooms(currentUserId, authToken).then((retried) => {
            setChatrooms(retried);
            setLoading(false);
          }).catch(() => setLoading(false));
        }, 800);
      }
    }).catch(() => setLoading(false));
  }, [authLoading, currentUserId, authToken, initialChatId, sellerId, itemId, itemModel]);

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
          getUserChatrooms(currentUserId, authToken).then((rooms) => {
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
    setShowThread(true);
    setChatrooms((prev) => prev.map((c) => (c.chatId === chatId ? { ...c, unreadCount: 0 } : c)));
    if (unread > 0 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("karaadi:messages-read", { detail: { unread } }));
    }
  }, []);

  const handleBack = useCallback(() => setShowThread(false), []);

  const handleDelete = useCallback(async (chatId: number) => {
    const ok = await deleteChatroom(chatId, currentUserId);
    if (!ok) return;
    setChatrooms((prev) => prev.filter((c) => c.chatId !== chatId));
    if (activeChatId === chatId) { setActiveChatId(null); setShowThread(false); }
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
      return name.toLowerCase().includes(q) || (c.lastMessage || "").toLowerCase().includes(q) || (c.itemTitle || "").toLowerCase().includes(q);
    })
    .sort((a, b) => new Date(b.lastMessageAt || 0).getTime() - new Date(a.lastMessageAt || 0).getTime());

  const sidebarProps: SidebarProps = { filtered, loading: loading || authLoading, search, onSearch: setSearch, totalUnread, activeChatId, currentUserId, onSelect: handleSelect, onDelete: handleDelete };

  const threadPanel = activeChatId && activeChatroom ? (
    <MessageThread chatId={activeChatId} chatroom={activeChatroom} currentUserId={currentUserId} onBack={handleBack} onNewMessage={handleNewMessage} />
  ) : (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", backgroundColor: "#f9fafb", gap: 12 }}>
      <MessageSquare size={40} color="#d1d5db" />
      <p style={{ fontSize: 14, fontWeight: 600, color: "#6b7280", margin: 0 }}>Select a conversation</p>
    </div>
  );

  return (
    <div style={{ display: "flex", width: "100%", height: "100%", backgroundColor: "white" }}>

      {/* Mobile: full-width, toggle list ↔ thread */}
      <div className="flex lg:hidden" style={{ width: "100%", height: "100%" }}>
        {!showThread
          ? <Sidebar {...sidebarProps} />
          : <div style={{ width: "100%", height: "100%" }}>{threadPanel}</div>
        }
      </div>

      {/* Desktop: sidebar + thread side by side */}
      <div className="hidden lg:flex" style={{ width: "100%", height: "100%" }}>
        <div style={{ width: 300, flexShrink: 0, height: "100%", borderRight: "1px solid #e5e7eb" }}>
          <Sidebar {...sidebarProps} />
        </div>
        <div style={{ flex: 1, height: "100%", minWidth: 0, overflow: "hidden" }}>
          {threadPanel}
        </div>
      </div>

    </div>
  );
}
