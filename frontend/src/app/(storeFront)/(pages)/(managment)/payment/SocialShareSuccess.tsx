"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { resetFlow } from "@/store/slices/reducers/listingDraftSlice";
import { postToFacebook, postToTikTok } from "@/actions/categories/socialPostAction";

interface Props {
  isFree: boolean;
  total: number;
  shareUrl: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

type PlatformState = "idle" | "loading" | "done" | "error";

export default function SocialShareSuccess({ isFree, total, shareUrl, title, description, price, imageUrl, category }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [countdown, setCountdown] = useState(30);
  const [fbState, setFbState] = useState<PlatformState>("idle");
  const [ttState, setTtState] = useState<PlatformState>("idle");

  useEffect(() => {
    const id = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (countdown === 0) {
      dispatch(resetFlow());
      window.location.href = "/";
    }
  }, [countdown, dispatch]);

  const payload = { title, description, price, imageUrl, listingUrl: shareUrl, category };

  const handleFacebook = async () => {
    setFbState("loading");
    const result = await postToFacebook(payload);
    setFbState(result.success ? "done" : "error");
  };

  const handleTikTok = async () => {
    setTtState("loading");
    const result = await postToTikTok(payload);
    setTtState(result.success ? "done" : "error");
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50 px-5 py-6 overflow-y-auto">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
        <FaCheckCircle className="text-green-500" size={36} />
      </div>

      <p className="font-bold text-green-600 text-lg text-center mb-1">
        {isFree ? t("payment.confirmedTitle", "Listing Confirmed!") : t("payment.successTitle", "Payment Successful!")}
      </p>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-4 text-center w-full">
        <p className="text-xs font-bold text-indigo-700 mb-0.5">
          {t("payment.sharePrompt", "Reach more buyers — share your listing!")}
        </p>
        <p className="text-[10px] text-indigo-400">
          {t("payment.shareSubPrompt", "Post to Karaadi's official social media pages")}
        </p>
      </div>

      <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 mb-4 text-center w-full">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-gray-400 mb-1">
          {t("payment.totalAmount", "Total Amount")}
        </p>
        <p className={`text-2xl font-extrabold ${isFree ? "text-green-600" : "text-blue-600"}`}>
          {isFree ? t("payment.free", "Free") : `$${total.toLocaleString()}`}
        </p>
      </div>

      <div className="w-full space-y-3 mb-4">
        <button
          type="button"
          onClick={handleFacebook}
          disabled={fbState === "loading" || fbState === "done"}
          className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 active:scale-[0.99] transition-all touch-manipulation select-none disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1877F2]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Post to Facebook</p>
            <p className="text-xs text-gray-400">
              {fbState === "loading" ? "Posting..." : fbState === "done" ? "✓ Posted to Karaadi Facebook page!" : fbState === "error" ? "❌ Failed — try again" : "Post on Karaadi's Facebook page"}
            </p>
          </div>
          {fbState === "loading" && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
          {fbState === "done" && <FaCheckCircle className="text-green-500 flex-shrink-0" size={16} />}
        </button>

        <button
          type="button"
          onClick={handleTikTok}
          disabled={ttState === "loading" || ttState === "done"}
          className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 hover:bg-gray-50 active:scale-[0.99] transition-all touch-manipulation select-none text-left disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-black">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.12 8.12 0 0 0 4.74 1.51V6.75a4.85 4.85 0 0 1-.97-.06z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Post to TikTok</p>
            <p className="text-xs text-gray-400">
              {ttState === "loading" ? "Posting..." : ttState === "done" ? "✓ Posted to Karaadi TikTok page!" : ttState === "error" ? "❌ Failed — try again" : "Post on Karaadi's TikTok page"}
            </p>
          </div>
          {ttState === "loading" && <div className="w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />}
          {ttState === "done" && <FaCheckCircle className="text-green-500 flex-shrink-0" size={16} />}
        </button>
      </div>

      <a
        href="/"
        onClick={() => dispatch(resetFlow())}
        className="w-full text-center py-2.5 text-sm font-semibold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition touch-manipulation"
      >
        {countdown > 0
          ? t("payment.skipWithCountdown", `Skip — going home in ${countdown}s`)
          : t("payment.goHome", "Go to homepage")}
      </a>
    </div>
  );
}
