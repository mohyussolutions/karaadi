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

export async function postToTikTok(
  payload: SocialPostPayload,
): Promise<SocialPostResult> {
  const accessToken = process.env.TIKTOK_ACCESS_TOKEN;
  const openId = process.env.TIKTOK_OPEN_ID;

  if (!accessToken || !openId) {
    return { platform: "tiktok", success: false, error: "TikTok credentials not configured" };
  }

  const caption = `${payload.title}\n$${payload.price}\n${payload.description}\n\n${payload.listingUrl}`;

  try {
    const res = await fetch("https://open.tiktokapis.com/v2/post/publish/content/init/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({
        post_info: {
          title: caption.slice(0, 150),
          privacy_level: "PUBLIC_TO_EVERYONE",
          disable_duet: false,
          disable_comment: false,
          disable_stitch: false,
        },
        source_info: {
          source: "PULL_FROM_URL",
          video_url: payload.imageUrl ?? payload.listingUrl,
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

export async function postToFacebook(
  payload: SocialPostPayload,
): Promise<SocialPostResult> {
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!accessToken || !pageId) {
    return { platform: "facebook", success: false, error: "Facebook credentials not configured" };
  }

  const message = `${payload.title}\n$${payload.price}\n${payload.description}\n\n${payload.listingUrl}`;

  try {
    const body: Record<string, string> = {
      message,
      access_token: accessToken,
    };

    if (payload.imageUrl) {
      body.link = payload.listingUrl;
    }

    const res = await fetch(`https://graph.facebook.com/v19.0/${pageId}/feed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return { platform: "facebook", success: false, error: data?.error?.message ?? "Facebook API error" };
    }

    return { platform: "facebook", success: true, postId: data?.id };
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
