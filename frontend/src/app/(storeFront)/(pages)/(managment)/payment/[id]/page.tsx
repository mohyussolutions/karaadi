"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PAYMENT_ENDPOINTS } from "@/actions/constant/constant";
import { verifySession } from "@/actions/core/authAction";
import {
  getBoatById,
  updateBoatPayment,
} from "@/actions/categories/boatActions";
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

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const boatId = params.id as string;
  const planId = searchParams.get("planId");
  const totalFromUrl = searchParams.get("total");

  const [selectedMethod, setSelectedMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const [boat, setBoat] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const totalAmount = useMemo(() => Number(totalFromUrl) || 0, [totalFromUrl]);
  const currency = "USD";

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const session = await verifySession();
        if (!session) return router.replace("/login");
        setUser(session);

        if (boatId) {
          const boatData = await getBoatById(boatId);
          if (!boatData) return router.replace("/Backoffice/boats");
          setBoat(boatData);
        }
      } catch (error) {
        router.replace("/login");
      } finally {
        setIsAuthorizing(false);
      }
    };
    validateAccess();
  }, [boatId, router]);

  const handlePayment = async () => {
    if (!boat || !boatId) return toast.error("Xogta markabka waa la la'yahay");
    if (!selectedMethod) return toast.error("Fadlan dooro habka lacag bixinta");
    if (!accountNumber || accountNumber.length < 7)
      return toast.error("Fadlan geli nambar akoon oo sax ah");

    setLoading(true);
    try {
      const paymentPayload = {
        userId: user?._id || user?.id,
        itemCategory: "BOAT",
        itemId: boatId,
        planId: planId,
        paymentMethod: selectedMethod,
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

      const result = await response.json();

      if (response.ok) {
        toast.success("Payment processed successfully!");

        const paymentId = result.id || result.transactionId;

        if (!paymentId) {
          toast.error("Payment completed but couldn't get payment ID");
          setSuccess(true);
          setTimeout(() => router.push(`/boats/${boatId}`), 3000);
          return;
        }

        const updateResult = await updateBoatPayment(
          boatId,
          paymentId,
          planId || "",
        );

        if (updateResult.success) {
          setSuccess(true);
          setTimeout(() => router.push(`/boats/${boatId}`), 3000);
        } else {
          toast.warning("Payment recorded but boat update pending");
          setSuccess(true);
          setTimeout(() => router.push(`/boats/${boatId}`), 3000);
        }
      } else {
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
        <CheckCircle2
          size={100}
          className="text-green-500 mb-6 animate-bounce"
        />
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
              className="overflow-hidden mt-5 pt-5 border-t border-white/10"
            >
              <div className="flex justify-between text-xs font-bold uppercase">
                <span className="text-slate-400">Total Due</span>
                <span>
                  {currency} {totalAmount.toFixed(2)}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex-grow w-full p-6 sm:p-12 lg:p-24 flex flex-col justify-center bg-white">
        <div className="max-w-xl mx-auto w-full">
          <header className="mb-12">
            <h1 className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tighter uppercase mb-4">
              Checkout
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
              Habka Lacag Bixinta
            </p>
          </header>

          <div className="space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Smartphone size={20} className="text-slate-400" />
                <span className="font-black uppercase tracking-widest text-xs text-slate-500">
                  01. Select Operator
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {PaymentMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => setSelectedMethod(method)}
                    className={`py-8 px-4 rounded-3xl border-2 transition-all font-black uppercase tracking-widest text-sm ${
                      selectedMethod === method
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xl"
                        : "border-slate-100 text-slate-400 bg-slate-50 hover:border-slate-300"
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <div className="flex items-center gap-3 mb-6">
                <Lock size={20} className="text-slate-400" />
                <span className="font-black uppercase tracking-widest text-xs text-slate-500">
                  02. Account Details
                </span>
              </div>
              <input
                type="tel"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                placeholder="61XXXXXXX"
                className="w-full px-8 py-6 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:border-indigo-600 outline-none transition-all font-black text-3xl text-green-600"
              />
            </section>

            <button
              onClick={handlePayment}
              disabled={loading || !selectedMethod || !accountNumber}
              className="w-full py-6 bg-slate-900 text-white rounded-3xl font-black text-xl shadow-2xl transition-all disabled:bg-slate-100 disabled:text-slate-300 flex items-center justify-center gap-3"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Confirm Payment"
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden lg:flex w-[40%] bg-slate-950 text-white p-16 flex-col justify-between shrink-0">
        <div>
          <CreditCard className="text-indigo-400 mb-10" size={40} />
          <h2 className="text-6xl font-black tracking-tighter uppercase mb-12 leading-none">
            Order <br /> <span className="text-indigo-500">Summary</span>
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between">
              <span className="text-slate-500 font-bold uppercase text-xs">
                Product
              </span>
              <span className="font-black uppercase">
                {boat?.title || "Loading..."}
              </span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex justify-between text-2xl">
              <span className="text-slate-500 font-bold uppercase text-xs self-center">
                Total
              </span>
              <span className="font-black text-green-400">
                {currency} {totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-center gap-4">
          <ShieldCheck className="text-green-400 shrink-0" size={24} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Secure Encrypted Transaction. Lacag bixintu waxay u dhacaysaa si
            ammaan ah.
          </p>
        </div>
      </div>
    </div>
  );
}
