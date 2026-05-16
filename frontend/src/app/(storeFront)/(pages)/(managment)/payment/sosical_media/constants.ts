export const SOCIAL_STORAGE_KEY = "karaadi-payment-success";

export const COUNTDOWN_SECONDS = 30;

export const FB_MESSAGES = {
  loading: "Posting to Karaadi Facebook page…",
  done: "Posted to Karaadi Facebook page!",
  error: "Could not post — check credentials",
} as const;

export const TT_MESSAGES = {
  loading: "Posting to Karaadi TikTok page…",
  done: "Posted to Karaadi TikTok page!",
  error: "Could not post — check credentials",
  idle: "Tap to post on Karaadi's TikTok page",
} as const;
