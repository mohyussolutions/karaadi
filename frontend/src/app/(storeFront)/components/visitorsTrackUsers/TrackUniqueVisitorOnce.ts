"use client";

import { useEffect, useRef } from "react";

export default function TrackVisitor() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    fetch("http://localhost:8080/api/visitors/track-user", {
      method: "POST",
      credentials: "include",
    }).catch(() => {});
  }, []);

  return null;
}
