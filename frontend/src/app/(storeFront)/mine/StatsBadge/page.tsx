"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  FiInbox,
  FiTrash2,
  FiCheckCircle,
  FiArrowRight,
} from "@/app/utils/icons";
import {
  FiMapPin,
  FiTag,
  FiDollarSign,
  FiEdit,
  FiPackage,
  FiInfo,
  FiPlus,
} from "react-icons/fi";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "@/context/AuthContext";
import Loading from "../../components/shared/Loading/Loading";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import {
  setActiveItem,
  removeItem,
  setPlan,
  setOwnerId,
  resetFlow,
} from "@/store/slices/reducers/listingDraftSlice";
import { getSubPlans } from "@/actions/categories/feeAction";
import { SUBSCRIPTION_PLANS } from "@/actions/common/FEE_CATEGORIES";

const HIDDEN_FIELDS = new Set([
  "images",
  "image",
  "id",
  "feeAmount",
  "_id",
  "createdAt",
  "updatedAt",
  "__v",
  "title",
  "price",
  "category",
  "subCategory",
  "city",
  "region",
  "description",
]);

function toLabel(key: string) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

export default function CartPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [processingCheckout, setProcessingCheckout] = useState(false);

  const allItems = useAppSelector((state) => state.listingDraft.items ?? []);
  const activeItem = useAppSelector((state) => state.listingDraft.item);
  const draftPlan = useAppSelector((state) => state.listingDraft.plan);
  const ownerId = useAppSelector((state) => state.listingDraft.ownerId);

  const hasPlan = draftPlan !== null;
  const hasActive = activeItem && Object.keys(activeItem).length > 0;

  const [unauthorized, setUnauthorized] = useState(false);
  useEffect(() => {
    if (user === undefined) return;
    if (!user) {
      router.push("/login");
      return;
    }
    const currentUserId = user._id || user.id;
    if (ownerId && ownerId !== currentUserId) {
      setUnauthorized(true);
      return;
    } else if (!ownerId && currentUserId) {
      dispatch(setOwnerId(currentUserId));
    }
    setLoading(false);
  }, [user, ownerId, dispatch, router]);

  const handleSelectItem = (item: any) => dispatch(setActiveItem(item));

  const handleDeleteItem = (id: string) => {
    dispatch(removeItem(id));
    toast.success(t("cart.itemDeleted", "Item removed"));
  };

  const handleDeletePlan = () => {
    dispatch(setPlan(null as any));
    toast.success(t("cart.planRemoved", "Plan removed"));
  };

  const handleGoToPlan = async () => {
    if (!hasActive) {
      toast.error(t("cart.noItem", "Select an item first"));
      return;
    }
    setProcessingCheckout(true);
    try {
      const plansRes = await getSubPlans();
      if (plansRes && Array.isArray(plansRes) && !hasPlan) {
        const config = plansRes[0];
        const defaultPlan = SUBSCRIPTION_PLANS[0];
        if (defaultPlan && config) {
          dispatch(
            setPlan({
              ...defaultPlan,
              id: defaultPlan.key,
              price: Number(config[defaultPlan.key]) || 0,
            }),
          );
        }
      }
      router.push("/plan");
    } catch {
      toast.error(t("cart.planError", "Failed to load plans"));
    } finally {
      setProcessingCheckout(false);
    }
  };

  const handleGoToPayment = () => {
    if (!hasActive) {
      toast.error(t("cart.noItem", "Select an item first"));
      return;
    }
    if (!hasPlan) {
      toast.error(t("cart.noPlan", "Please select a plan first"));
      return;
    }
    router.push("/payment");
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (unauthorized) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="text-4xl mb-4 text-red-500">⛔</div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-4">
          You are not authorized to view these items.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
        >
          Go Home
        </button>
      </div>
    );
  }

  if (allItems.length === 0) {
    return (
      <div className="mt-8 max-w-lg mx-auto px-6 py-20 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
        <ToastContainer position="top-center" theme="colored" />
        <div className="inline-flex p-5 bg-gray-50 rounded-2xl mb-5 text-gray-300">
          <FiInbox size={44} />
        </div>
        <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">
          {t("cart.empty", "Your Cart is Empty")}
        </h3>
        <p className="text-gray-400 mt-2 text-sm font-medium">
          {t("cart.emptyDesc", "Create an ad to get started")}
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-8 px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-100"
        >
          {t("cart.browse", "Browse Listings")}
        </button>
      </div>
    );
  }

  const activeId = activeItem?.id;
  const itemFee = Number(activeItem?.feeAmount || 0);
  const planPrice = Number(draftPlan?.price || 0);
  const totalFee = itemFee + planPrice;

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto px-4 pb-16 space-y-5">
      <ToastContainer position="top-center" theme="colored" />

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl px-6 py-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shadow-xl shadow-blue-100">
        <div>
          <p className="text-xs font-black uppercase tracking-widest opacity-70">
            {t("cart.draftBadge", "Pending Listings")}
          </p>
          <h1 className="text-xl font-black mt-0.5">
            {allItems.length} {allItems.length === 1 ? "Item" : "Items"} in Cart
          </h1>
        </div>
        <div className="flex items-center gap-6">
          {hasActive && (
            <div className="text-center">
              <div className="text-2xl font-black">
                ${totalFee.toLocaleString()}
              </div>
              <div className="text-[10px] font-black uppercase opacity-70">
                Selected Total
              </div>
            </div>
          )}
          {hasPlan && (
            <div className="text-center">
              <div className="text-sm font-black flex items-center gap-1">
                <FiCheckCircle size={14} /> {draftPlan.label}
              </div>
              <div className="text-[10px] font-black uppercase opacity-70">
                Plan
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-black text-gray-700 uppercase text-xs tracking-widest flex items-center gap-1.5">
            <FiPackage size={13} /> {t("cart.yourItems", "Your Items")}
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition"
          >
            <FiPlus size={13} /> Add Another
          </button>
        </div>

        <div className="p-3 space-y-2">
          {allItems.map((item) => {
            const isActive = item.id === activeId;
            const thumb = item.images?.[0] || (item as any).image || null;
            const itemPrice = Number(item.price || 0);
            const extraFields = Object.entries(item).filter(
              ([k, v]) =>
                !HIDDEN_FIELDS.has(k) &&
                v !== null &&
                v !== undefined &&
                v !== "" &&
                !Array.isArray(v),
            );

            return (
              <div
                key={item.id}
                onClick={() => handleSelectItem(item)}
                className={`rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                  isActive
                    ? "border-blue-500 ring-2 ring-blue-100 bg-blue-50/40 shadow-sm"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
              >
                <div className="flex items-start gap-3 p-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 shadow-sm">
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.title || ""}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <FiInbox size={20} />
                      </div>
                    )}
                    {Array.isArray(item.images) && item.images.length > 1 && (
                      <span className="absolute bottom-0 right-0 bg-black/60 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-tl-lg">
                        +{item.images.length - 1}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-black text-sm text-gray-900 truncate leading-tight">
                          {item.title || "Untitled"}
                        </h3>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                          {(item.category || item.subCategory) && (
                            <span className="text-xs text-blue-600 font-bold flex items-center gap-1">
                              <FiTag size={9} />
                              {Array.isArray(item.category)
                                ? item.category[0]
                                : item.category}
                              {item.subCategory && ` › ${item.subCategory}`}
                            </span>
                          )}
                          {(item.city || item.region) && (
                            <span className="text-xs text-gray-400 font-medium flex items-center gap-1">
                              <FiMapPin size={9} />
                              {[item.city, item.region]
                                .filter(Boolean)
                                .join(", ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex flex-col items-end gap-1.5">
                        <p className="font-black text-blue-600 text-sm leading-none">
                          ${itemPrice.toLocaleString()}
                        </p>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                            isActive
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300 bg-white"
                          }`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectItem(item);
                          }}
                        >
                          {isActive && (
                            <HiOutlineCheckCircle
                              className="text-white"
                              size={13}
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-xs text-gray-400 line-clamp-1 mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                {isActive && (
                  <div className="px-3 pb-3 pt-2 border-t border-blue-100 space-y-2">
                    {extraFields.length > 0 && (
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-1.5 flex items-center gap-1">
                          <FiInfo size={9} /> Details
                        </p>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1">
                          {extraFields.map(([key, value]) => (
                            <div
                              key={key}
                              className="flex items-baseline gap-1"
                            >
                              <span className="text-[10px] font-black uppercase text-gray-400 whitespace-nowrap">
                                {toLabel(key)}:
                              </span>
                              <span className="text-[11px] text-gray-700 font-medium truncate">
                                {String(value)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {Array.isArray(item.images) && item.images.length > 0 && (
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {item.images.map((src, idx) => (
                          <img
                            key={idx}
                            src={src}
                            alt=""
                            className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-blue-100"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between px-3 py-2 border-t border-gray-100 bg-gray-50/50 rounded-b-xl">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide flex items-center gap-1">
                    <FiDollarSign size={9} /> Fee: ${item.feeAmount || 0}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteItem(item.id);
                    }}
                    className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 transition"
                  >
                    <FiTrash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 bg-gray-50">
          <h2 className="font-black text-gray-700 uppercase text-xs tracking-widest">
            {t("cart.yourPlan", "Visibility Plan")}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleGoToPlan}
              disabled={processingCheckout}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 transition"
            >
              <FiEdit size={13} />
              {hasPlan
                ? t("cart.change", "Change")
                : t("cart.select", "Select")}
            </button>
            {hasPlan && (
              <button
                onClick={handleDeletePlan}
                className="text-xs text-red-400 hover:text-red-600 font-bold flex items-center gap-1 transition"
              >
                <FiTrash2 size={13} /> {t("cart.remove", "Remove")}
              </button>
            )}
          </div>
        </div>
        <div className="p-4">
          {hasPlan ? (
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center">
                  <FiCheckCircle className="text-green-600" size={18} />
                </div>
                <div>
                  <p className="font-black text-gray-900 text-sm">
                    {draftPlan.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {draftPlan.days} days active listing
                  </p>
                </div>
              </div>
              <p className="font-black text-green-600 text-lg">${planPrice}</p>
            </div>
          ) : (
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-sm text-gray-600 mb-3 font-medium">
                {t("cart.noPlanSelected", "No visibility plan selected yet")}
              </p>
              <button
                onClick={handleGoToPlan}
                className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition"
              >
                {t("cart.selectPlanNow", "Select a Plan →")}
              </button>
            </div>
          )}
        </div>
      </div>

      {hasActive && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 bg-gray-50">
            <h2 className="font-black text-gray-700 uppercase text-xs tracking-widest">
              {t("cart.summary", "Order Summary")}
            </h2>
          </div>
          <div className="px-5 py-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">Selected Item</span>
              <span className="font-bold text-gray-800 truncate max-w-[160px] text-right">
                {activeItem.title || "Untitled"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                {t("cart.listingFee", "Listing Fee")}
              </span>
              <span className="font-bold text-gray-800">
                ${itemFee.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                {t("cart.planPrice", "Plan Price")}
              </span>
              <span className="font-bold text-gray-800">
                {hasPlan ? `$${planPrice.toLocaleString()}` : "—"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-black text-base">
              <span className="text-gray-900">
                {t("cart.totalFee", "Total Due")}
              </span>
              <span className="text-blue-600 text-xl">
                ${totalFee.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="px-5 pb-5 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleGoToPlan}
              disabled={processingCheckout}
              className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition disabled:opacity-50 text-sm"
            >
              {hasPlan
                ? t("cart.changePlan", "Change Plan")
                : t("cart.selectPlan", "Select Plan")}
            </button>
            <button
              onClick={handleGoToPayment}
              disabled={!hasPlan || processingCheckout}
              className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-100"
            >
              {!hasPlan
                ? t("cart.selectPlanFirst", "Select Plan First")
                : t("cart.goToPayment", "Proceed to Payment")}
              <FiArrowRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
