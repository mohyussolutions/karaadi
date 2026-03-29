"use server";

import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

const API_BASE = "http://localhost:8080/api";

export interface Visitor {
  id: string;
  userId: string | null;
  visitedAt: string;
}

export interface VisitorStats {
  total: number;
  today: number;
  unique: number;
}

export async function fetchVisitors(): Promise<Visitor[]> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/visitors/all`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch visitors: ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.visitors || [];
  } catch (error) {
    console.error("Error fetching visitors:", error);
    return [];
  }
}

export async function fetchVisitorStats(): Promise<VisitorStats> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/visitors/all`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch visitor stats: ${response.status}`);
      return { total: 0, today: 0, unique: 0 };
    }

    const data = await response.json();
    const visitors = Array.isArray(data) ? data : data.visitors || [];

    const today = new Date().toDateString();
    const todayVisitors = visitors.filter(
      (v: Visitor) => new Date(v.visitedAt).toDateString() === today,
    ).length;

    const uniqueVisitors = new Set(visitors.map((v: Visitor) => v.userId)).size;

    return {
      total: visitors.length,
      today: todayVisitors,
      unique: uniqueVisitors,
    };
  } catch (error) {
    console.error("Error fetching visitor stats:", error);
    return { total: 0, today: 0, unique: 0 };
  }
}

export async function fetchTotalVisitors(): Promise<number> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/visitors/all`, {
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Failed to fetch total visitors: ${response.status}`);
      return 0;
    }

    const data = await response.json();
    const visitors = Array.isArray(data) ? data : data.visitors || [];
    return visitors.length;
  } catch (error) {
    console.error("Error fetching total visitors:", error);
    return 0;
  }
}

export async function deleteVisitor(id: string): Promise<boolean> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE}/visitors/${id}`, {
      method: "DELETE",
      headers: headers as HeadersInit,
      cache: "no-store",
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error deleting visitor:", error);
    return false;
  }
}
