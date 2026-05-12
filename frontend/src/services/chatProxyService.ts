import type { Chatroom } from "@/app/utils/types/chat.types";

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

export async function getUserChatrooms(userId: string, _token?: string): Promise<Chatroom[]> {
  try {
    const res = await fetch(`/api/chats/user/${userId}`, { cache: "no-store" });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(mapChat) : [];
  } catch {
    return [];
  }
}
