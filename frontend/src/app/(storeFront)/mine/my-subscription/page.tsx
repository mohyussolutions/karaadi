"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { deleteSubscriptionAdmin } from "@/actions/categories/subscriptionsActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Subscription {
  id?: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  priceMin?: number;
  priceMax?: number;
  status: string;
  createdAt: string;
  expiryDate?: string;
}

function SkeletonCard() {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-white animate-pulse">
      <div className="flex justify-between items-start mb-3">
        <div className="h-5 bg-gray-200 rounded w-2/5" />
        <div className="h-5 bg-gray-200 rounded w-16" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-1/2" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
      </div>
      <div className="flex gap-2 pt-4 border-t">
        <div className="h-9 bg-gray-200 rounded w-20" />
      </div>
    </div>
  );
}

function Mysubscription() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  const fetchSubscriptions = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/subscription/my`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
      setError(null);
    } catch {
      setError(t("mine.subscriptions.errorLoading", "Error loading subscriptions"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const handleDelete = async (subscriptionId: string) => {
    if (!confirm(t("mine.subscriptions.deleteConfirm", "Are you sure you want to delete this subscription?"))) return;
    setDeletingId(subscriptionId);
    try {
      await deleteSubscriptionAdmin(subscriptionId);
      setSubscriptions((prev) => prev.filter((s) => s.id !== subscriptionId));
    } catch {
      alert(t("mine.subscriptions.deleteFailed", "Failed to delete subscription"));
    } finally {
      setDeletingId(null);
    }
  };

  if (!mounted || loading) {
    return (
      <div className="container mx-auto p-4">
        <div className="h-8 bg-gray-200 rounded w-48 mb-6 animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">
        {t("mine.subscriptions.title", "My Subscriptions")}
      </h1>

      {error && (
        <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      {subscriptions.length === 0 && !error ? (
        <p className="text-gray-500 text-center py-8">
          {t("mine.subscriptions.empty", "You haven't created any subscriptions yet.")}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub, index) => {
            const subId = sub.id || `temp-${index}`;
            return (
              <div
                key={subId}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{sub.title}</h3>
                  <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">
                    {t("mine.subscriptions.status.active", "ACTIVE")}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>{t("mine.subscriptions.category", "Category")} : {sub.category}</p>
                  <p>{t("mine.subscriptions.region", "Region")} : {sub.region}</p>
                  <p>{t("mine.subscriptions.cities", "Cities")} : {sub.cities?.join(", ")}</p>
                  <p>{t("mine.subscriptions.priceRange", "Price Range")} : ${sub.priceMin || 0} - ${sub.priceMax || "∞"}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <p className="text-xs text-gray-400">
                    {t("mine.subscriptions.created", "Created:")}{" "}
                    {new Date(sub.createdAt).toLocaleDateString()}
                  </p>
                  {sub.id && (
                    <button
                      onClick={() => handleDelete(sub.id!)}
                      disabled={deletingId === sub.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition font-medium disabled:opacity-50"
                    >
                      {deletingId === sub.id
                        ? "..."
                        : t("mine.subscriptions.delete", "Delete")}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Mysubscription;
