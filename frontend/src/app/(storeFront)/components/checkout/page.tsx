"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { CHECKOUT_STEPS_CONFIG } from "@/app/(links)/storeFrontLinks/checkoutConstants";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const CheckoutSteps = (props: CheckoutStepsProps) => {
  const activeSteps = CHECKOUT_STEPS_CONFIG.map((step) => ({
    ...step,
    active: !!props[step.id as keyof CheckoutStepsProps],
  }));

  return (
    <nav className="w-full py-8 bg-white border-b border-slate-50 mb-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative flex items-center justify-between">
          <div className="absolute top-5 left-0 w-full h-[1px] bg-slate-100 -z-10" />

          {activeSteps.map((step, index) => {
            const Icon = step.icon;
            const isCurrent =
              step.active &&
              !activeSteps.slice(index + 1).some((s) => s.active);
            const isPast =
              step.active && activeSteps.slice(index + 1).some((s) => s.active);

            return (
              <div
                key={step.name}
                className="flex flex-col items-center flex-1"
              >
                {step.active ? (
                  <Link
                    href={step.href}
                    className="flex flex-col items-center group no-underline"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isCurrent
                          ? "bg-slate-900 text-white ring-4 ring-slate-100 scale-110 shadow-lg"
                          : "bg-green-600 text-white shadow-md"
                      }`}
                    >
                      {isPast ? (
                        <Check size={16} strokeWidth={3} />
                      ) : (
                        <Icon size={16} />
                      )}
                    </div>
                    <span
                      className={`mt-3 text-[9px] font-black uppercase tracking-[0.2em] ${
                        isCurrent ? "text-slate-900" : "text-green-600"
                      }`}
                    >
                      {step.name}
                    </span>
                  </Link>
                ) : (
                  <div className="flex flex-col items-center cursor-not-allowed">
                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 text-slate-200 flex items-center justify-center">
                      <Icon size={16} />
                    </div>
                    <span className="mt-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-200">
                      {step.name}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default CheckoutSteps;
