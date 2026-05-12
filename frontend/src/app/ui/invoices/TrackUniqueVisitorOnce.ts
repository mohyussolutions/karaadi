"use client";

import { useEffect, useRef } from "react";

const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

function getVisitorId(): string {
  const key = "karaadi_vid";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export default function TrackVisitor() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = () => {
      try {
        const visitorId = getVisitorId();
        const lang = document.cookie.match(/app_lang=([^;]+)/)?.[1] ?? "en";
        fetch(`${BASE_API_URL}/api/visitors/track-user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId, lang }),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    };

    if ("requestIdleCallback" in window) {
      (window as any).requestIdleCallback(track);
    } else {
      setTimeout(track, 2000);
    }
  }, []);

  return null;
}
