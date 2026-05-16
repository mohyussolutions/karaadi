import type { RawUserData } from "@/app/utils/types/user.types";

export let cachedSession: { data: RawUserData | null } | null = null;
export let pendingSession: Promise<RawUserData | null> | null = null;

export function setCachedSession(data: RawUserData | null) {
  cachedSession = { data };
}

export function setPendingSession(p: Promise<RawUserData | null> | null) {
  pendingSession = p;
}

export function clearAuthCache() {
  cachedSession = null;
  pendingSession = null;
}
