export const iOS = {
  detect(): boolean {
    if (typeof window === "undefined") return false;
    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
    );
  },
  isPWA(): boolean {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as { standalone?: boolean }).standalone === true
    );
  },
  needsInstallPrompt(): boolean {
    return iOS.detect() && !iOS.isPWA();
  },
  supportsWebPush(): boolean {
    return iOS.detect() && iOS.isPWA();
  },
} as const;

export const android = {
  detect(): boolean {
    if (typeof window === "undefined") return false;
    return /Android/i.test(navigator.userAgent);
  },
  supportsWebPush(): boolean {
    return (
      android.detect() &&
      "Notification" in window &&
      "serviceWorker" in navigator &&
      "PushManager" in window
    );
  },
} as const;

export function browserSupportsPush(): boolean {
  if (typeof window === "undefined") return false;
  if (iOS.detect()) return iOS.supportsWebPush();
  return (
    "Notification" in window &&
    "serviceWorker" in navigator &&
    "PushManager" in window
  );
}

export function needsIOSInstallPrompt(): boolean {
  return iOS.needsInstallPrompt();
}
