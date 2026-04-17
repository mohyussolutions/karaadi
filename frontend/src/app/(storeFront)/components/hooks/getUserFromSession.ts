import { apiUrls } from "@/actions/constant/constant";

async function getUserFromSession(sessionId: string) {
  const res = await fetch(`${apiUrls.VERIFY_SESSION}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId }),
  });
  if (!res.ok) return null;
  return res.json();
}
