"use client";

import { useEffect, useRef } from "react";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import Cookies from "js-cookie";

export default function TrackVisitor() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = () => {
      try {
        const failedUntil = (window as any).__trackFailedUntil || 0;
        if (Date.now() < failedUntil) return;

        const lang = Cookies.get("app_lang") || "en";
        const url = `${BASE_API_URL}/api/visitors/track-user`;
        const data = JSON.stringify({ lang });

        if (navigator.sendBeacon) {
          const blob = new Blob([data], { type: "application/json" });
          navigator.sendBeacon(url, blob);
        } else {
          fetch(url, {
            method: "POST",
            body: data,
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            keepalive: true,
          }).catch(() => {
            (window as any).__trackFailedUntil = Date.now() + 60000;
          });
        }
      } catch {}
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(track);
      } else {
        setTimeout(track, 2000);
      }
    }
  }, []);

  return null;
}
