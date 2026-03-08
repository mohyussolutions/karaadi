"use client";

import { getTotalUsersAction } from "@/actions/categories/usersAction";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";

import React, { useEffect, useState } from "react";

export default function TotalUsers() {
  const [total, setTotal] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTotalUsers = async () => {
      try {
        const { data, error } = await getTotalUsersAction();

        if (error) {
          setError(error);
          return;
        }

        setTotal(data?.totalUsers ?? 0);
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
        {loading && <Loading />}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {!loading && !error && (
          <p className="text-3xl font-bold text-green-600">
            {total?.toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
