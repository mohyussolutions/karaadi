import { BASE_API_URL } from "../constant/BASE_API_URL";
export const HAGE_API_URL = `${BASE_API_URL}/api/hage/chat`;

interface ChatResponse {
  reply?: string;
  error?: string;
}

export async function sendChatMessage(
  content: string,
  category: string = "car",
  city: string = "",
  maxPrice: number = 1000000,
): Promise<ChatResponse> {
  try {
    const res = await fetch(HAGE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message: content,
        category,
        city,
        maxPrice,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return { error: data.error || "Cillad ayaa dhacday." };
    }

    return { reply: data.reply };
  } catch (err) {
    console.error(err);
    return {
      error: "Waan ka xumahay, jawaab lama helin. Fadlan isku day mar kale.",
    };
  }
}
