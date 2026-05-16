export interface ShareData {
  isFree: boolean;
  total: number;
  shareUrl: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export type PlatformState = "idle" | "loading" | "done" | "error";
