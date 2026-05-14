"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle } from "react-icons/fa";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { resetFlow } from "@/store/slices/reducers/listingDraftSlice";

interface Props {
  isFree: boolean;
  total: number;
  shareUrl: string;
}

export default function SocialShareSuccess({ isFree, total, shareUrl }: Props) {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [copied, setCopied] = useState(false);
  const [countdown, setCountdown] = useState(10);

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

  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  const handleCopyForTikTok = () => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div className="absolute inset-0 bg-white flex flex-col items-center justify-center rounded-2xl z-50 px-5 py-6">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
        <FaCheckCircle className="text-green-500" size={36} />
      </div>

      <p className="font-bold text-green-600 text-lg text-center mb-1">
        {isFree
          ? t("payment.confirmedTitle", "Listing Confirmed!")
          : t("payment.successTitle", "Payment Successful!")}
      </p>

      <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-2.5 mb-4 text-center w-full">
        <p className="text-xs font-bold text-indigo-700 mb-0.5">
          {t("payment.sharePrompt", "Reach more buyers — share your listing!")}
        </p>
        <p className="text-[10px] text-indigo-400">
          {t("payment.shareSubPrompt", "People who click will land on your listing page")}
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
        <a
          href={fbShareUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-300 active:scale-[0.99] transition-all touch-manipulation select-none"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1877F2]">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M24 12.073C24 5.445 18.627 0 12 0S0 5.445 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Share on Facebook</p>
            <p className="text-xs text-gray-400">{t("payment.fbNote", "Opens Facebook share dialog")}</p>
          </div>
          <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        <button
          type="button"
          onClick={handleCopyForTikTok}
          className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 hover:bg-gray-50 active:scale-[0.99] transition-all touch-manipulation select-none text-left"
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-black">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.12 8.12 0 0 0 4.74 1.51V6.75a4.85 4.85 0 0 1-.97-.06z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm">Share on TikTok</p>
            <p className="text-xs text-gray-400">
              {copied
                ? t("payment.linkCopied", "Link copied! Open TikTok and paste it ✓")
                : t("payment.ttNote", "Copies link — open TikTok and paste")}
            </p>
          </div>
          {copied ? (
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg flex-shrink-0">COPIED</span>
          ) : (
            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
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
