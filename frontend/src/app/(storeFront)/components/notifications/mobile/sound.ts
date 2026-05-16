"use client";

import { Howl } from "howler";

const SOUND_KEY = "karaadi_notification_sound";

let howl: Howl | null = null;

function getHowl(): Howl {
  if (!howl) {
    howl = new Howl({
      src: ["/sounds/notification.wav"],
      volume: 0.6,
      preload: true,
    });
  }
  return howl;
}

export function isSoundEnabled(): boolean {
  if (typeof localStorage === "undefined") return true;
  const val = localStorage.getItem(SOUND_KEY);
  return val === null ? true : val === "true";
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(SOUND_KEY, String(enabled));
  }
}

export function playNotificationSound(): void {
  if (!isSoundEnabled()) return;
  try {
    getHowl().play();
  } catch {}
}
