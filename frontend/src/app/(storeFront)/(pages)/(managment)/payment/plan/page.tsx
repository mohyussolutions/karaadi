"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HiCheckCircle, HiOutlineRocketLaunch } from "react-icons/hi2";
import { HiOutlineAcademicCap, HiOutlineLightningBolt } from "react-icons/hi";
import { MdOutlineArrowForwardIos, MdOutlineLoop } from "react-icons/md";
import { getSubPlans } from "@/actions/categories/feeAction";
import { getBoatById } from "@/actions/categories/boatActions";
import { SUBSCRIPTION_PLANS } from "@/actions/common/SUBSCRIPTION_PLANS";

const IconMap: Record<string, any> = {
  zap: HiOutlineLightningBolt,
  rocket: HiOutlineRocketLaunch,
  crown: HiOutlineAcademicCap,
};

function PlanContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const boatId = searchParams.get("id");

  const [boat, setBoat] = useState<any>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initData = async () => {
      try {
        // Fetch boat details to get feeAmount
        if (boatId) {
          const boatData = await getBoatById(boatId);
          setBoat(boatData);
        }

        // Fetch subscription plans
        const response = await getSubPlans();
        const config = Array.isArray(response) ? response[0] : response;

        const transformed = SUBSCRIPTION_PLANS.map((item) => ({
          ...item,
          price: config ? Number(config[item.key]) || 0 : 0,
          id: item.key,
        }));
        setPlans(transformed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [boatId]);

  const boatFeeAmount = boat?.feeAmount || 0;
  const planPrice = selectedPlan?.price || 0;
  const totalCost = boatFeeAmount + planPrice;
  const currency = "USD";

  if (loading)
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-white">
        <MdOutlineLoop className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );

  return (
    <div className="py-8 md:py-16 px-4 max-w-[1300px] mx-auto">
      <header className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-3">
          Dooro <span className="text-blue-600">Qorshaha</span>
        </h1>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] md:text-[11px]">
          Xayeysiiskaagu ha gaaro dad badan
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-16 items-stretch">
        {plans.map((p) => {
          const Icon = IconMap[p.iconName] || HiOutlineLightningBolt;
          const isActive = selectedPlan?.id === p.id;

          return (
            <div
              key={p.id}
              onClick={() => setSelectedPlan(p)}
              className={`relative flex flex-col py-8 px-8 rounded-[2rem] border-2 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 ${
                isActive
                  ? "border-blue-600 bg-white shadow-2xl z-10 scale-[1.02]"
                  : "border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-200 hover:shadow-xl"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-5 py-1.5 rounded-full font-black text-[9px] uppercase tracking-wider shadow-lg whitespace-nowrap">
                  Ugu Caansan
                </div>
              )}

              <div
                className={`mb-5 p-4 rounded-2xl inline-block w-fit transition-colors duration-300 ${isActive ? "bg-blue-600 text-white" : "bg-white text-slate-900 shadow-md"}`}
              >
                <Icon size={24} />
              </div>

              <div className="mb-5">
                <h3 className="text-xl font-black uppercase tracking-tight text-slate-900">
                  {p.label}
                </h3>
                <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest">
                  {p.days} Maalmood
                </p>
              </div>

              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter text-slate-900">
                  {p.price}
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {currency}
                </span>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {p.features.map((f: string, i: number) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 text-[13px] font-bold text-slate-600 leading-tight"
                  >
                    <HiCheckCircle
                      size={16}
                      className={`shrink-0 mt-0.5 ${isActive ? "text-blue-600" : "text-slate-300"}`}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              <div
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-center transition-all duration-300 ${isActive ? "bg-blue-600 text-white shadow-lg" : "bg-slate-900 text-white"}`}
              >
                {isActive ? "Waa la doortay" : "Dooro qorshahan"}
              </div>
            </div>
          );
        })}
      </div>

      {selectedPlan && (
        <div className="max-w-5xl mx-auto bg-slate-950 rounded-[2.5rem] p-8 md:p-10 text-white shadow-3xl relative overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-widest">
                  Lacagta Xayeysiiska
                </span>
                <span className="font-bold text-sm md:text-lg">
                  {currency} {boatFeeAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-slate-500 font-black uppercase text-[9px] tracking-widest">
                  Qorshaha ({selectedPlan.label})
                </span>
                <span className="font-bold text-sm md:text-lg text-blue-400">
                  +{currency} {planPrice.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-3">
                <span className="text-white font-black uppercase text-[10px] tracking-[0.2em]">
                  Wadarta Guud
                </span>
                <p className="text-3xl md:text-5xl font-black tracking-tighter text-blue-500">
                  {totalCost.toFixed(2)}
                </p>
              </div>
            </div>

            <button
              onClick={() =>
                router.push(
                  `/payment/${boatId}?planId=${selectedPlan.id}&total=${totalCost}`,
                )
              }
              className="w-full md:w-auto bg-blue-600 text-white px-12 py-6 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-xl hover:bg-blue-500"
            >
              Xaqiiji oo Bixi
              <MdOutlineArrowForwardIos
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Plan() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <PlanContent />
    </Suspense>
  );
}
