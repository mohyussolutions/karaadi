"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getMySubscriptions,
  deleteSubscriptionAdmin,
} from "@/actions/categories/subscriptionsActions";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface Subscription {
  id?: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  priceMin?: number;
  priceMax?: number;
  isPaid: boolean;
  status: string;
  createdAt: string;
  expiryDate?: string;
}

function Mysubscription() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchSubscriptions = useCallback(async () => {
    try {
      const result = await getMySubscriptions();
      setSubscriptions((result as Subscription[]) || []);
      setError(null);
    } catch (err) {
      setError(
        t("mine.subscriptions.errorLoading", "Error loading subscriptions"),
      );
    }
  }, [t]);

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else {
        fetchSubscriptions();
      }
    }
  }, [user, authLoading, router, fetchSubscriptions]);

  const handlePayment = (subscriptionId: string) => {
    setProcessingId(subscriptionId);
    router.push(`/payment/subscription?id=${subscriptionId}`);
  };

  const handleDelete = async (subscriptionId: string) => {
    if (
      !confirm(
        t(
          "mine.subscriptions.deleteConfirm",
          "Are you sure you want to delete this subscription?",
        ),
      )
    ) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      await deleteSubscriptionAdmin(subscriptionId);
      await fetchSubscriptions();
    } catch (error) {
      alert(
        t("mine.subscriptions.deleteFailed", "Failed to delete subscription"),
      );
    } finally {
      setProcessingId(null);
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  if (authLoading) return null;

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
          {t(
            "mine.subscriptions.empty",
            "You haven't created any subscriptions yet.",
          )}
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub, index) => {
            const expired = isExpired(sub.expiryDate);
            const needsPayment = !sub.isPaid || expired;
            const subId = sub.id || `temp-${index}`;

            return (
              <div
                key={subId}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{sub.title}</h3>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${sub.isPaid && !expired ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                    >
                      {sub.isPaid && !expired
                        ? t("mine.subscriptions.status.active", "ACTIVE")
                        : t("mine.subscriptions.status.inactive", "INACTIVE")}
                    </span>

                    <span
                      className={`text-[10px] uppercase font-bold ${sub.isPaid ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {sub.isPaid
                        ? t("mine.subscriptions.paid", "✓ Paid")
                        : t("mine.subscriptions.unpaid", "⚠ Unpaid")}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>
                    {t("mine.subscriptions.category", "Category")} :{" "}
                    {sub.category}
                  </p>
                  <p>
                    {t("mine.subscriptions.region", "Region")} : {sub.region}
                  </p>
                  <p>
                    {t("mine.subscriptions.cities", "Cities")} :{" "}
                    {sub.cities?.join(", ")}
                  </p>
                  <p>
                    {t("mine.subscriptions.priceRange", "Price Range")} : $
                    {sub.priceMin || 0} - ${sub.priceMax || "∞"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        {t("mine.subscriptions.created", "Created:")}{" "}
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                      {sub.expiryDate && (
                        <p
                          className={`text-xs ${expired ? "text-red-500 font-bold" : "text-gray-400"}`}
                        >
                          {expired
                            ? `${t("mine.subscriptions.expired", "Expired:")}`
                            : `${t("mine.subscriptions.expires", "Expires:")}`}{" "}
                          {new Date(sub.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {needsPayment && sub.id && (
                      <button
                        onClick={() => handlePayment(sub.id!)}
                        disabled={processingId === sub.id}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition font-medium disabled:opacity-50"
                      >
                        {processingId === sub.id
                          ? t("mine.subscriptions.processing", "Processing...")
                          : t("mine.subscriptions.payNow", "Pay Now")}
                      </button>
                    )}

                    {sub.id && (
                      <button
                        onClick={() => handleDelete(sub.id!)}
                        disabled={processingId === sub.id}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition font-medium disabled:opacity-50"
                      >
                        {t("mine.subscriptions.delete", "Delete")}
                      </button>
                    )}
                  </div>
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
