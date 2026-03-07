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

async function getAuthHeaders() {
  const cookieStore = await cookies();
  const token =
    cookieStore.get("idToken")?.value || cookieStore.get("accessToken")?.value;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  return headers;
}

export async function getAllChats(): Promise<Chat[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(CHATS.ADMIN_ALL, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch chats: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching chats:", error);
    return [];
  }
}

export async function getChatMessages(
  chatId: number,
  userId: string,
): Promise<Message[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(CHATS.CHAT_MESSAGES(chatId, userId), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch messages: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching messages:", error);
    return [];
  }
}

export async function deleteChat(
  chatId: number,
  userId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(CHATS.DELETE(chatId, userId), {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || "Failed to delete chat" };
    }

    revalidatePath("/admin/monitor");
    return { success: true };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, error: "Network error" };
  }
}

export async function deleteMessage(
  messageId: number,
): Promise<{ success: boolean; error?: string }> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(MESSAGES.DELETE_MESSAGE(messageId), {
      method: "DELETE",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();
      return { success: false, error: error || "Failed to delete message" };
    }

    revalidatePath("/admin/monitor");
    return { success: true };
  } catch (error) {
    console.error("Error deleting message:", error);
    return { success: false, error: "Network error" };
  }
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(CHATS.USER_CHATS(userId), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch user chats: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching user chats:", error);
    return [];
  }
}

export async function getChatById(
  chatId: number,
  userId: string,
): Promise<Chat | null> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(CHATS.CHAT_BY_ID(chatId, userId), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return null;

    return await response.json();
  } catch (error) {
    console.error("Error fetching chat by id:", error);
    return null;
  }
}

export async function getUnreadCount(userId: string): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(MESSAGES.UNREAD_COUNT(userId), {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return 0;

    const data = await response.json();
    return data.count || 0;
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return 0;
  }
}

export async function markMessagesAsRead(
  chatId: number,
): Promise<{ success: boolean }> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(MESSAGES.MARK_READ_ALL(chatId), {
      method: "POST",
      headers,
      cache: "no-store",
    });

    if (!response.ok) return { success: false };

    revalidatePath("/chats");
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as read:", error);
    return { success: false };
  }
}
