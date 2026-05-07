"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaCheck } from "react-icons/fa";
import { STEPS_CONFIG } from "@/app/(links)/storeFrontLinks/checkingLinks";

interface Props {
  active: 1 | 2 | 3 | 4 | 5;
  businessId?: string;
  navigable?: boolean;
}

export default function BusinesscheckupSteps({
  active,
  businessId,
  navigable = false,
}: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const steps = STEPS_CONFIG.map((step) => {
    const done = step.n < active;
    const current = step.n === active;
    let onClick;

    if (navigable && done) {
      onClick = () => {
        const url = businessId
          ? `${step.path}?businessId=${businessId}`
          : step.path;
        router.push(url);
      };
    }

    return {
      n: step.n,
      label: t(`mine.businesses.${step.key}`),
      done,
      current,
      onClick,
    };
  });

  return (
    <div className="w-full flex justify-center mb-8 px-2">
      <div className="overflow-x-auto pb-1">
        <div className="flex items-start min-w-max px-0">
          {steps.map((step, i) => (
            <React.Fragment key={step.n}>
              <div className="flex flex-col items-center gap-1 w-16 sm:w-20 md:w-24 mx-2 sm:mx-3 md:mx-4 py-1 sm:py-2">
                <div className="relative">
                  {step.current && (
                    <span className="absolute inset-0 rounded-full border-4 border-blue-400 animate-pulse opacity-70 scale-105" />
                  )}
                  <button
                    type="button"
                    onClick={step.onClick}
                    disabled={!step.onClick}
                    className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold border-2 transition-all
                      ${
                        step.done
                          ? "bg-green-600 border-green-600 text-white cursor-pointer hover:bg-green-700"
                          : step.current
                            ? "bg-white border-blue-600 text-blue-600 shadow-sm cursor-default"
                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {step.done ? (
                      <FaCheck className="text-white text-xs sm:text-sm" />
                    ) : (
                      step.n
                    )}
                  </button>
                </div>
                <p
                  suppressHydrationWarning
                  className={`text-[10px] sm:text-[11px] text-center leading-tight w-full ${
                    step.done || step.current
                      ? "text-blue-600"
                      : "text-gray-400"
                  }`}
                >
                  {step.label}
                </p>
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-7 sm:w-8 md:w-10 h-0.5 mt-4 sm:mt-5 mx-1 rounded-full flex-shrink-0 ${
                    step.done ? "bg-green-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
