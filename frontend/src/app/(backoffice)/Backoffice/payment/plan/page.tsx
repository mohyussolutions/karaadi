"use client";

import React, { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "@/app/(storeFront)/store/hooks";
import { useRouter } from "next/navigation";
import { HiCheckCircle, HiOutlineRocketLaunch } from "react-icons/hi2";
import { HiOutlineAcademicCap, HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineArrowForwardIos, MdOutlineLoop } from "react-icons/md";
import { getActiveFee } from "@/actions/categories/feeAction";
import { SUBSCRIPTION_PLANS } from "@/actions/common/SUBSCRIPTION_PLANS";
import {
  selectPlan,
  selectSelectedPlan,
} from "@/app/(storeFront)/store/slices/planSlice";
import {
  selectActiveBoat,
  addBoat,
} from "@/app/(storeFront)/store/slices/boatsSlice";

const IconMap: Record<string, any> = {
  zap: HiOutlineLightningBolt,
  rocket: HiOutlineRocketLaunch,
  crown: HiOutlineAcademicCap,
};

export default function Plan() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const activeBoat = useAppSelector(selectActiveBoat);
  const selectedPlan = useAppSelector(selectSelectedPlan);
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const boatFeeAmount = activeBoat?.fee?.totalAmount || 0;
  const planPrice = selectedPlan?.price || 0;
  const totalCost = boatFeeAmount + planPrice;
  const currency = activeBoat?.fee?.currency || "USD";

  useEffect(() => {
    const initData = async () => {
      try {
        const config = await getActiveFee();
        if (!activeBoat) {
          const savedBoat = localStorage.getItem("boatData");
          if (savedBoat) dispatch(addBoat(JSON.parse(savedBoat)));
        }
        const transformed = SUBSCRIPTION_PLANS.map((item) => {
          const price = config ? Number((config as any)[item.key]) || 0 : 0;
          return { ...item, price, id: item.key };
        });
        setPlans(transformed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [dispatch, activeBoat]);

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <MdOutlineLoop className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="mt-4 font-black uppercase tracking-[0.2em] text-slate-400 text-[10px]">
          Waa la soo raryaa...
        </p>
      </div>
    );

  return (
    <div className="min-h-screen py-8 md:py-24 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto overflow-x-hidden">
      <header className="text-center mb-10 md:mb-24">
        <h1 className="text-3xl sm:text-6xl md:text-8xl font-black text-slate-900 tracking-tighter uppercase leading-tight mb-4">
          Dooro <span className="text-blue-600">Qorshahaaga</span>
        </h1>
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[9px] sm:text-xs">
          Xayeysiiskaagu ha gaaro dad badan
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-12 mb-20 items-stretch">
        {plans.map((p) => {
          const Icon = IconMap[p.iconName] || HiOutlineLightningBolt;
          const isActive = selectedPlan?.id === p.id;

          return (
            <div
              key={p.key}
              onClick={() => dispatch(selectPlan(p))}
              className={`relative flex flex-col py-10 md:py-20 px-6 md:px-12 rounded-[2.5rem] md:rounded-[3rem] border-2 cursor-pointer transition-all duration-500 group ${
                isActive
                  ? "border-blue-600 bg-white shadow-2xl scale-[1.01] md:scale-105 z-10"
                  : "border-slate-100 bg-slate-50/50 hover:border-slate-300"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-6 py-2 rounded-full font-black text-[9px] uppercase tracking-[0.15em] shadow-lg whitespace-nowrap">
                  Ugu Caansan
                </div>
              )}

              <div
                className={`mb-6 md:mb-10 p-4 md:p-6 rounded-2xl md:rounded-[2rem] inline-block w-fit transition-all ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-900 shadow-sm"}`}
              >
                <Icon size={28} className="md:w-10 md:h-10" />
              </div>

              <div className="mb-6 md:mb-8">
                <h3 className="text-xl md:text-3xl font-black uppercase tracking-tight text-slate-900">
                  {p.label}
                </h3>
                <p className="text-blue-600 font-black text-[10px] md:text-xs uppercase tracking-widest">
                  {p.days} Maalmood
                </p>
              </div>

              <div className="mb-8 md:mb-12 flex items-baseline gap-2">
                <span className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900">
                  {p.price}
                </span>
                <span className="text-sm md:text-xl font-bold text-slate-400">
                  {currency}
                </span>
              </div>

              <ul className="space-y-4 md:space-y-6 mb-10 md:mb-16 flex-1">
                {p.features.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[13px] md:text-base font-bold text-slate-600 leading-tight"
                  >
                    <HiCheckCircle
                      size={18}
                      className={`shrink-0 mt-0.5 ${isActive ? "text-blue-600" : "text-slate-300"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div
                className={`w-full py-4 md:py-6 rounded-2xl md:rounded-[2rem] font-black uppercase tracking-[0.15em] text-[10px] text-center transition-all ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-900 text-white"
                }`}
              >
                {isActive ? "Waa la doortay" : "Dooro qorshahan"}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[2.5rem] md:rounded-[5rem] p-6 md:p-20 text-white shadow-3xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-8 md:gap-20">
            <div className="flex-1 w-full space-y-4 md:space-y-8">
              <div className="flex justify-between items-center border-b border-white/5 pb-4 md:pb-6">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em]">
                  Lacagta Markabka
                </span>
                <span className="font-bold text-sm md:text-xl">
                  {currency} {boatFeeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-4 md:pb-6">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-[0.3em]">
                  Dheeraadka
                </span>
                <span className="font-bold text-sm md:text-xl text-blue-400">
                  +{currency} {planPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-4 md:pt-6">
                <span className="text-white font-black uppercase text-[10px] tracking-[0.4em]">
                  Wadarta
                </span>
                <div className="text-right">
                  <p className="text-4xl md:text-8xl font-black tracking-tighter text-blue-500 leading-none">
                    {totalCost.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(`/Backoffice/summary/summaryBoat/${activeBoat?.id}`)
              }
              className="w-full lg:w-auto bg-blue-600 text-white px-10 py-6 md:py-10 rounded-2xl md:rounded-[3rem] font-black uppercase tracking-[0.15em] text-[11px] md:text-sm flex items-center justify-center gap-3 transition-all active:scale-95 group"
            >
              Xaqiiji Qorshaha
              <MdOutlineArrowForwardIos
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
