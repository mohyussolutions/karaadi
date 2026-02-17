"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { PAYMENT_ENDPOINTS } from "@/actions/constant/constant";
import { verifySession } from "@/actions/core/authAction";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Smartphone,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { toast } from "react-toastify";
import { PaymentMethods } from "../paymentMethod";
import { motion, AnimatePresence } from "framer-motion";
import { RootState } from "@/app/utils/types/store/storeTypes";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const [selectedMethod, setSelectedMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const boat = useSelector((state: RootState) => state.boats?.userSelection);
  const plan = useSelector((state: RootState) => state.plans?.userSelection);
  const { userInfo } = useSelector((state: RootState) => state.auth);
  const boatId = params.id as string;

  const totalAmount = useMemo(
    () => (boat?.fee?.totalAmount || 0) + (plan?.price || 0),
    [boat, plan],
  );
  const currency = boat?.fee?.currency || "USD";

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const session = await verifySession();
        if (!session && !userInfo) return router.replace("/login");
        if (!boat || boatId !== boat?.id)
          return router.replace("/Backoffice/boats");
      } catch (error) {
        if (!userInfo) router.replace("/login");
      } finally {
        setIsAuthorizing(false);
      }
    };
    validateAccess();
  }, [userInfo, boat, boatId, router]);

  const handlePayment = async () => {
    if (!boat || !boatId) return toast.error("Xogta markabka waa la la'yahay");
    if (!selectedMethod) return toast.error("Fadlan dooro habka lacag bixinta");
    if (!accountNumber || accountNumber.length < 7)
      return toast.error("Fadlan geli nambar akoon oo sax ah");

    setLoading(true);
    try {
      const paymentPayload = {
        userId: userInfo?._id || "guest",
        itemCategory: "BOAT",
        itemId: boatId,
        paymentMethod: selectedMethod,
        listingType: boat.listingType === "sell" ? 0 : 1,
        accountNo: accountNumber,
        description: `Lacag bixinta: ${boat.title}`,
        currency,
        totalAmount,
      };

      const response = await fetch(PAYMENT_ENDPOINTS.CREATE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentPayload),
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/Backoffice/boats"), 3000);
      } else {
        const result = await response.json();
        toast.error(result.message || "Lacag bixintu waa fashilantay");
      }
    } catch (error) {
      toast.error("Khalad ayaa ka dhacay xiriirka");
    } finally {
      setLoading(false);
    }
  };

  if (isAuthorizing)
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-10 h-10 text-indigo-600" />
        </motion.div>
        <p className="mt-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Hubinta amniga...
        </p>
      </div>
    );

  if (success)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="relative mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1.2 }}
            className="absolute inset-0 bg-green-100 rounded-full blur-xl"
          />
          <CheckCircle2
            size={100}
            className="text-green-500 relative z-10 animate-bounce"
          />
        </div>
        <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
          Lacag bixintu waa guul!
        </h1>
        <p className="text-slate-400 font-bold text-sm mt-4 uppercase tracking-widest italic">
          Waxaan kuu celinaynaa boggaaga...
        </p>
      </motion.div>
    );

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row font-sans">
      qwwqwqwqw
      <div className="lg:hidden sticky top-0 z-30 bg-slate-950 text-white p-5 border-b border-white/10 shadow-2xl">
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => setShowSummary(!showSummary)}
        >
          <div>
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
              Total
            </p>
            <p className="text-2xl font-black text-green-400 tabular-nums">
              {currency} {totalAmount.toFixed(2)}
            </p>
          </div>
          <button className="flex items-center gap-2 text-[10px] font-black uppercase bg-indigo-600 px-5 py-2.5 rounded-full">
            Details
            <motion.div animate={{ rotate: showSummary ? 180 : 0 }}>
              <ChevronDown size={14} />
            </motion.div>
          </button>
        </div>
        <AnimatePresence>
          {showSummary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-5 pt-5 border-t border-white/10 space-y-4"
            >
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-slate-400">Boat Fee</span>
                <span>
                  {currency} {boat?.fee?.totalAmount?.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-slate-400">Plan</span>
                <span className="text-indigo-400">
                  +{currency} {plan?.price?.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex-grow w-full p-6 sm:p-12 lg:p-24 flex flex-col justify-center bg-white">
        <div className="max-w-xl mx-auto w-full">
          <header className="mb-16">
            <motion.div
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
            >
              <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-4">
                Checkout
              </h1>
              <div className="h-2 w-24 bg-indigo-600 rounded-full mb-6" />
              <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
                Doorashada Habka Lacag Bixinta
              </p>
            </motion.div>
          </header>

          <div className="space-y-16">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-900">
                  <Smartphone size={20} strokeWidth={2.5} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs text-slate-500">
                  01. Select Operator
                </span>
              </div>
              <div className="grid grid-cols-2 gap-5">
                {PaymentMethods.map((method) => (
                  <motion.button
                    whileHover={{
                      y: -8,
                      shadow: "0 25px 50px -12px rgba(79, 70, 229, 0.2)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`py-12 px-4 rounded-[2.5rem] border-2 transition-all duration-300 relative ${
                      selectedMethod === method
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-2xl shadow-indigo-100"
                        : "border-slate-100 text-slate-400 bg-slate-50/50 hover:border-slate-300"
                    }`}
                  >
                    <span className="font-black text-base tracking-[0.15em] uppercase">
                      {method}
                    </span>
                    {selectedMethod === method && (
                      <motion.div
                        layoutId="active"
                        className="absolute top-4 right-6"
                      >
                        <CheckCircle2 size={20} />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-900">
                  <Lock size={20} strokeWidth={2.5} />
                </div>
                <span className="font-black uppercase tracking-widest text-xs text-slate-500">
                  02. Account Details
                </span>
              </div>
              <input
                type="tel"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="61XXXXXXX"
                className="w-full px-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-[2.5rem] focus:bg-white focus:border-indigo-600 outline-none transition-all font-black text-3xl sm:text-4xl tracking-tighter text-green-600 placeholder:text-slate-200"
              />
            </section>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handlePayment}
              disabled={loading || !selectedMethod || !accountNumber}
              className="w-full py-8 bg-slate-900 text-white rounded-[2.5rem] font-black text-xl shadow-2xl transition-all flex items-center justify-center gap-4 disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none"
            >
              {loading ? (
                <Loader2 className="animate-spin w-8 h-8" />
              ) : (
                <>
                  <span>Confirm Payment</span>
                  <CheckCircle2 size={26} />
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-3 text-slate-400 pb-10">
              <ShieldCheck size={18} className="text-green-500" />
              <span className="font-bold text-[10px] uppercase tracking-[0.3em]">
                Secure Encrypted Transaction
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden lg:flex w-[45%] bg-slate-950 text-white p-24 flex-col justify-between shrink-0 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full -mr-64 -mt-64" />

        <div className="relative z-10">
          <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-16 border border-white/10 backdrop-blur-sm">
            <CreditCard className="text-indigo-400" size={48} />
          </div>
          <h2 className="text-8xl font-black leading-none tracking-tighter uppercase mb-16">
            Order <br />
            <span className="text-indigo-500 italic">Summary</span>
          </h2>

          <div className="space-y-10 max-w-sm">
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                Product
              </span>
              <span className="font-black text-xl uppercase tracking-tighter">
                {boat?.title}
              </span>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                Base Fee
              </span>
              <span className="font-black text-xl tabular-nums">
                {currency} {boat?.fee?.totalAmount?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-slate-500 font-bold uppercase text-xs tracking-widest">
                Promotion
              </span>
              <span className="font-black text-xl text-indigo-400 tabular-nums">
                +{currency} {plan?.price?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-slate-500 font-black uppercase text-xs tracking-[0.4em] mb-4">
            Total Amount Due
          </p>
          <motion.div
            key={totalAmount}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex items-baseline gap-6"
          >
            <span className="text-9xl font-black tracking-tighter text-green-400 leading-none">
              {totalAmount.toFixed(2)}
            </span>
            <span className="text-3xl text-indigo-500 font-black">
              {currency}
            </span>
          </motion.div>

          <div className="mt-20 p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-md flex items-center gap-6">
            <div className="p-4 bg-green-500/10 rounded-2xl">
              <ShieldCheck className="text-green-400" size={28} />
            </div>
            <p className="text-xs leading-relaxed text-slate-400 font-bold uppercase tracking-widest">
              Xogtaada waa mid la dhowray. Lacag bixintu waxay u dhacaysaa si
              ammaan ah.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
