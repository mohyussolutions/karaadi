"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FaCheckCircle, FaFacebook, FaTimesCircle } from "react-icons/fa";
import { postToFacebook, postToTikTok } from "@/actions/categories/socialPostAction";
import type { SocialPostPayload } from "@/actions/categories/socialPostAction";
import type { ShareData, PlatformState } from "./types";
import { COUNTDOWN_SECONDS, FB_MESSAGES, TT_MESSAGES } from "./constants";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.12 8.12 0 0 0 4.74 1.51V6.75a4.85 4.85 0 0 1-.97-.06z" />
  </svg>
);

const Spinner = ({ color }: { color: string }) => (
  <div className={`w-4 h-4 border-2 ${color} border-t-transparent rounded-full animate-spin flex-shrink-0`} />
);

export default function SocialShare({
  isFree, total, shareUrl, title, description, price, imageUrl, category,
}: ShareData) {
  const [countdown, setCountdown] = useState(COUNTDOWN_SECONDS);
  const [fbState, setFbState] = useState<PlatformState>("loading");
  const [ttState, setTtState] = useState<PlatformState>("idle");

  const payload: SocialPostPayload = { title, description, price, imageUrl, listingUrl: shareUrl, category };

  useEffect(() => {
    postToFacebook(payload).then((r) => setFbState(r.success ? "done" : "error"));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setCountdown((c) => (c > 0 ? c - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const handleTikTok = async () => {
    setTtState("loading");
    const r = await postToTikTok(payload);
    setTtState(r.success ? "done" : "error");
  };

  return (
    <div className="flex items-center justify-center py-10 px-2">
      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-3">
            <FaCheckCircle className="text-green-500" size={38} />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 text-center">
            {isFree ? "Listing Confirmed!" : "Payment Successful!"}
          </h1>
          <p className="text-sm text-gray-500 text-center mt-1">
            {isFree ? "Your listing is now live on Karaadi." : `$${total.toLocaleString()} paid — your listing is live.`}
          </p>
        </div>

        {imageUrl && (
          <div className="w-full rounded-2xl overflow-hidden border border-gray-100 mb-5">
            <img src={imageUrl} alt={title} className="w-full h-44 object-cover" />
            <div className="px-4 py-3 bg-gray-50">
              <p className="font-bold text-gray-900 text-sm truncate">{title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {category && <span className="capitalize">{category} · </span>}
                {price > 0 ? `$${price.toLocaleString()}` : "Free"}
              </p>
            </div>
          </div>
        )}

        <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3 mb-5 text-center">
          <p className="text-sm font-bold text-indigo-700">Reach more buyers — share your listing!</p>
          <p className="text-xs text-indigo-400 mt-0.5">Posting to Karaadi&apos;s official social media pages</p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 bg-gray-50/60">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-[#1877F2]">
              <FaFacebook className="text-white" size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">Facebook</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {fbState === "loading" && FB_MESSAGES.loading}
                {fbState === "done" && <><FaCheckCircle className="text-green-500" size={11} />{FB_MESSAGES.done}</>}
                {fbState === "error" && <><FaTimesCircle className="text-red-500" size={11} />{FB_MESSAGES.error}</>}
              </p>
            </div>
            {fbState === "loading" && <Spinner color="border-blue-500" />}
            {fbState === "done" && <FaCheckCircle className="text-green-500 flex-shrink-0" size={16} />}
          </div>

          <button
            type="button"
            onClick={handleTikTok}
            disabled={ttState === "loading" || ttState === "done"}
            className="flex items-center gap-3 w-full border border-gray-200 rounded-xl p-4 hover:bg-gray-50 active:scale-[0.99] transition-all touch-manipulation disabled:opacity-60 disabled:cursor-not-allowed text-left"
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-black">
              <TikTokIcon />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm">TikTok</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                {ttState === "loading" && TT_MESSAGES.loading}
                {ttState === "done" && <><FaCheckCircle className="text-green-500" size={11} />{TT_MESSAGES.done}</>}
                {ttState === "error" && <><FaTimesCircle className="text-red-500" size={11} />{TT_MESSAGES.error}</>}
                {ttState === "idle" && TT_MESSAGES.idle}
              </p>
            </div>
            {ttState === "loading" && <Spinner color="border-gray-500" />}
            {ttState === "done" && <FaCheckCircle className="text-green-500 flex-shrink-0" size={16} />}
          </button>
        </div>

        <div className="space-y-2">
          {shareUrl && (
            <Link
              href={shareUrl}
              className="flex items-center justify-center w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition touch-manipulation"
            >
              View My Listing
            </Link>
          )}
          <Link
            href="/marketplace"
            className="flex items-center justify-center w-full py-2.5 border border-gray-200 text-gray-500 font-semibold rounded-xl text-sm hover:bg-gray-50 transition touch-manipulation"
          >
            {countdown > 0 ? `Go to Marketplace (${countdown}s)` : "Go to Marketplace"}
          </Link>
        </div>
      </div>
    </div>
  );
}
