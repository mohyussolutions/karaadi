"use client";

import { Howl } from "howler";

let soundEnabled = true;
let howl: Howl | null = null;

export function initSound(): void {
  if (howl) return;
  howl = new Howl({
    src: ["/sounds/notification.wav"],
    volume: 0.6,
    preload: true,
    html5: true,
  });
}

export function isSoundEnabled(): boolean {
  return soundEnabled;
}

export function setSoundEnabled(enabled: boolean): void {
  soundEnabled = enabled;
}

export function playNotificationSound(): void {
  if (!soundEnabled) return;
  if (!howl) initSound();
  try {
    howl?.play();
  } catch {}
}
