import type { ChatMessage, Chatroom } from "@/app/utils/types/chat.types";
import { PROXY_CHATS } from "@/actions/constant/sockets";

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

export async function getUserChatrooms(userId: string): Promise<Chatroom[]> {
  try {
    const res = await fetch(PROXY_CHATS.USER_CHATS(userId), { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapChat) : [];
  } catch {
    return [];
  }
}

export async function getChatroomMessages(chatId: number, userId: string): Promise<ChatMessage[]> {
  try {
    const res = await fetch(PROXY_CHATS.CHAT_MESSAGES(chatId, userId), { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapMessage) : [];
  } catch {
    return [];
  }
}

export async function createOrGetChatProxy(data: {
  senderId: string;
  receiverId: string;
  itemId: string;
  itemModel: string;
}): Promise<Chatroom> {
  const res = await fetch(PROXY_CHATS.CREATE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create chat");
  const json = await res.json();
  return mapChat(json);
}

export async function deleteChatroomProxy(chatId: number, userId: string): Promise<boolean> {
  try {
    const res = await fetch(PROXY_CHATS.DELETE(chatId, userId), { method: "DELETE" });
    return res.ok;
  } catch {
    return false;
  }
}
