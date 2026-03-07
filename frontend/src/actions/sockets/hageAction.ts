"use server";

import { HAGE_API_URL } from "../constant/sockets";

export async function sendChatMessage(content: string) {
  try {
    const res = await fetch(HAGE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        category: "car",
        city: "",
        maxPrice: 1000000,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Cillad ayaa dhacday." };
    }

    return { reply: data.reply };
  } catch (err) {
    return {
      error: "Waan ka xumahay, jawaab lama helin. Fadlan isku day mar kale.",
    };
  }
}
