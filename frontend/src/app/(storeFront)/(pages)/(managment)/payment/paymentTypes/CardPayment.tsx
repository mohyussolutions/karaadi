"use client";

import React from "react";
import { motion } from "framer-motion";
import { CreditCard, Lock } from "lucide-react";

interface CardPaymentProps {
  cardNumber: string;
  setCardNumber: (value: string) => void;
  cardName: string;
  setCardName: (value: string) => void;
  cardExpiry: string;
  setCardExpiry: (value: string) => void;
  cardCvv: string;
  setCardCvv: (value: string) => void;
  disabled?: boolean;
}

const CardPayment: React.FC<CardPaymentProps> = ({
  cardNumber,
  setCardNumber,
  cardName,
  setCardName,
  cardExpiry,
  setCardExpiry,
  cardCvv,
  setCardCvv,
  disabled = false,
}) => {
  return (
    <div
      className={`border-2 border-slate-100 rounded-xl p-4 md:p-5 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <section>
        <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
          <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
            <CreditCard size={18} className="text-indigo-600" />
          </div>
          <div>
            <span className="font-black uppercase tracking-widest text-[10px] md:text-xs text-indigo-600">
              Step 02
            </span>
            <h3 className="font-black uppercase tracking-wider text-xs md:text-sm text-slate-700">
              Card Details
            </h3>
          </div>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={cardNumber}
            onChange={(e) =>
              setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))
            }
            placeholder="Card Number"
            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-indigo-600 outline-none transition-all font-black text-sm md:text-base text-indigo-600 placeholder:text-slate-300 shadow-sm"
          />
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="Cardholder Name"
            className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-indigo-600 outline-none transition-all font-black text-sm md:text-base text-indigo-600 placeholder:text-slate-300 shadow-sm"
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(e.target.value)}
              placeholder="MM/YY"
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-indigo-600 outline-none transition-all font-black text-sm md:text-base text-indigo-600 placeholder:text-slate-300 shadow-sm"
            />
            <input
              type="text"
              value={cardCvv}
              onChange={(e) =>
                setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))
              }
              placeholder="CVV"
              className="w-full px-4 md:px-5 py-3 md:py-4 bg-white border-2 border-slate-200 rounded-lg md:rounded-xl focus:border-indigo-600 outline-none transition-all font-black text-sm md:text-base text-indigo-600 placeholder:text-slate-300 shadow-sm"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default CardPayment;
