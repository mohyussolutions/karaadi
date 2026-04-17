"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { CHATS, MESSAGES } from "@/actions/constant/sockets";

export interface User {
  id: string;
  username: string;
  email: string;
  profileImage?: string;
}

export interface Message {
  id: number;
  chatId: number;
  senderId: string;
  content: string;
  createdAt: string;
  timestamp: string;
  sender?: User;
}

export interface Chat {
  id: number;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  messages: Message[];
  lastMessageAt?: string;
  updatedAt?: string;
}

export async function getAuthHeaders(token?: string) {
  const cookieStore = await cookies();
  const authToken =
    token ||
    cookieStore.get("idToken")?.value ||
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("token")?.value;

  return {
    "Content-Type": "application/json",
    ...(authToken && { Authorization: `Bearer ${authToken}` }),
  };
}

export async function getAllChats(): Promise<Chat[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(CHATS.ADMIN_ALL, { headers, cache: "no-store" });
  return res.ok ? res.json() : [];
}

export async function getChatMessages(
  chatId: number,
  userId: string,
): Promise<Message[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(CHATS.CHAT_MESSAGES(chatId, userId), {
    headers,
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export async function deleteChat(chatId: number, userId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(CHATS.DELETE(chatId, userId), {
    method: "DELETE",
    headers,
  });
  if (res.ok) revalidatePath("/admin/monitor");
  return { success: res.ok };
}

export async function deleteMessage(messageId: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(MESSAGES.DELETE_MESSAGE(messageId), {
    method: "DELETE",
    headers,
  });
  if (res.ok) revalidatePath("/admin/monitor");
  return { success: res.ok };
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const headers = await getAuthHeaders();
  const res = await fetch(CHATS.USER_CHATS(userId), {
    headers,
    cache: "no-store",
  });
  return res.ok ? res.json() : [];
}

export async function getChatById(
  chatId: number,
  userId: string,
): Promise<Chat | null> {
  const headers = await getAuthHeaders();
  const res = await fetch(CHATS.CHAT_BY_ID(chatId, userId), {
    headers,
    cache: "no-store",
  });
  return res.ok ? res.json() : null;
}

export async function getUnreadCount(userId: string): Promise<number> {
  const headers = await getAuthHeaders();
  const res = await fetch(MESSAGES.UNREAD_COUNT(userId), {
    headers,
    cache: "no-store",
  });
  if (!res.ok) return 0;
  const data = await res.json();
  return data.count || 0;
}

export async function markMessagesAsRead(chatId: number) {
  const headers = await getAuthHeaders();
  const res = await fetch(MESSAGES.MARK_READ_ALL(chatId), {
    method: "POST",
    headers,
  });
  if (res.ok) revalidatePath("/chats");
  return { success: res.ok };
}
