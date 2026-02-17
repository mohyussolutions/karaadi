"use client";

import { verifySession } from "@/actions/core/authAction";

export const saveSearchToDb = async (query: string) => {
  if (!query.trim()) return;

  try {
    const session = await verifySession();
    const userId = session?._id || null;

    await fetch("http://localhost:8080/api/history-search/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query.trim(),
        category: "all",
        userId: userId,
      }),
    });
  } catch (error) {
    console.error("Failed to save search history:", error);
  }
};
saveSearchToDb;
