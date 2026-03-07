"use client";

import React from "react";
import { motion } from "framer-motion";
import { Smartphone, Lock } from "lucide-react";

interface MobilePaymentProps {
  selectedMethod: string;
  setSelectedMethod: (value: string) => void;
  accountNumber: string;
  setAccountNumber: (value: string) => void;
  disabled?: boolean;
}

const MobilePayment: React.FC<MobilePaymentProps> = ({
  selectedMethod,
  setSelectedMethod,
  accountNumber,
  setAccountNumber,
  disabled = false,
}) => {
  const mobileMethods = ["EVC Plus", "Zaad", "Sahal", "eDahab"];

  return (
    <div
      className={`space-y-5 md:space-y-6 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="border-2 border-slate-100 rounded-xl p-4 md:p-5">
        <section>
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
              <Smartphone size={18} className="text-indigo-600" />
            </div>
            <div>
              <span className="font-black uppercase tracking-widest text-[10px] md:text-xs text-indigo-600">
                Step 02
              </span>
              <h3 className="font-black uppercase tracking-wider text-xs md:text-sm text-slate-700">
                Select Operator
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {mobileMethods.map((method) => (
              <motion.button
                key={method}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedMethod(method)}
                className={`w-full py-3 md:py-4 px-1 rounded-lg md:rounded-xl border-2 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs ${
                  selectedMethod === method
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                    : "border-slate-200 text-slate-500 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"
                }`}
              >
                {method}
              </motion.button>
            ))}
          </div>
        </section>
      </div>

      <div className="border-2 border-slate-100 rounded-xl p-4 md:p-5">
        <section>
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
              <Lock size={18} className="text-indigo-600" />
            </div>
            <div>
              <span className="font-black uppercase tracking-widest text-[10px] md:text-xs text-indigo-600">
                Step 03
              </span>
              <h3 className="font-black uppercase tracking-wider text-xs md:text-sm text-slate-700">
                Account Details
              </h3>
            </div>
          </div>
          <input
            type="tel"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="61XXXXXXX"
            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-indigo-600 outline-none transition-all font-black text-lg md:text-xl text-indigo-600 placeholder:text-slate-300 shadow-sm"
          />
          <p className="mt-1 text-[9px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">
            Enter your mobile money account number
          </p>
        </section>
      </div>
    </div>
  );
};

export default MobilePayment;
