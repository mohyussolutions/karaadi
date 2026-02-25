"use client";

import React, { useEffect, useState } from "react";
import {
  getMySubscriptions,
  deleteSubscriptionAdmin,
} from "@/actions/categories/subscriptionsActions";
import { useRouter } from "next/navigation";
import { verifySession } from "@/actions/core/authAction";

interface Subscription {
  id: string;
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
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const router = useRouter();

  const fetchSubscriptions = async () => {
    try {
      const user = await verifySession();
      if (!user) {
        router.push("/login");
        return;
      }
      const result = await getMySubscriptions();
      setSubscriptions(result || []);
      setError(null);
    } catch (err) {
      if (err instanceof Error && err.message.includes("401")) {
        router.push("/login");
      } else {
        setError("Error loading subscriptions");
      }
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handlePayment = (subscriptionId: string) => {
    setProcessingId(subscriptionId);
    router.push(`/payment/subscription?id=${subscriptionId}`);
  };

  const handleDelete = async (subscriptionId: string) => {
    if (!confirm("Are you sure you want to delete this subscription?")) {
      return;
    }

    setProcessingId(subscriptionId);
    try {
      await deleteSubscriptionAdmin(subscriptionId);
      await fetchSubscriptions();
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete subscription");
    } finally {
      setProcessingId(null);
    }
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">My Subscriptions</h1>

      {error && (
        <div className="text-center p-4 text-red-500 bg-red-50 rounded-lg mb-4">
          {error}
        </div>
      )}

      {subscriptions.length === 0 && !error ? (
        <p className="text-gray-500 text-center py-8">
          You haven't created any subscriptions yet.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subscriptions.map((sub) => {
            const expired = isExpired(sub.expiryDate);
            const needsPayment = !sub.isPaid || expired;

            return (
              <div
                key={sub.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{sub.title}</h3>
                  <div className="flex flex-col items-end gap-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        sub.isPaid && !expired
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {sub.isPaid && !expired ? "ACTIVE" : "INACTIVE"}
                    </span>

                    <span
                      className={`text-[10px] uppercase font-bold ${sub.isPaid ? "text-blue-600" : "text-orange-600"}`}
                    >
                      {sub.isPaid ? "✓ Paid" : "⚠ Unpaid"}
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>Category: {sub.category}</p>
                  <p>Region: {sub.region}</p>
                  <p>Cities: {sub.cities?.join(", ")}</p>
                  <p>
                    Price Range: ${sub.priceMin || 0} - ${sub.priceMax || "∞"}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">
                        Created: {new Date(sub.createdAt).toLocaleDateString()}
                      </p>
                      {sub.expiryDate && (
                        <p
                          className={`text-xs ${expired ? "text-red-500 font-bold" : "text-gray-400"}`}
                        >
                          {expired ? "Expired: " : "Expires: "}{" "}
                          {new Date(sub.expiryDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {needsPayment && (
                      <button
                        onClick={() => handlePayment(sub.id)}
                        disabled={processingId === sub.id}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-sm transition font-medium disabled:opacity-50"
                      >
                        {processingId === sub.id ? "Processing..." : "Pay Now"}
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(sub.id)}
                      disabled={processingId === sub.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm transition font-medium disabled:opacity-50"
                    >
                      Delete
                    </button>
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
