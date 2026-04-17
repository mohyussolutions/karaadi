"use client";

import React, { useEffect, useRef, useState } from "react";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

export default function DailySupportMessages() {
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const mounted = useRef(false);

  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_API_URL}/api/contactUs/stats`, {
          credentials: "include",
        });
        if (res.ok) setStats(await res.json());
      } catch {}
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Messages</h2>
      <p className="text-3xl font-bold text-green-600 mt-3">
        {stats.today.toLocaleString()}
      </p>
    </div>
  );
}
