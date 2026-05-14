export type SocialPlatform = "facebook" | "tiktok";

export interface SocialPostPayload {
  title: string;
  description: string;
  price: string | number;
  imageUrl?: string;
  listingUrl: string;
  category?: string;
}

export interface SocialPostResult {
  platform: SocialPlatform;
  success: boolean;
  postId?: string;
  error?: string;
}
