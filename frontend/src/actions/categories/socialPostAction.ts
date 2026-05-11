"use server";

export interface SocialPostPayload {
  title: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  listingUrl: string;
  category?: string;
}

export interface SocialPostResult {
  platform: "tiktok" | "facebook";
  success: boolean;
  postId?: string;
  error?: string;
}

export async function postToTikTok(payload: SocialPostPayload): Promise<SocialPostResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;

  if (!accessToken) {
    return { platform: "tiktok", success: false, error: "TikTok access token not configured" };
  }

  if (!payload.imageUrl) {
    return { platform: "tiktok", success: false, error: "No image provided" };
  }

  const caption = [
    `🛒 ${payload.title}`,
    payload.price ? `💰 $${payload.price}` : "",
    payload.description ? payload.description.slice(0, 300) : "",
    `🔗 ${payload.listingUrl}`,
    "#Karaadi #Somalia #ForSale",
  ]
    .filter(Boolean)
    .join("\n")
    .slice(0, 2200);

  try {
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

    const data = await res.json();

    if (!res.ok) {
      return { platform: "tiktok", success: false, error: data?.error?.message ?? "TikTok API error" };
    }

    return { platform: "tiktok", success: true, postId: data?.data?.publish_id };
  } catch (err: any) {
    return { platform: "tiktok", success: false, error: err?.message ?? "Network error" };
  }
}

export async function postToFacebook(payload: SocialPostPayload): Promise<SocialPostResult> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return { platform: "facebook", success: false, error: "Facebook credentials not configured" };
  }

  const message = [
    `🛒 ${payload.title}`,
    payload.price ? `💰 $${payload.price}` : "",
    payload.description ? payload.description.slice(0, 400) : "",
    `\n👉 View listing: ${payload.listingUrl}`,
    "#Karaadi #Somalia #ForSale",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    let res: Response;

    if (payload.imageUrl) {
      res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/photos`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          url: payload.imageUrl,
          caption: message,
        }),
      });
    } else {
      res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({
          message,
          link: payload.listingUrl,
        }),
      });
    }

    const data = await res.json();

    if (!res.ok) {
      return { platform: "facebook", success: false, error: data?.error?.message ?? "Facebook API error" };
    }

    return { platform: "facebook", success: true, postId: data?.id ?? data?.post_id };
  } catch (err: any) {
    return { platform: "facebook", success: false, error: err?.message ?? "Network error" };
  }
}

export async function postToAllPlatforms(
  payload: SocialPostPayload,
  platforms: ("tiktok" | "facebook")[] = ["tiktok", "facebook"],
): Promise<SocialPostResult[]> {
  const tasks: Promise<SocialPostResult>[] = [];
  if (platforms.includes("tiktok")) tasks.push(postToTikTok(payload));
  if (platforms.includes("facebook")) tasks.push(postToFacebook(payload));
  return Promise.all(tasks);
}
