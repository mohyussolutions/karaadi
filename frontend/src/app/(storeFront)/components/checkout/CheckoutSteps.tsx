"use client";

import React from "react";
import { Check } from "lucide-react";
import { steps } from "@/app/(links)/storeFrontLinks/checkingLinks";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
  onStepClick?: (step: number) => void;
}

const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  onStepClick,
}: CheckoutStepsProps) => {
  const stepStatus = [step1, step2, step3, step4];

  return (
    <div className="flex justify-center mb-8 w-full">
      <div className="flex items-center justify-between w-full max-w-2xl gap-6 md:gap-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center gap-2">
              {stepStatus[index] ? (
                <button
                  onClick={() => onStepClick?.(step.id)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center shadow-md">
                    <Check size={18} strokeWidth={3} />
                  </div>
                  <span className="text-[11px] font-bold uppercase text-green-600 tracking-wide">
                    {step.name}
                  </span>
                </button>
              ) : (
                <div className="flex flex-col items-center gap-2 opacity-40 cursor-not-allowed">
                  <div className="w-10 h-10 rounded-full border-2 border-gray-300 bg-gray-50 text-gray-400 flex items-center justify-center">
                    <span className="text-sm font-bold">{step.id}</span>
                  </div>
                  <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wide">
                    {step.name}
                  </span>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className="hidden md:block flex-1 h-[2px] bg-gray-200 rounded-full max-w-[60px]" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;
