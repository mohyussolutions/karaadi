import { Router, Request, Response } from "express";

const socialRouter = Router();

let cachedPageId: string | null = null;

async function resolveFacebookPageId(accessToken: string): Promise<string | null> {
  if (cachedPageId) return cachedPageId;
  try {
    const res = await fetch(
      `https://graph.facebook.com/v19.0/me?fields=id&access_token=${accessToken}`,
    );
    const data: any = await res.json();
    if (data?.id) {
      cachedPageId = data.id;
      return data.id;
    }
    return null;
  } catch {
    return null;
  }
}

async function postToFacebook(payload: {
  title: string;
  description?: string;
  price?: number | string;
  imageUrl?: string;
  listingUrl: string;
}) {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  if (!accessToken) return { success: false, error: "FACEBOOK_PAGE_ACCESS_TOKEN not set" };

  const pageId = process.env.FACEBOOK_PAGE_ID || (await resolveFacebookPageId(accessToken));
  if (!pageId) return { success: false, error: "Could not resolve Facebook Page ID" };

  const message = [
    `🛒 ${payload.title}`,
    payload.price ? `💰 $${payload.price}` : "",
    payload.description ? payload.description.slice(0, 400) : "",
    `\n👉 View listing: ${payload.listingUrl}`,
    "#Karaadi #Somalia #ForSale",
  ].filter(Boolean).join("\n");

  const endpoint = payload.imageUrl
    ? `https://graph.facebook.com/v19.0/${pageId}/photos`
    : `https://graph.facebook.com/v19.0/${pageId}/feed`;

  const body = payload.imageUrl
    ? { url: payload.imageUrl, caption: message, access_token: accessToken }
    : { message, link: payload.listingUrl, access_token: accessToken };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: any = await res.json();
  if (!res.ok)
    return { success: false, error: data?.error?.message ?? "Facebook API error" };
  return { success: true, postId: data?.id ?? data?.post_id };
}

async function postToTikTok(payload: {
  title: string;
  description?: string;
  price?: number | string;
  imageUrl?: string;
  listingUrl: string;
}) {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  if (!accessToken || !accessToken.trim())
    return { success: false, error: "TIKTOK_ACCESS_TOKEN not set" };
  if (!payload.imageUrl)
    return { success: false, error: "No image provided for TikTok" };

  const caption = [
    `🛒 ${payload.title}`,
    payload.price ? `💰 $${payload.price}` : "",
    payload.description ? payload.description.slice(0, 300) : "",
    `🔗 ${payload.listingUrl}`,
    "#Karaadi #Somalia #ForSale",
  ].filter(Boolean).join("\n").slice(0, 2200);

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify({
      post_mode: "DIRECT_POST",
      media_type: "PHOTO",
      post_info: {
        title: caption,
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_comment: false,
      },
      source_info: {
        source: "PULL_FROM_URL",
        photo_images: [payload.imageUrl],
        photo_cover_index: 0,
      },
    }),
  });
  const data: any = await res.json();
  if (!res.ok)
    return { success: false, error: data?.error?.message ?? "TikTok API error" };
  return { success: true, postId: data?.data?.publish_id };
}

socialRouter.post("/post", async (req: Request, res: Response) => {
  const { title, description, price, imageUrl, listingUrl, platforms } = req.body;
  if (!listingUrl) return res.status(400).json({ error: "listingUrl is required" });

  const payload = { title, description, price, imageUrl, listingUrl };
  const results: Record<string, any> = {};

  if (platforms?.facebook !== false) {
    results.facebook = await postToFacebook(payload).catch((e: any) => ({
      success: false,
      error: String(e?.message ?? e),
    }));
  }

  if (platforms?.tiktok === true) {
    results.tiktok = await postToTikTok(payload).catch((e: any) => ({
      success: false,
      error: String(e?.message ?? e),
    }));
  }

  return res.json({ results });
});

socialRouter.get("/tiktok/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("No code received from TikTok.");

  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET;
  const redirectUri = `${process.env.BACKEND_URL || "http://localhost:8080"}/api/social/tiktok/callback`;

  try {
    const response = await fetch("https://open.tiktokapis.com/v2/oauth/token/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_key: clientKey!,
        client_secret: clientSecret!,
        code,
        grant_type: "authorization_code",
        redirect_uri: redirectUri,
      }),
    });
    const data: any = await response.json();
    if (!response.ok || !data.access_token) {
      return res.status(400).send(
        `<h2>TikTok OAuth Failed</h2><pre>${JSON.stringify(data, null, 2)}</pre>`,
      );
    }
    return res.send(`
      <h2>TikTok Connected!</h2>
      <p>Add this to your backend <code>.env</code>:</p>
      <pre style="background:#f4f4f4;padding:16px;border-radius:8px">TIKTOK_ACCESS_TOKEN=${data.access_token}</pre>
      <p style="color:gray;font-size:13px">Expires in ${Math.round(data.expires_in / 3600)} hours</p>
    `);
  } catch {
    return res.status(500).json({ error: "Server error" });
  }
});

export default socialRouter;
