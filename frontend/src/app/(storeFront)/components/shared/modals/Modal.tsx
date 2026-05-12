"use client";

import React, { useState } from "react";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

interface SaveFavoriteModelProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
}

function SaveFavoriteModel({ onConfirm, onCancel }: SaveFavoriteModelProps) {
  const [isPending, setIsPending] = useState(false);
  const { language } = useLanguage();
  const so = language === "so";

  const handleConfirm = async () => {
    setIsPending(true);
    try {
      await onConfirm();
    } catch {
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={!isPending ? onCancel : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className={`w-8 h-8 text-blue-600 ${isPending ? "animate-pulse" : ""}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </div>

        <h3 className="mb-2 text-xl font-bold text-gray-900">
          {so ? "Ma rabtaa inaad kaydiso?" : "Save this item?"}
        </h3>
        <p className="mb-6 text-gray-500 text-sm">
          {so
            ? "Ku dar liiskaaga si aad dib dambe ugu hesho si degdeg ah."
            : "Add to your list to find it quickly later."}
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`w-full bg-blue-600 text-white py-3 rounded-xl font-semibold transition-all ${
              isPending
                ? "opacity-70 cursor-not-allowed"
                : "active:scale-95 hover:bg-blue-700"
            }`}
          >
            {isPending
              ? (so ? "Waa la kaydinayaa..." : "Saving...")
              : (so ? "Haa, Kaydi" : "Yes, Save")}
          </button>
          <button
            onClick={onCancel}
            disabled={isPending}
            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium active:scale-95 transition-transform disabled:opacity-50"
          >
            {so ? "Iska dhaaf" : "Skip"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveFavoriteModel;
