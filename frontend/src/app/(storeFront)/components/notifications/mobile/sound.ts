"use client";

import { Howl } from "howler";

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

function isSoundEnabled(): boolean {
  try {
    const { store } = require("@/store/store");
    return store.getState().notificationSettings.soundEnabled;
  } catch {
    return true;
  }
}

export function playNotificationSound(): void {
  if (!isSoundEnabled()) return;
  if (!howl) initSound();
  try {
    howl?.play();
  } catch {}
}
