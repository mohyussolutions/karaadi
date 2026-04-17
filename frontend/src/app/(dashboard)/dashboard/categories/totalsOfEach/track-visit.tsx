"use client";

import { useEffect } from "react";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

export default function TrackVisit({ userId }: { userId: string }) {
  useEffect(() => {
    fetch(`${BASE_API_URL}/api/visitors/track`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
  }, [userId]);

  return null;
}
