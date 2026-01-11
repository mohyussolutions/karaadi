"use client";
import React from "react";
import { CheckCircle2, ReceiptText, ArrowRight } from "lucide-react";

interface PaymentSuccessProps {
  id: string;
  msg: string;
  onNavigate: () => void;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  id,
  msg,
  onNavigate,
}) => {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-white p-10 text-center animate-in fade-in zoom-in duration-500">
      <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center mb-8 shadow-inner">
        <CheckCircle2 className="w-16 h-16 text-green-600" />
      </div>
      <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">
        Hambalyo!
      </h2>
      <p className="text-xl text-gray-600 mb-10 max-w-sm mx-auto leading-relaxed">
        {msg}
      </p>
      <div className="w-full max-w-sm bg-gray-50 rounded-3xl p-6 mb-10 border border-gray-100 shadow-sm text-left">
        <div className="flex items-center gap-2 text-gray-400 text-xs mb-3 uppercase font-black tracking-widest">
          <ReceiptText className="w-4 h-4" /> Reference ID
        </div>
        <p className="font-mono text-sm text-gray-800 break-all bg-white p-4 rounded-xl border border-gray-200 shadow-inner">
          {id}
        </p>
      </div>
      <button
        onClick={onNavigate}
        className="w-full max-w-sm bg-gray-900 text-white font-black py-6 rounded-2xl hover:bg-black transition-all transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3 text-lg shadow-2xl"
      >
        home page
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default PaymentSuccess;
