"use client";

import { Howl } from "howler";
import { soundStorage } from "@/store/slices/reducers/notificationSettingsSlice";

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

export function playNotificationSound(): void {
  if (!soundStorage.get()) return;
  if (!howl) initSound();
  try {
    howl?.play();
  } catch {}
}
