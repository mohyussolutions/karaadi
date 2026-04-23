"use client";
import React, { useState, useEffect, useCallback, JSX } from "react";
import { useTranslation } from "react-i18next";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { useAuth } from "@/context/AuthContext";

interface Visitor {
  userId: string;
  ipAddress?: string;
  visitedAt: string;
}

const API_BASE_URL: string = `${BASE_API_URL}/api/visitors`;

interface VisitorManagerProps {
  onBack: () => void;
}

function VisitorManager({ onBack }: VisitorManagerProps): JSX.Element {
  const { t } = useTranslation();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchVisitors = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/all`, {
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      if (response.status === 401) {
        setError("Unauthorized. Please log in again.");
        return;
      }
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data: { total: number; visitors: Visitor[] } = await response.json();
      setVisitors(data.visitors);
    } catch (err) {
      setError("Failed to fetch visitors.");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  const handleDelete = async (userId: string): Promise<void> => {
    if (!user || !user.accessToken) {
      setError("You must be logged in to delete visitors.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete visitor ID: ${userId}?`)) return;
    try {
      const response = await fetch(`${API_BASE_URL}/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.accessToken}`,
        },
        credentials: "include",
      });
      if (!response.ok)
        throw new Error(`Deletion failed with status: ${response.status}`);
      fetchVisitors();
    } catch (err: any) {
      setError(`Failed to delete visitor: ${err.message}`);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 text-gray-500">
        {t("adminTable.loading")}
      </div>
    );

  if (error)
    return (
      <div className="text-red-600 bg-red-50 border border-red-200 rounded-xl p-4">
        {error}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-lg font-bold text-gray-800">
          {t("adminTable.visitorManager")} ({visitors.length} {t("adminTable.total")})
        </h2>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition"
          >
            ← {t("adminTable.backToSettings")}
          </button>
          <button
            onClick={fetchVisitors}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
          >
            {t("adminTable.refreshList")}
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("adminTable.visitorId")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("adminTable.ip")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("adminTable.lastVisited")}
              </th>
              <th className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("adminTable.actions")}
              </th>
            </tr>
          </thead>
          <tbody>
            {visitors.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-400">
                  {t("adminTable.noVisitorsFound")}
                </td>
              </tr>
            ) : (
              visitors.map((visitor: Visitor) => (
                <tr key={visitor.userId} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-gray-700 font-mono text-xs">{visitor.userId}</td>
                  <td className="px-4 py-3 text-gray-500">{visitor.ipAddress || "N/A"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(visitor.visitedAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDelete(visitor.userId)}
                      className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition"
                    >
                      {t("adminTable.delete")}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default VisitorManager;
