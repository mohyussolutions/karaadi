"use server";

import { CONTACT_ENDPOINTS } from "../constant/constant";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

interface TicketData {
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
}

interface MessageData {
  body: string;
  senderName: string;
  senderEmail: string;
  senderRole: "USER" | "SUPPORT_MANAGER" | "ADMIN";
}

export async function createTicket(data: TicketData) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKETS, {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return { success: res.ok, status: res.status };
  } catch {
    return { success: false, error: "Network error" };
  }
}

export async function getTicketHistory(email: string) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKETS, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    const list = Array.isArray(data) ? data : [];
    return list
      .filter((t: any) => t?.senderEmail === email)
      .sort((a: any, b: any) => Number(b.id ?? 0) - Number(a.id ?? 0));
  } catch {
    return [];
  }
}

export async function getTicketDetails(id: string | number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKET_BY_ID(id), {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

export async function addTicketMessage(
  ticketId: string | number,
  messageData: MessageData,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.MESSAGES(ticketId), {
      method: "POST",
      headers: headers as HeadersInit,
      body: JSON.stringify(messageData),
      cache: "no-store",
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function updateTicketStatus(
  ticketId: string | number,
  status: string,
) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKET_BY_ID(ticketId), {
      method: "PATCH",
      headers: headers as HeadersInit,
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function deleteTicket(ticketId: string | number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKET_BY_ID(ticketId), {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function deleteMessage(messageId: string | number) {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(
      `${CONTACT_ENDPOINTS.TICKETS}/messages/${messageId}`,
      {
        method: "DELETE",
        headers: headers as HeadersInit,
        cache: "no-store",
      },
    );
    return { success: res.ok };
  } catch {
    return { success: false };
  }
}

export async function getAllTickets() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.TICKETS, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

export async function getTicketStats() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(CONTACT_ENDPOINTS.STATS, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });
    return res.ok ? await res.json() : { total: 0, today: 0 };
  } catch {
    return { total: 0, today: 0 };
  }
}
