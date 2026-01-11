"use client";

import ManagerLoading from "@/app/(managers)/managers/ManagerLoading";
import React, { useEffect, useState } from "react";
export default function TotalUsers() {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/users/total-users", {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          setError("Unauthorized or server error");
          return;
        }

        const data = await res.json();
        setTotal(data.totalUsers);
      } catch (err) {
        setError("Failed to fetch total users");
      } finally {
        setLoading(false);
      }
    };

    fetchTotalUsers();
  }, []);

  return (
    <div className="p-6 bg-white rounded-xl shadow-md border w-full max-w-sm min-h-[140px] flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-700">Total Users</h2>

      <div className="h-[48px] flex items-center justify-center mt-3">
        {loading && <ManagerLoading />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && (
          <p className="text-3xl font-bold text-green-600">{total}</p>
        )}
      </div>
    </div>
  );
}
