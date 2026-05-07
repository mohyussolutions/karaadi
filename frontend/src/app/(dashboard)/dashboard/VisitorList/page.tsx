"use client";

import {
  fetchVisitors,
  deleteVisitor,
  Visitor,
} from "@/actions/categories/visitorActions";
import Loading from "@/app/ui/loading/Loading";
import { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { FaTrash } from "react-icons/fa";

export default function VisitorList() {
  const { t } = useTranslation();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVisitors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVisitors();
      setVisitors(data);
    } catch {
      setError(t("adminTable.error"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadVisitors();
  }, [loadVisitors]);

  const handleDelete = useCallback(async (id: string) => {
    const previousVisitors = [...visitors];
    setVisitors((prev) => prev.filter((v) => v.id !== id));
    try {
      const success = await deleteVisitor(id);
      if (!success) setVisitors(previousVisitors);
    } catch {
      setVisitors(previousVisitors);
    }
  }, [visitors]);

  if (loading) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">{t("adminTable.visitors")}</h2>
        <div className="flex justify-center py-8">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">{t("adminTable.visitors")}</h2>
        <div className="text-red-500 text-center py-4">{error}</div>
        <button
          onClick={loadVisitors}
          className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {t("adminTable.retry")}
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md border">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{t("adminTable.visitors")}</h2>
        <span className="text-sm text-gray-500">{t("adminTable.total")}: {visitors.length}</span>
      </div>

      {visitors.length === 0 ? (
        <div className="text-center py-8 text-gray-500">{t("adminTable.noVisitorsFound")}</div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {visitors.map((v, i) => (
            <div
              key={v.id ?? `${v.userId}-${i}`}
              className="flex items-center justify-between p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 transition"
            >
              <div>
                <div className="font-medium">{v.userId || "Anonymous"}</div>
                <div className="text-gray-500 text-sm">
                  {new Date(v.visitedAt).toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => handleDelete(v.id)}
                className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                aria-label={t("adminTable.delete")}
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
