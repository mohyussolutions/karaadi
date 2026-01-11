"use client";

import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";

export default function DailySupportMessages() {
  const [stats, setStats] = useState({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${BASE_URL}/apicontactUs/stats`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch {
        setStats({ total: 0, today: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 60000);
    return () => clearInterval(interval);
  }, [BASE_URL]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Messages</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading ? (
          <ManagerLoading />
        ) : (
          <p className="text-3xl font-bold text-green-600">
            {stats.today.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
