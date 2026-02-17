import { PLAN_ICONS } from "@/app/utils/icons/icons";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: any;
  isActive: boolean;
  currency: string;
  onSelect: () => void;
}

export const PlanCard = ({
  plan,
  isActive,
  currency,
  onSelect,
}: PlanCardProps) => {
  const Icon = PLAN_ICONS[plan.iconName] || PLAN_ICONS.zap;

  return (
    <div
      onClick={onSelect}
      className={`group relative flex flex-col p-1 rounded-[2.5rem] transition-all duration-500 cursor-pointer border-2
        ${isActive ? "border-indigo-600 bg-indigo-600 shadow-2xl scale-[1.03]" : "border-slate-200 bg-transparent hover:scale-[1.01]"}`}
    >
      <div className="bg-white rounded-[2.3rem] p-8 flex-1 flex flex-col">
        {plan.popular && (
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[10px] font-black py-1.5 px-6 rounded-full uppercase shadow-lg">
            Recommended
          </div>
        )}
        <div className="flex justify-between items-start mb-8">
          <div
            className={`p-4 rounded-2xl ${isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 group-hover:bg-indigo-50"}`}
          >
            <Icon size={24} />
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-slate-900">
              {plan.days}{" "}
              <span className="text-sm font-bold text-slate-400">Days</span>
            </p>
          </div>
        </div>
        <h3 className="text-2xl font-black text-slate-900 uppercase mb-2">
          {plan.label}
        </h3>
        <div className="text-4xl font-black text-slate-900 mb-8">
          {currency} {plan.price.toFixed(2)}
        </div>

        <ul className="flex-1 space-y-4 mb-10">
          {plan.features.map((feature: string, i: number) => (
            <li
              key={i}
              className="flex items-center gap-3 text-sm font-semibold text-slate-600"
            >
              <div className="bg-green-100 p-1 rounded-full">
                <Check size={12} className="text-green-600" />
              </div>
              {feature}
            </li>
          ))}
        </ul>
        <button
          className={`w-full py-5 rounded-2xl font-black text-xs uppercase ${isActive ? "bg-indigo-600 text-white" : "bg-slate-900 text-white"}`}
        >
          {isActive ? "Selected" : "Choose Plan"}
        </button>
      </div>
    </div>
  );
};
