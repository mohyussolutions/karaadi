import { Router, Request, Response } from "express";

const socialRouter = Router();

socialRouter.post("/post", async (req: Request, res: Response) => {
  const { itemId, itemTitle, platforms } = req.body;

  if (!itemId) {
    return res.status(400).json({ error: "itemId is required" });
  }

  const selected = Object.entries(platforms || {})
    .filter(([, v]) => v)
    .map(([k]) => k);

  console.log(
    `[Social] Post queued — item: ${itemId} "${itemTitle}" → ${selected.join(", ") || "none"}`,
  );

  // ...existing code...

  return res.json({ queued: true, platforms: selected });
});

socialRouter.get("/tiktok/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    return res.status(400).send("No code received from TikTok.");
  }

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

    const data = await response.json();

    if (!response.ok || !data.access_token) {
      console.error("[TikTok OAuth] Error:", data);
      return res.status(400).send(`
        <h2>TikTok OAuth Failed</h2>
        <pre>${JSON.stringify(data, null, 2)}</pre>
      `);
    }

    return res.send(`
      <h2>TikTok Connected!</h2>
      <p>Copy this into your <code>.env</code>:</p>
      <pre style="background:#f4f4f4;padding:16px;border-radius:8px">TIKTOK_ACCESS_TOKEN=${data.access_token}</pre>
      <p style="color:gray;font-size:13px">Expires in ${Math.round(data.expires_in / 3600)} hours</p>
    `);
  } catch (err: any) {
    return res.status(500).json({ error: "Server error" });
  }
});

export default socialRouter;
