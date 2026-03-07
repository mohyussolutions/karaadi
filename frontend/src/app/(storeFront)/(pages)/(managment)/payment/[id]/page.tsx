"use client";

import React, { useState, useEffect } from "react";
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
  Loader2,
  ArrowLeft,
  Wallet,
  Smartphone,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import CheckoutSteps from "@/app/(storeFront)/components/checkout/page";
import CardPayment from "../paymentTypes/CardPayment";
import MobilePayment from "../paymentTypes/MobilePayment";

export default function PaymentPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  const boatId = params.id as string;
  const planId = searchParams.get("planId");
  const totalFromUrl = searchParams.get("total");

  const [paymentType, setPaymentType] = useState<"mobile" | "card">("mobile");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(true);

  const [boat, setBoat] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  const totalAmount = Number(totalFromUrl) || 0;
  const currency = "USD";

  const [mobilePaymentEnabled] = useState(true);
  const [cardPaymentEnabled] = useState(true);

  useEffect(() => {
    const validateAccess = async () => {
      try {
        const session = await verifySession();
        if (!session) return router.replace("/login");
        setUser(session);

        if (boatId) {
          const boatData = await getBoatById(boatId);
          if (!boatData) return router.replace("/boats");
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

  useEffect(() => {
    if (!mobilePaymentEnabled && cardPaymentEnabled) {
      setPaymentType("card");
    } else if (!cardPaymentEnabled && mobilePaymentEnabled) {
      setPaymentType("mobile");
    }
  }, [mobilePaymentEnabled, cardPaymentEnabled]);

  const handlePayment = async () => {
    if (!boat || !boatId) return toast.error("Xogta markabka waa la la'yahay");

    if (paymentType === "mobile") {
      if (!selectedMethod)
        return toast.error("Fadlan dooro habka lacag bixinta");
      if (!accountNumber || accountNumber.length < 7)
        return toast.error("Fadlan geli nambar akoon oo sax ah");
    } else {
      if (!cardNumber || cardNumber.length < 16)
        return toast.error("Fadlan geli lambarka kaarka");
      if (!cardName) return toast.error("Fadlan geli magaca kaarka");
      if (!cardExpiry || cardExpiry.length < 5)
        return toast.error("Fadlan geli taariikhda");
      if (!cardCvv || cardCvv.length < 3) return toast.error("Fadlan geli CVV");
    }

    setLoading(true);
    try {
      const paymentPayload = {
        userId: user?._id || user?.id,
        itemCategory: "BOAT",
        itemId: boatId,
        planId: planId,
        paymentType: paymentType,
        paymentMethod: paymentType === "mobile" ? selectedMethod : "Card",
        accountNo: paymentType === "mobile" ? accountNumber : cardNumber,
        cardDetails:
          paymentType === "card"
            ? {
                name: cardName,
                expiry: cardExpiry,
                cvv: cardCvv,
              }
            : undefined,
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
          setTimeout(() => router.push(`/boats/${boatId}`), 1500);
          return;
        }

        const updateResult = await updateBoatPayment(
          boatId,
          paymentId,
          planId || "",
        );

        if (updateResult.success) {
          setSuccess(true);
          setTimeout(() => router.push(`/boats/${boatId}`), 1500);
        } else {
          toast.warning("Payment recorded but boat update pending");
          setSuccess(true);
          setTimeout(() => router.push(`/boats/${boatId}`), 1500);
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
      <div className="w-full h-screen flex flex-col items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-16 h-16 text-indigo-600" />
        </motion.div>
        <p className="mt-8 text-sm font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
          Hubinta amniga...
        </p>
      </div>
    );

  if (success)
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full h-screen bg-green-50 flex flex-col items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <CheckCircle2 size={140} className="text-green-500 mb-8" />
        </motion.div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-6 text-center px-4">
          Lacag bixintu waa guul!
        </h1>
        <p className="text-slate-500 font-bold text-base uppercase tracking-widest">
          Waxaan kuu celinaynaa boggaaga...
        </p>
      </motion.div>
    );

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col lg:flex-row">
      <div className="flex-1 w-full bg-white p-4 sm:p-5 md:p-6 overflow-y-auto">
        <div className="w-full max-w-7xl mx-auto">
          <CheckoutSteps step1={true} step2={true} step3={true} step4={true} />

          <header className="mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter uppercase mb-1 leading-none">
              Payment
            </h1>
            <p className="text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.3em]">
              Complete Your Payment
            </p>
          </header>
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <div className="flex-1 space-y-5 md:space-y-6">
              <div className="border-2 border-slate-100 rounded-xl p-4 md:p-5">
                <section>
                  <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                    <div className="p-1.5 md:p-2 bg-indigo-50 rounded-lg">
                      <Wallet size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-black uppercase tracking-wider text-xs md:text-sm text-slate-700">
                        Select Payment Type
                      </h3>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <motion.button
                      whileHover={{ scale: mobilePaymentEnabled ? 1.02 : 1 }}
                      whileTap={{ scale: mobilePaymentEnabled ? 0.98 : 1 }}
                      onClick={() =>
                        mobilePaymentEnabled && setPaymentType("mobile")
                      }
                      className={`w-full py-3 md:py-4 px-2 rounded-lg md:rounded-xl border-2 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 ${
                        !mobilePaymentEnabled
                          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          : paymentType === "mobile"
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                            : "border-slate-200 text-slate-500 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"
                      }`}
                      disabled={!mobilePaymentEnabled}
                    >
                      <Smartphone size={16} />
                      <span>Mobile Money</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: cardPaymentEnabled ? 1.02 : 1 }}
                      whileTap={{ scale: cardPaymentEnabled ? 0.98 : 1 }}
                      onClick={() =>
                        cardPaymentEnabled && setPaymentType("card")
                      }
                      className={`w-full py-3 md:py-4 px-2 rounded-lg md:rounded-xl border-2 transition-all font-black uppercase tracking-widest text-[10px] md:text-xs flex items-center justify-center gap-2 ${
                        !cardPaymentEnabled
                          ? "border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed"
                          : paymentType === "card"
                            ? "border-indigo-600 bg-indigo-600 text-white shadow-md"
                            : "border-slate-200 text-slate-500 bg-white hover:border-indigo-200 hover:bg-indigo-50/50"
                      }`}
                      disabled={!cardPaymentEnabled}
                    >
                      <CreditCard size={16} />
                      <span>Card Payment</span>
                    </motion.button>
                  </div>
                </section>
              </div>

              {paymentType === "mobile" ? (
                <MobilePayment
                  selectedMethod={selectedMethod}
                  setSelectedMethod={setSelectedMethod}
                  accountNumber={accountNumber}
                  setAccountNumber={setAccountNumber}
                  disabled={!mobilePaymentEnabled}
                />
              ) : (
                <CardPayment
                  cardNumber={cardNumber}
                  setCardNumber={setCardNumber}
                  cardName={cardName}
                  setCardName={setCardName}
                  cardExpiry={cardExpiry}
                  setCardExpiry={setCardExpiry}
                  cardCvv={cardCvv}
                  setCardCvv={setCardCvv}
                  disabled={!cardPaymentEnabled}
                />
              )}

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handlePayment}
                disabled={
                  loading ||
                  (paymentType === "mobile"
                    ? !mobilePaymentEnabled
                    : !cardPaymentEnabled)
                }
                className="w-full py-3 md:py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg md:rounded-xl font-black text-sm md:text-base shadow-md transition-all disabled:from-slate-300 disabled:to-slate-300 disabled:text-slate-500 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2 hover:from-indigo-700 hover:to-indigo-800"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing...</span>
                  </>
                ) : (
                  "Confirm Payment"
                )}
              </motion.button>
            </div>

            <div className="lg:w-[280px] xl:w-[320px] bg-gradient-to-br from-slate-900 to-slate-800 text-white p-5 rounded-xl shadow-2xl h-fit lg:self-stretch border-2 border-indigo-500/20 flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-indigo-400" size={20} />
                  <h3 className="font-black uppercase tracking-widest text-sm text-slate-300">
                    ORDER SUMMARY
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-start gap-3 border-b border-white/10 pb-3">
                    <span className="text-slate-400 font-black uppercase text-xs tracking-wider">
                      PRODUCT
                    </span>
                    <span className="font-black text-xs text-right text-white max-w-[160px]">
                      {boat?.title || "Loading..."}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-black uppercase text-xs tracking-wider">
                      TOTAL
                    </span>
                    <span className="font-black text-green-400 text-xl">
                      {currency} {totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 flex items-start gap-2">
                <ShieldCheck
                  className="text-green-400 shrink-0 mt-0.5"
                  size={14}
                />
                <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400 leading-relaxed">
                  Secure Encrypted Transaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
