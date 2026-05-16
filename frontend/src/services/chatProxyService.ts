import type { ChatMessage, Chatroom } from "@/app/utils/types/chat.types"
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders"

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "https://karaadi.onrender.com"

async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = await getAuthHeaders()
  return fetch(`${BACKEND}${path}`, {
    credentials: "include",
    ...init,
    headers: { ...(headers as Record<string, string>), ...(init.headers as Record<string, string> | undefined) },
  })
}

function mapChat(chat: any): Chatroom {
  const item =
    chat.item ||
    chat.marketplace ||
    chat.car ||
    chat.boat ||
    chat.motorcycle ||
    chat.realEstate ||
    chat.farmequipment ||
    null
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
    unreadCount: chat.unreadCount || 0,
    updatedAt: chat.updatedAt,
    itemTitle: item?.title || null,
    itemImage: item?.images?.[0] || null,
    itemPrice: item?.price || null,
  }
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
  }
}

export async function getUserChatrooms(userId: string): Promise<Chatroom[]> {
  try {
    const res = await apiFetch(`/api/chats/user/${userId}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map(mapChat) : []
  } catch {
    return []
  }
}

export async function getChatroomMessages(chatId: number, userId: string): Promise<ChatMessage[]> {
  try {
    const res = await apiFetch(`/api/chats/${chatId}/messages?userId=${userId}`)
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data.map(mapMessage) : []
  } catch {
    return []
  }
}

export async function createOrGetChatProxy(data: {
  senderId: string
  receiverId: string
  itemId: string
  itemModel: string
}): Promise<Chatroom> {
  const res = await apiFetch("/api/chats/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Failed to create chat")
  return mapChat(await res.json())
}

export async function deleteChatroomProxy(chatId: number, userId: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/api/chats/${chatId}?userId=${userId}`, { method: "DELETE" })
    return res.ok
  } catch {
    return false
  }
}

export async function sendChatMessage(data: {
  chatId: number
  senderId: string
  receiverId: string
  content: string
}): Promise<ChatMessage | null> {
  try {
    const res = await apiFetch("/api/messages/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chatId: String(data.chatId),
        senderId: String(data.senderId),
        receiverId: String(data.receiverId),
        content: data.content,
      }),
    })
    if (!res.ok) return null
    return mapMessage(await res.json())
  } catch {
    return null
  }
}

export async function deleteChatMessageProxy(messageId: number, userId: string): Promise<boolean> {
  try {
    const res = await apiFetch(`/api/messages/${messageId}?userId=${userId}`, { method: "DELETE" })
    return res.ok
  } catch {
    return false
  }
}

export async function updateChatMessageProxy(messageId: number, content: string, userId: string): Promise<ChatMessage | null> {
  try {
    const res = await apiFetch(`/api/messages/${messageId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, userId }),
    })
    if (!res.ok) return null
    return mapMessage(await res.json())
  } catch {
    return null
  }
}
