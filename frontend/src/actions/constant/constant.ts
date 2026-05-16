import { GridConfiguration } from "@/app/utils/types/GridConfiguration";

export * from "./urls";

export const AUTH_TOKEN_KEY = "auth_token";
export const PLACEHOLDER_IMAGE =
  "https://placehold.co/80x80/9ca3af/ffffff?text=No+Image";
export const PLACEHOLDER = "/placeholder.png";

export function normalizeImg(
  src: string | null | undefined,
  fallback = PLACEHOLDER_IMAGE,
): string {
  if (!src) return fallback;
  if (src.startsWith("http") || src.startsWith("data:") || src.startsWith("/"))
    return src;
  if (src.length > 100) return `data:image/jpeg;base64,${src}`;
  return fallback;
}

export const INITIAL_DISPLAY = 50;
export const DISPLAY_INCREMENT = 20;

export const PRIORITY_CONFIG = {
  PREMIUM: { label: "PREMIUM", color: "bg-amber-500" },
  STANDARD: { label: "STANDARD", color: "bg-blue-500" },
  BASIC: { label: "BASIC", color: "bg-gray-500" },
} as const;

export const getPriorityBadge = (
  isPremium90?: boolean,
  isStandard60?: boolean,
  isBasic30?: boolean,
) => {
  if (isPremium90) return PRIORITY_CONFIG.PREMIUM;
  if (isStandard60) return PRIORITY_CONFIG.STANDARD;
  if (isBasic30) return PRIORITY_CONFIG.BASIC;
  return null;
};

export const INITIAL_COUNT = 52;
export const INCREMENT = 20;
export const MAX_COUNT = 120;

export const GRID_CONFIG: GridConfiguration = {
  PAGE_SIZE: 20,
  INITIAL_PAGE: 1,
  INITIAL_LOAD: 60,
  ITEMS_PER_LOAD: 10,
  MAX_ITEMS: 120,
  MAX_LOADS: 3,
};

export const OPTION = {
  Public: "Public",
  Private: "Private",
} as const;
