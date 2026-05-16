"use server";

import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import type { SocialPostPayload, SocialPostResult } from "@/app/utils/types/social.types";

export type { SocialPostPayload, SocialPostResult };

async function callSocialAPI(
  payload: SocialPostPayload,
  platforms: { facebook?: boolean; tiktok?: boolean },
): Promise<Record<string, SocialPostResult>> {
  try {
    const res = await fetch(`${BASE_API_URL}/api/social/post`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: payload.title,
        description: payload.description,
        price: payload.price,
        imageUrl: payload.imageUrl,
        listingUrl: payload.listingUrl,
        platforms,
      }),
    });
    const data = await res.json();
    return data.results ?? {};
  } catch {
    return {};
  }
}

export async function postToFacebook(payload: SocialPostPayload): Promise<SocialPostResult> {
  const results = await callSocialAPI(payload, { facebook: true });
  const r = results.facebook;
  if (!r) return { platform: "facebook", success: false, error: "No response from server" };
  return { platform: "facebook", success: r.success, postId: r.postId, error: r.error };
}

export async function postToTikTok(payload: SocialPostPayload): Promise<SocialPostResult> {
  const results = await callSocialAPI(payload, { tiktok: true });
  const r = results.tiktok;
  if (!r) return { platform: "tiktok", success: false, error: "No response from server" };
  return { platform: "tiktok", success: r.success, postId: r.postId, error: r.error };
}

export async function postToAllPlatforms(
  payload: SocialPostPayload,
  platforms: Array<"tiktok" | "facebook"> = ["facebook", "tiktok"],
): Promise<SocialPostResult[]> {
  const results = await callSocialAPI(payload, {
    facebook: platforms.includes("facebook"),
    tiktok: platforms.includes("tiktok"),
  });
  return Object.entries(results).map(([platform, r]: [string, any]) => ({
    platform: platform as "facebook" | "tiktok",
    success: r.success,
    postId: r.postId,
    error: r.error,
  }));
}
