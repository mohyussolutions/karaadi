"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

import {
  getAllFees,
  createMarketplaceFee,
  updateMarketplaceFee,
  createRealEstateFee,
  updateRealEstateFee,
  createCarFee,
  updateCarFee,
  createMotorcycleFee,
  updateMotorcycleFee,
  createBoatFee,
  updateBoatFee,
  createEquipmentFee,
  updateEquipmentFee,
  createSubPlan,
  updateSubPlan,
  createSystemConfig,
  updateSystemConfig,
  createBusinessPlanFees,
  updateBusinessPlanFees,
} from "@/actions/categories/feeAction";
import { FEE_CATEGORIES } from "@/actions/common/FEE_CATEGORIES";

import FeeModal from "@/app/(storeFront)/components/shared/modals/feeModel";
import Loading from "@/app/ui/loading/Loading";
import { fieldMappings, FeeIds } from "../feeTypes";

const FeeManagement = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<Record<string, unknown>>({});
  const [ids, setIds] = useState<FeeIds>({
    m: "",
    r: "",
    c: "",
    mc: "",
    b: "",
    e: "",
    s: "",
    sys: "",
    bp: "",
  });
  const [loading, setLoading] = useState({ fetch: true, action: false });
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const getLatestConfig = (data: unknown): Record<string, unknown> => {
    if (Array.isArray(data)) {
      const arr = data as Record<string, unknown>[];
      const active = arr.find((item: Record<string, unknown>) =>
        item && typeof item === "object" && "isActive" in item
          ? (item as Record<string, unknown>).isActive !== false
          : false,
      );
      return (active as Record<string, unknown>) || arr[0] || {};
    }
    return (data as Record<string, unknown>) || {};
  };

  const fetchData = React.useCallback(async () => {
    setLoading((p) => ({ ...p, fetch: true }));
    const {
      marketplace,
      realEstate,
      cars,
      motorcycles,
      boats,
      equipment,
      subPlans,
      system,
      businessPlans,
    } = await getAllFees();

    const marketplaceConfig = getLatestConfig(marketplace);
    const realEstateConfig = getLatestConfig(realEstate);
    const carsConfig = getLatestConfig(cars);
    const motorcyclesConfig = getLatestConfig(motorcycles);
    const boatsConfig = getLatestConfig(boats);
    const equipmentConfig = getLatestConfig(equipment);
    const subPlansConfig = getLatestConfig(subPlans);
    const systemConfig = getLatestConfig(system);
    const businessPlansConfig = getLatestConfig(businessPlans);

    setIds({
      m: String(marketplaceConfig?.id ?? marketplaceConfig?._id ?? ""),
      r: String(realEstateConfig?.id ?? realEstateConfig?._id ?? ""),
      c: String(carsConfig?.id ?? carsConfig?._id ?? ""),
      mc: String(motorcyclesConfig?.id ?? motorcyclesConfig?._id ?? ""),
      b: String(boatsConfig?.id ?? boatsConfig?._id ?? ""),
      e: String(equipmentConfig?.id ?? equipmentConfig?._id ?? ""),
      s: String(subPlansConfig?.id ?? subPlansConfig?._id ?? ""),
      sys: String(systemConfig?.id ?? systemConfig?._id ?? ""),
      bp: String(businessPlansConfig?.id ?? businessPlansConfig?._id ?? ""),
    });

    const combined = {
      ...marketplaceConfig,
      ...realEstateConfig,
      ...carsConfig,
      ...motorcyclesConfig,
      ...boatsConfig,
      ...equipmentConfig,
      ...subPlansConfig,
      ...systemConfig,
      ...businessPlansConfig,
    };

    setData(combined);
    setFormData(combined);
    setLoading((p) => ({ ...p, fetch: false }));
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createTypePayload = (
    fields: string[],
    rawPayload: Record<string, unknown>,
  ): Record<string, number | boolean> => {
    const payload: Record<string, number | boolean> = {};
    fields.forEach((field) => {
      if (field === "isActive") {
        const v = rawPayload[field];
        payload[field] = typeof v === "boolean" ? v : true;
      } else if (field in rawPayload) {
        const val = rawPayload[field];
        if (val === "" || val === null || val === undefined) {
          payload[field] = 0;
        } else {
          payload[field] = Number(String(val)) || 0;
        }
      }
    });
    return payload;
  };

  const handleGlobalSave = async () => {
    setLoading((p) => ({ ...p, action: true }));
    const rawPayload = { ...(formData || {}) } as Record<string, unknown>;
    ["_id", "id", "createdAt", "updatedAt", "__v"].forEach(
      (k) => delete rawPayload[k],
    );

    const marketplacePayload = createTypePayload(fieldMappings.marketplace, rawPayload);
    const realEstatePayload = createTypePayload(fieldMappings.realEstate, rawPayload);
    const carsPayload = createTypePayload(fieldMappings.cars, rawPayload);
    const motorcyclesPayload = createTypePayload(fieldMappings.motorcycles, rawPayload);
    const boatsPayload = createTypePayload(fieldMappings.boats, rawPayload);
    const equipmentPayload = createTypePayload(fieldMappings.equipment, rawPayload);
    const subPlansPayload = createTypePayload(fieldMappings.subPlans, rawPayload);
    const systemPayload = createTypePayload(fieldMappings.system, rawPayload);
    const businessPlansPayload = createTypePayload(fieldMappings.businessPlans, rawPayload);

    const operations = [];

    if (Object.keys(marketplacePayload).length > 0)
      operations.push(ids.m ? updateMarketplaceFee(ids.m, marketplacePayload) : createMarketplaceFee(marketplacePayload));

    if (Object.keys(realEstatePayload).length > 0)
      operations.push(ids.r ? updateRealEstateFee(ids.r, realEstatePayload) : createRealEstateFee(realEstatePayload));

    if (Object.keys(carsPayload).length > 0)
      operations.push(ids.c ? updateCarFee(ids.c, carsPayload) : createCarFee(carsPayload));

    if (Object.keys(motorcyclesPayload).length > 0)
      operations.push(ids.mc ? updateMotorcycleFee(ids.mc, motorcyclesPayload) : createMotorcycleFee(motorcyclesPayload));

    if (Object.keys(boatsPayload).length > 0)
      operations.push(ids.b ? updateBoatFee(ids.b, boatsPayload) : createBoatFee(boatsPayload));

    if (Object.keys(equipmentPayload).length > 0)
      operations.push(ids.e ? updateEquipmentFee(ids.e, equipmentPayload) : createEquipmentFee(equipmentPayload));

    if (Object.keys(subPlansPayload).length > 0)
      operations.push(ids.s ? updateSubPlan(ids.s, subPlansPayload) : createSubPlan(subPlansPayload));

    if (Object.keys(systemPayload).length > 0)
      operations.push(ids.sys ? updateSystemConfig(ids.sys, systemPayload) : createSystemConfig(systemPayload));

    if (Object.keys(businessPlansPayload).length > 0)
      operations.push(ids.bp ? updateBusinessPlanFees(ids.bp, businessPlansPayload) : createBusinessPlanFees(businessPlansPayload));

    if (operations.length > 0) {
      await Promise.all(operations);
      toast.success("Fees updated successfully!");
    } else {
      toast.info("No changes to save");
    }

    setIsOpen(false);
    setLoading((p) => ({ ...p, action: false }));
    await fetchData();
  };

  if (loading.fetch) {
    return (
      <div className="flex justify-center py-32">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 bg-gray-50 min-h-screen">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6 sm:mb-8 lg:mb-10">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {t("adminTable.feeDashboard", "Fee Dashboard")}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Setting <span className="font-bold">0</span> marks as{" "}
            <span className="text-emerald-600 font-bold">FREE</span>.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className={`w-full sm:w-auto bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm sm:text-base ${loading.action ? "opacity-60 cursor-not-allowed" : ""}`}
          disabled={loading.action}
        >
          {loading.action ? t("adminTable.loading") : t("adminTable.updateAllPrices", "Update All Prices")}
        </button>
      </header>

      <FeeModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSave={handleGlobalSave}
        formData={formData}
        setFormData={setFormData}
        loading={loading.action}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {FEE_CATEGORIES.map((cat, idx) => (
          <section
            key={cat.title || idx}
            className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 lg:p-6 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                {cat.title}
              </h3>
              <button
                onClick={() => setIsOpen(true)}
                className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                EDIT
              </button>
            </div>
            <div className="space-y-3">
              {cat.fees.map((fee) => {
                const rawValue = data[fee.key];
                const val = parseFloat(String(rawValue ?? 0)) || 0;
                return (
                  <div
                    key={fee.key}
                    className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0"
                  >
                    <span className="text-sm text-gray-600 font-medium">
                      {fee.label}
                    </span>
                    {val <= 0 ? (
                      <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        FREE
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-gray-900 bg-gray-50 px-2 py-1 rounded-md">
                        ${val.toFixed(2)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default FeeManagement;
