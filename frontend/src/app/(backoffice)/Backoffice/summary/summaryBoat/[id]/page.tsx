"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(storeFront)/store/store";
import {
  ChevronRight,
  Ship,
  Hash,
  ShieldCheck,
  CreditCard,
  Info,
  ArrowLeft,
} from "lucide-react";

export default function SummaryBoat() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const boat = useSelector((state: RootState) => state.boats?.userSelection);
  const plan = useSelector((state: RootState) => state.plan?.userSelection);

  const total = (boat?.fee?.totalAmount || 0) + (plan?.price || 0);

  const handlePayment = () => {
    if (!boat?.id) return;
    setIsSubmitting(true);
    router.push(`/Backoffice/payment/${boat.id}`);
  };

  if (!boat) return null;

  const specs = [
    { label: "Model", value: boat.boatModel },
    { label: "Hull", value: boat.type },
    { label: "Engine", value: boat.transmission },
    { label: "Color", value: boat.color },
    { label: "Type", value: boat.listingType },
    { label: "City", value: boat.city },
  ].filter((item) => item.value);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen w-full bg-white font-sans text-slate-900 overflow-x-hidden">
      <main className="flex-1 w-full p-6 lg:p-16 lg:h-screen lg:overflow-y-auto">
        <div className="flex items-center justify-between mb-12">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-black uppercase text-[9px] tracking-widest"
          >
            <ArrowLeft size={14} /> Back
          </button>
          <div className="px-4 py-1.5 bg-slate-50 border rounded-full text-[9px] font-mono text-slate-400">
            REF: {boat.id?.slice(-8)}
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
          {boat.title}
        </h1>
        <p className="text-slate-500 text-lg border-l-4 border-indigo-600 pl-6 mb-12 max-w-2xl">
          {boat.description}
        </p>

        {boat.images && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
            {boat.images.map((img: any, idx: number) => (
              <div
                key={idx}
                className={`rounded-3xl overflow-hidden border-2 border-white shadow-sm ${idx === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"}`}
              >
                <img
                  src={typeof img === "string" ? img : img?.url}
                  alt="Vessel"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {specs.map((spec, i) => (
            <div
              key={i}
              className="p-6 bg-slate-50 rounded-3xl border border-transparent hover:border-slate-100 transition-all"
            >
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {spec.label}
              </p>
              <p className="font-bold text-slate-800 uppercase">{spec.value}</p>
            </div>
          ))}
        </div>
      </main>

      <aside className="flex-none w-full lg:w-[340px] xl:w-[380px] bg-slate-50 border-l border-slate-100 p-8 flex flex-col justify-between lg:h-screen lg:sticky lg:top-0">
        <div className="space-y-10 mt-12">
          <div className="flex items-center gap-3 text-slate-400">
            <CreditCard size={16} />
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">
              Checkout
            </h2>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase">
                Price
              </span>
              <span className="font-black text-sm">
                ${boat.price?.toLocaleString()}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center text-slate-600">
              <span className="text-[10px] font-black uppercase">Fees</span>
              <span className="font-bold text-sm">
                ${boat.fee?.totalAmount?.toFixed(2)}
              </span>
            </div>

            {plan && (
              <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100 flex justify-between items-center text-indigo-600">
                <span className="text-[10px] font-black uppercase">
                  {plan.label}
                </span>
                <span className="font-bold text-sm">
                  ${plan.price?.toFixed(2)}
                </span>
              </div>
            )}

            <div className="p-8 rounded-[2.5rem] relative overflow-hidden">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-2">
                Total
              </p>
              <p className="text-4xl font-black tracking-tighter">
                ${total.toFixed(2)}
              </p>
              <CreditCard className="absolute -right-4 -bottom-4 w-20 h-20 text-slate-200/10 rotate-12" />
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <button
            disabled={isSubmitting}
            onClick={handlePayment}
            className="w-full flex items-center justify-between p-1.5 pl-6 bg-indigo-600 text-white rounded-full font-black text-sm hover:bg-slate-900 transition-all shadow-lg"
          >
            <span>{isSubmitting ? "WAIT..." : "PAY NOW"}</span>
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ChevronRight size={18} />
            </div>
          </button>
          <button
            onClick={() => router.back()}
            className="w-full text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 text-center"
          >
            Modify Details
          </button>
        </div>
      </aside>
    </div>
  );
}
