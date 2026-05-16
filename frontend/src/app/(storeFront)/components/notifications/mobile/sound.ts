"use client";

import { Howl } from "howler";

let soundEnabled = true;
let howl: Howl | null = null;

function getHowl(): Howl {
  if (!howl) {
    howl = new Howl({ src: ["/sounds/notification.wav"], volume: 0.6, preload: true });
  }
  return howl;
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playNotificationSound(): void {
  if (!soundEnabled) return;
  try { getHowl().play(); } catch {}
}
