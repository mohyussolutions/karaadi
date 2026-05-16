"use client";

import { Howl } from "howler";
import Cookies from "js-cookie";

const SOUND_KEY = "karaadi_notification_sound";

let howl: Howl | null = null;

function getHowl(): Howl {
  if (!howl) {
    howl = new Howl({ src: ["/sounds/notification.wav"], volume: 0.6, preload: true });
  }
  return howl;
}

export function isSoundEnabled(): boolean {
  const val = Cookies.get(SOUND_KEY);
  return val === undefined ? true : val === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  Cookies.set(SOUND_KEY, String(enabled), { expires: 365 });
}

export function playNotificationSound(): void {
  if (!isSoundEnabled()) return;
  try { getHowl().play(); } catch {}
}
