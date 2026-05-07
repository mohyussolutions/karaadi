import { BASE_API_URL } from "../constant/BASE_API_URL";

export const ITEMS_API = `${BASE_API_URL}/api/items`;

export async function getItemById(id: string): Promise<any | null> {
  try {
    const res = await fetch(`${ITEMS_API}/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
