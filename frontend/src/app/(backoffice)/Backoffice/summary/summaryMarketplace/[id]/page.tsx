"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  ShoppingBag,
  MapPin,
  User,
  Mail,
  Calendar,
  Hash,
  ShieldCheck,
} from "lucide-react";
import { useAppSelector } from "@/app/(storeFront)/store/hooks";
import { RootState } from "@/store";
import { SLICE_KEYS } from "@/store/keys";

export default function SummaryMarketplace() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const entityId = params.id as string;

  const item = useAppSelector((state: RootState) => {
    const marketplaceSlice = state[
      SLICE_KEYS.MARKETPLACE as keyof RootState
    ] as any;
    const items = marketplaceSlice?.items || [];
    return items.find((m: any) => m.id === entityId || m._id === entityId);
  });

  if (!item) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          No Marketplace Data Found
        </h2>
        <button
          onClick={() => router.push("/marketplace")}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  //

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:flex-grow p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <ShoppingBag className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">
              Product Summary
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Hash className="w-3 h-3" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">
              Item ID: {item.id || item._id}
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 uppercase tracking-tight leading-none">
          {item.title || item.name}
        </h1>

        <p className="text-slate-500 text-sm md:text-lg mb-8 max-w-3xl font-medium leading-relaxed">
          {item.description}
        </p>

        {item.images &&
          Array.isArray(item.images) &&
          item.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-12">
              {item.images.map((img: string, idx: number) => (
                <img
                  key={idx}
                  src={img}
                  alt="Product"
                  className="w-40 h-32 object-cover rounded-2xl border border-slate-100 shadow-sm hover:scale-105 transition-transform"
                />
              ))}
            </div>
          )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {Object.entries(item).map(([key, value]) => {
            if (
              ["images", "description", "title", "name", "id", "_id"].includes(
                key,
              )
            )
              return null;
            if (Array.isArray(value)) {
              return (
                <div
                  key={key}
                  className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
                >
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {key}
                  </p>
                  <p className="text-lg font-bold text-slate-800 uppercase">
                    {value.join(", ")}
                  </p>
                </div>
              );
            }
            if (typeof value === "object" && value !== null) return null;
            return (
              <div
                key={key}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {key}
                </p>
                <p className="text-lg font-bold text-slate-800 uppercase">
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-[0.98] disabled:bg-slate-400"
          >
            {isSubmitting ? "Processing..." : "Confirm & Pay"}
            <ChevronRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
          >
            Go Back & Edit
          </button>
        </div>
      </div>
    </div>
  );
}
