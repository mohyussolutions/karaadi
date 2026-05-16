"use client";

import { useEffect, useRef } from "react";
import { TRACK_VISITOR_ENDPOINT } from "@/actions/constant/constant";
import { getVisitorId, getLang } from "./visitorUtils";

export default function TrackVisitor() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = () => {
      try {
        fetch(TRACK_VISITOR_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ visitorId: getVisitorId(), lang: getLang() }),
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
