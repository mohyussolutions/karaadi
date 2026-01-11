"use client";

import { useEffect } from "react";

export default function TrackVisit({ userId }: { userId: string }) {
  useEffect(() => {
    fetch("http://localhost:8080/api/visitors/track", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }, [userId]);

  return null;
}
