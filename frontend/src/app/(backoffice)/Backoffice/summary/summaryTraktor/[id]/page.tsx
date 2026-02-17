"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppSelector } from "@/app/(storeFront)/store/hooks";

import { Hash, ShoppingBag, ChevronLeft, CheckCircle2 } from "lucide-react";
import { Tractor } from "@/app/utils/types/store/traktorTypes";

export default function SummaryTraktor() {
  const router = useRouter();
  const params = useParams();
  const entityId = params.id as string;

  const entity = useAppSelector((state) => {
    const traktorSlice = state["tractors"] as any;
    const traktorList = traktorSlice?.traktors || [];
    return traktorList.find((t: Tractor) => t.id === entityId);
  });

  if (!entity) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          Xogta Machine-ka lama helin
        </h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-amber-600 text-white rounded-xl font-bold"
        >
          Dib u noqo
        </button>
      </div>
    );
  }

  const excludedKeys = [
    "images",
    "description",
    "title",
    "id",
    "_id",
    "userId",
    "fee",
    "createdAt",
    "updatedAt",
    "category",
    "subcategory",
    "mainCategory",
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:flex-grow p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Back</span>
          </button>
          <div className="flex items-center gap-1 text-slate-400">
            <Hash className="w-3 h-3" />
            <span className="text-[10px] font-mono uppercase">
              ID: {entity.id.split("-")[0]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-amber-600 mb-4">
          <ShoppingBag className="w-5 h-5" />
          <span className="font-black uppercase tracking-widest text-xs">
            {entity.mainCategory}
          </span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-none">
          {entity.title}
        </h1>

        <div className="flex items-center gap-4 mb-8">
          <div className="px-4 py-2 bg-amber-50 text-amber-700 rounded-full font-bold text-sm">
            {entity.condition}
          </div>
          <div className="text-2xl font-black text-slate-900">
            ${entity.price.toLocaleString()}
          </div>
        </div>

        <p className="text-slate-600 text-sm md:text-lg mb-8 max-w-3xl font-medium leading-relaxed border-l-4 border-amber-100 pl-4">
          {entity.description}
        </p>

        {entity.images && entity.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {entity.images.map((img: string, idx: number) => (
              <div
                key={idx}
                className="relative aspect-video bg-slate-100 rounded-2xl overflow-hidden border border-slate-100"
              >
                <img
                  src={img}
                  alt={`Preview ${idx}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(entity).map(([key, value]) => {
            if (excludedKeys.includes(key)) return null;
            if (typeof value === "object" && value !== null) return null;

            return (
              <div
                key={key}
                className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col justify-between"
              >
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </p>
                <p className="text-lg font-black text-slate-800 uppercase">
                  {String(value)}
                </p>
              </div>
            );
          })}
        </div>

        {entity.fee && (
          <div className="mt-12 p-8 bg-slate-900 rounded-[2.5rem] text-white flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                Payment Details
              </p>
              <h3 className="text-2xl font-bold uppercase">Listing Total</h3>
            </div>
            <div className="text-center md:text-right">
              <p className="text-4xl font-black">
                {entity.fee.currency} {entity.fee.totalAmount}
              </p>
              <p className="text-slate-400 text-[10px] font-bold uppercase mt-1">
                Platform & Tax Included
              </p>
            </div>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button className="flex items-center gap-2 px-10 py-4 bg-green-500 text-white rounded-full font-black hover:bg-green-600 transition-all shadow-xl uppercase text-sm tracking-widest">
            Confirm Listing <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
