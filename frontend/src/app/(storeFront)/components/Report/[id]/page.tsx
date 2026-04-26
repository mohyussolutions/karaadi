"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { useAuth } from "@/context/AuthContext";
import Loading from "@/app/ui/loading/Loading";
import { createReport } from "@/actions/categories/reportAction";

export default function ReportPage() {
  const router = useRouter();
  const params = useParams();

  const itemId = (Array.isArray(params?.id) ? params.id[0] : params?.id) || "";

  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const userId = user?._id || user?.id;
    if (!userId || !itemId) {
      setError("Unable to identify user or item. Please try again.");
      return;
    }

    setSubmitting(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const reason = formData.get("reason") as string;
    const description = (formData.get("details") as string) || "";

    if (!reason) {
      setError("Please select a reason for reporting");
      setSubmitting(false);
      return;
    }

    try {
      const result = await createReport({
        userId: String(userId),
        reason,
        description,
        itemType: "MARKETPLACE",
        itemId: String(itemId),
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          router.back();
        }, 3000);
      } else {
        setError(result.error || "Failed to submit report");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) return null;

  if (success) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-black text-gray-900 mb-4">
              Report Submitted Successfully!
            </h2>
            <p className="text-gray-500 font-medium mb-8">
              Thank you for helping keep our community safe. Our team will
              review this report shortly.
            </p>
            <p className="text-sm text-gray-400">Redirecting you back...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-black transition-colors mb-10 font-black uppercase tracking-widest text-[10px]"
        >
          <IoIosArrowBack size={18} />
          Go Back to Item
        </button>

        <div className="bg-white rounded-[32px] p-12 shadow-sm border border-gray-100">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-4">
              Report Listing
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Hi{" "}
              <span className="text-blue-600 font-bold">
                {user?.username || "user"}
              </span>
              , please provide details about why this item should be reviewed.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl">
              <p className="text-red-600 font-medium text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Reason for report
              </label>
              <select
                name="reason"
                required
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-bold focus:ring-2 focus:ring-blue-500 outline-none appearance-none transition-all cursor-pointer"
              >
                <option value="">Dooro sababta</option>
                <option value="scam">Waa khayaano / Waxba kama jiraan</option>
                <option value="sold">Alaabtan mar horre ayaa la gatay</option>
                <option value="misleading">
                  Macluumaad khalad ah ayaa ku qoran
                </option>
                <option value="prohibited">
                  Waa wax mamnuuc ah ama sharci darro ah
                </option>
                <option value="offensive">
                  Muuqaal ama hadal gaf ah ayaa ku jira
                </option>
                <option value="other">Sabab kale</option>
              </select>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">
                Additional details
              </label>
              <textarea
                name="details"
                rows={6}
                placeholder="What exactly is wrong with this item?"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-5 text-gray-900 font-medium focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-5 rounded-2xl uppercase tracking-widest transition-all shadow-xl shadow-red-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
