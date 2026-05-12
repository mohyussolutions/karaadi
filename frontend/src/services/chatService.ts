import type { ChatMessage, Chatroom } from "@/app/utils/types/chat.types";
import { CHATS, MESSAGES } from "@/actions/constant/sockets";

function mapChat(chat: any): Chatroom {
  const item =
    chat.item ||
    chat.marketplace ||
    chat.car ||
    chat.boat ||
    chat.motorcycle ||
    chat.realEstate ||
    chat.farmequipment ||
    null;
  return {
    chatId: chat.id,
    senderId: chat.senderId,
    senderName: chat.sender?.username || "User",
    senderAvatar: chat.sender?.profileImage || null,
    receiverId: chat.receiverId,
    receiverName: chat.receiver?.username || "User",
    receiverAvatar: chat.receiver?.profileImage || null,
    lastMessage: chat.messages?.[0]?.content || null,
    lastMessageAt: chat.messages?.[0]?.timestamp || chat.updatedAt || null,
    unreadCount: 0,
    updatedAt: chat.updatedAt,
    itemTitle: item?.title || null,
    itemImage: item?.images?.[0] || null,
    itemPrice: item?.price || null,
  };
}

function mapMessage(msg: any): ChatMessage {
  return {
    id: msg.id,
    chatId: msg.chatId,
    senderId: msg.senderId,
    senderName: msg.sender?.username || "User",
    senderAvatar: msg.sender?.profileImage || null,
    content: msg.content,
    timestamp: msg.timestamp || msg.createdAt,
    createdAt: msg.createdAt || msg.timestamp,
    read: msg.read,
    deleted: msg.deleted,
    isEdited: msg.isEdited,
    sender: msg.sender,
  };
}

export async function createOrGetChat(data: {
  senderId: string;
  receiverId: string;
  itemId: string;
  itemModel: string;
}): Promise<Chatroom> {
  const res = await fetch(CHATS.CREATE, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  const json = await res.json();
  return mapChat(json.chat);
}

function readClientToken(): string {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export async function getUserChatrooms(userId: string, token?: string): Promise<Chatroom[]> {
  try {
    const authToken = token || readClientToken();
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (authToken) headers["Authorization"] = `Bearer ${authToken}`;
    const res = await fetch(CHATS.USER_CHATS(userId), {
      credentials: "include",
      headers,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapChat) : [];
  } catch {
    return [];
  }
}

export async function getChatroomMessages(
  chatId: number,
  userId: string,
): Promise<ChatMessage[]> {
  const res = await fetch(CHATS.CHAT_MESSAGES(chatId, userId), {
    credentials: "include",
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map(mapMessage) : [];
}

export async function sendChatMessage(data: {
  chatId: number;
  senderId: string;
  receiverId: string;
  content: string;
}): Promise<ChatMessage | null> {
  const res = await fetch(MESSAGES.SEND, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chatId: String(data.chatId),
      senderId: String(data.senderId),
      receiverId: String(data.receiverId),
      content: data.content,
    }),
  });
  if (!res.ok) return null;
  return mapMessage(await res.json());
}

export async function deleteChatroom(
  chatId: number,
  userId: string,
): Promise<boolean> {
  const res = await fetch(CHATS.DELETE(chatId, userId), {
    method: "DELETE",
    credentials: "include",
  });
  return res.ok;
}

export async function getUnreadMessageCount(userId: string): Promise<number> {
  const res = await fetch(MESSAGES.UNREAD_COUNT(userId), {
    credentials: "include",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count || 0;
}
