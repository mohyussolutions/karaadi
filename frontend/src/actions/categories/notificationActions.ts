import { BASE_API_URL } from "../constant/BASE_API_URL";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";

export async function deleteNotification(notificationId: string) {
  const headers = await getAuthHeaders();
  const res = await fetch(
    `${BASE_API_URL}/api/notification/${notificationId}`,
    {
      method: "DELETE",
      headers,
    },
  );
  if (!res.ok) throw new Error(`Status: ${res.status}`);
  return res.json();
}
