"use client";
import React from "react";
import { Phone, ShieldCheck, Loader2, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  accountNo: string;
  setAccountNo: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  status: string;
  error: string | null;
  total: number;
  safeAmount: number;
  serviceFee: number;
}

const PaymentForm: React.FC<PaymentFormProps> = ({
  accountNo,
  setAccountNo,
  onSubmit,
  status,
  error,
  total,
  safeAmount,
  serviceFee,
}) => {
  return (
    <div className="w-full h-full flex flex-col bg-white shadow-2xl md:rounded-3xl overflow-hidden border border-gray-100">
      <div className="p-8 bg-blue-600 text-white">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Checkout</h2>
          <ShieldCheck className="w-8 h-8 opacity-80" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black">${total.toFixed(2)}</span>
          <span className="text-blue-100 text-sm font-medium uppercase tracking-wider">
            Total Due
          </span>
        </div>
      </div>
      <form onSubmit={onSubmit} className="flex-1 p-8 space-y-8 flex flex-col">
        <div className="space-y-4">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-tight">
            Mobile Number
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            <input
              type="text"
              required
              placeholder="25261XXXXXXX"
              value={accountNo}
              onChange={(e) => setAccountNo(e.target.value)}
              className="w-full pl-14 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-blue-500 outline-none transition-all font-bold text-lg"
            />
          </div>
        </div>
        <div className="space-y-4 bg-gray-50 p-6 rounded-2xl">
          <div className="flex justify-between text-base">
            <span className="text-gray-500 font-medium">Activation Fee</span>
            <span className="text-gray-900 font-bold">
              ${safeAmount.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between text-base">
            <span className="text-gray-500 font-medium">Service Charge</span>
            <span className="text-gray-900 font-bold">
              ${serviceFee.toFixed(2)}
            </span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between text-lg pt-2">
            <span className="font-bold text-gray-900">Total</span>
            <span className="font-extrabold text-blue-600">
              ${total.toFixed(2)}
            </span>
          </div>
        </div>
        {error && (
          <div className="flex items-center gap-3 text-sm text-red-600 bg-red-50 p-5 rounded-2xl border border-red-100 animate-pulse">
            <AlertCircle className="w-6 h-6 shrink-0" />
            <span className="font-medium">{error}</span>
          </div>
        )}
        <div className="mt-auto">
          <button
            type="submit"
            disabled={status === "loading" || !accountNo}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white font-black py-6 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4 text-xl"
          >
            {status === "loading" ? (
              <Loader2 className="w-7 h-7 animate-spin" />
            ) : (
              `Pay $${total.toFixed(2)} Now`
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PaymentForm;
