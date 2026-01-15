"use client";
import { FeeConfig } from "@/actions/categories/feeAction";
import { B2B_PLAN_CONFIG } from "@/app/(links)/dashboardLinks/PlanLinks";
import React from "react";


interface PlanCardsProps {
  selectedPlan: string;
  onPlanSelect: (planId: string) => void;
  dynamicFees: FeeConfig | null;
}

const PlanCards: React.FC<PlanCardsProps> = ({
  selectedPlan,
  onPlanSelect,
  dynamicFees,
}) => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {B2B_PLAN_CONFIG.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = Number(dynamicFees?.[plan.id as keyof FeeConfig]) || 0;

          return (
            <div
              key={plan.id}
              onClick={() => onPlanSelect(plan.id)}
              className={`relative rounded-3xl border-2 transition-all duration-300 cursor-pointer p-8 flex flex-col h-full
                ${
                  isSelected
                    ? "border-blue-700 bg-white shadow-2xl scale-[1.02]"
                    : "border-gray-200 bg-white hover:border-gray-300 shadow-sm"
                }`}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    {plan.name}
                  </h3>
                  <p className="text-gray-500 text-xs font-bold uppercase mt-1">
                    Muddada: {plan.duration}
                  </p>
                </div>
                {plan.badge && (
                  <span
                    className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase ${
                      isSelected
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {plan.badge}
                  </span>
                )}
              </div>

              <div className="mb-6 flex items-baseline">
                <span className="text-4xl font-black text-gray-900">
                  ${price}
                </span>
                <span className="ml-2 text-gray-400 text-xs font-bold uppercase">
                  {dynamicFees?.currency || "USD"}
                </span>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-start text-gray-600 font-medium text-sm"
                  >
                    <svg
                      className={`mr-3 h-5 w-5 flex-shrink-0 ${
                        isSelected ? "text-blue-700" : "text-gray-400"
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`w-full py-4 rounded-xl font-bold text-base transition-all ${
                  isSelected
                    ? "bg-blue-700 text-white shadow-lg"
                    : "bg-gray-900 text-white hover:bg-black"
                }`}
              >
                {isSelected ? "Waa Laguu Doortay" : "Dooro Qorshaha"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanCards;
