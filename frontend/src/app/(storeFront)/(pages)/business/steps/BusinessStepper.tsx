"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

const STEPS = [
  { n: 1, key: "stepApply", path: "/business/Apply" },
  { n: 2, key: "stepApproval", path: "/business/Approval" },
  { n: 3, key: "stepPlan", path: "/business/plan" },
  { n: 4, key: "stepPost", path: "/business/post" },
] as const;

export default function BusinessStepper({
  active,
  businessId,
}: {
  active: 1 | 2 | 3 | 4;
  businessId?: string;
}) {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const router = useRouter();

  const getStepLabel = (stepKey: string) => {
    const translated = t(`mine.businesses.${stepKey}`);
    if (translated === `mine.businesses.${stepKey}`) {
      const fallbacks: Record<string, string> = {
        stepApply: language === "so" ? "Codsiga" : "Apply",
        stepApproval: language === "so" ? "Ansixin" : "Approval",
        stepPlan: language === "so" ? "Qorshe" : "Plan",
        stepPost: language === "so" ? "Nooca dooro" : "Post",
      };
      return fallbacks[stepKey];
    }
    return translated;
  };

  const navigate = (stepN: number, path: string) => {
    if (stepN >= active) return;
    const url = businessId ? `${path}?businessId=${businessId}` : path;
    router.push(url);
  };

  return (
    <div className="w-full overflow-x-auto mb-10 pb-1">
      <div className="flex items-start min-w-max px-1">
        {STEPS.map((s, i) => {
          const done = s.n < active;
          const current = s.n === active;
          const clickable = done;
          const stepLabel = getStepLabel(s.key);

          return (
            <React.Fragment key={s.n}>
              <div className="flex flex-col items-center gap-1.5 w-24">
                <div className="relative">
                  {current && (
                    <span className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping opacity-60" />
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(s.n, s.path)}
                    disabled={!clickable}
                    className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all
                      ${
                        done
                          ? "bg-blue-600 border-blue-600 text-white cursor-pointer hover:bg-blue-700"
                          : current
                            ? "bg-white border-blue-600 text-blue-600 shadow-sm cursor-default"
                            : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                  >
                    {done ? "✓" : s.n}
                  </button>
                </div>

                <p
                  className={`text-[11px] text-center leading-tight w-full ${
                    done || current ? "text-blue-600" : "text-gray-400"
                  }`}
                  suppressHydrationWarning
                >
                  {stepLabel}
                </p>
              </div>

              {i < STEPS.length - 1 && (
                <div
                  className={`w-10 h-0.5 mt-5 mx-1 rounded-full flex-shrink-0 ${
                    s.n < active ? "bg-blue-600" : "bg-gray-200"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
