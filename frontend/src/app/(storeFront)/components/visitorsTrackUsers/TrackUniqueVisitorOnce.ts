"use client";

import { useEffect, useRef } from "react";

export default function TrackVisitor() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const track = () => {
      fetch("http://localhost:8080/api/visitors/track-user", {
        method: "POST",
        credentials: "include",
        keepalive: true,
      }).catch(() => {});
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(track);
    } else {
      setTimeout(track, 1);
    }
  }, []);

  return null;
}
