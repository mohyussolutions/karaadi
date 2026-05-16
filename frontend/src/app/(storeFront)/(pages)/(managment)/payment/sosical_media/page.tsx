"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FaCheckCircle } from "react-icons/fa";
import SocialShare from "./SocialShare";
import type { ShareData } from "./types";
import { SOCIAL_STORAGE_KEY } from "./constants";

export default function SocialMediaPage() {
  const [data, setData] = useState<ShareData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(SOCIAL_STORAGE_KEY);
      if (!raw) {
        setNotFound(true);
        return;
      }
      const parsed: ShareData = JSON.parse(raw);
      sessionStorage.removeItem(SOCIAL_STORAGE_KEY);
      setData(parsed);
    } catch {
      setNotFound(true);
    }
  }, []);

  if (notFound) {
    return (
      <div className="flex items-center justify-center py-16 px-4">
        <div className="w-full max-w-sm bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col items-center text-center gap-4">
          <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center">
            <FaCheckCircle className="text-green-400" size={30} />
          </div>
          <h1 className="text-lg font-extrabold text-gray-900">Payment Completed</h1>
          <p className="text-xs text-gray-400">
            Your listing is live. This page is only accessible right after payment.
          </p>
          <Link
            href="/marketplace"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition"
          >
            Go to Marketplace
          </Link>
          <Link href="/mine/my-ads" className="text-xs text-gray-400 hover:text-blue-500 underline">
            View my listings
          </Link>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return <SocialShare {...data} />;
}
