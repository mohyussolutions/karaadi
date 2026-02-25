"use client";

import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import FeeLoading from "./FeeLoading";
import {
  getMarketplaceFees,
  createMarketplaceFee,
  updateMarketplaceFee,
  getRealEstateFees,
  createRealEstateFee,
  updateRealEstateFee,
  getCarFees,
  createCarFee,
  updateCarFee,
  getMotorcycleFees,
  createMotorcycleFee,
  updateMotorcycleFee,
  getBoatFees,
  createBoatFee,
  updateBoatFee,
  getEquipmentFees,
  createEquipmentFee,
  updateEquipmentFee,
  getSubPlans,
  createSubPlan,
  updateSubPlan,
  getSystemConfig,
  createSystemConfig,
  updateSystemConfig,
} from "@/actions/categories/feeAction";
import { FEE_CATEGORIES } from "@/actions/common/FEE_CATEGORIES";
import FeeModal from "@/app/(storeFront)/components/shared/modals/feeModel";

interface FeeIds {
  m: string;
  r: string;
  c: string;
  mc: string;
  b: string;
  e: string;
  s: string;
  sys: string;
}

interface FieldMappings {
  marketplace: string[];
  realEstate: string[];
  cars: string[];
  motorcycles: string[];
  boats: string[];
  equipment: string[];
  subPlans: string[];
  system: string[];
}

const fieldMappings: FieldMappings = {
  marketplace: [
    "art",
    "electronics",
    "animal",
    "sports",
    "furniture",
    "fashion",
  ],
  realEstate: ["rent", "sale", "land", "farm", "business"],
  cars: ["carSale", "carRent", "trailer", "carParts", "truck", "electricCar"],
  motorcycles: ["motoSale", "motoRent", "motoParts"],
  boats: ["boatSale", "boatRent", "boatEngine", "boatParts"],
  equipment: [
    "tractorSale",
    "agriTool",
    "harvester",
    "fullTime",
    "partTime",
    "freelance",
  ],
  subPlans: ["subStandard", "subStandard60", "subPremium"],
  system: ["taxRate", "platformFee", "waafiFee", "currency"],
};

const FeeManagement = () => {
  const [data, setData] = useState<any>({});
  const [ids, setIds] = useState<FeeIds>({
    m: "",
    r: "",
    c: "",
    mc: "",
    b: "",
    e: "",
    s: "",
    sys: "",
  });
  const [loading, setLoading] = useState({ fetch: true, action: false });
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const getLatestConfig = (data: any[] | any) => {
    if (Array.isArray(data)) {
      const active = data.find((item) => item.isActive !== false);
      return active || data[0] || {};
    }
    return data || {};
  };

  const fetchData = async () => {
    setLoading((p) => ({ ...p, fetch: true }));
    try {
      const [
        marketplace,
        realEstate,
        cars,
        motorcycles,
        boats,
        equipment,
        subPlans,
        system,
      ] = await Promise.all([
        getMarketplaceFees(),
        getRealEstateFees(),
        getCarFees(),
        getMotorcycleFees(),
        getBoatFees(),
        getEquipmentFees(),
        getSubPlans(),
        getSystemConfig(),
      ]);

      const marketplaceConfig = getLatestConfig(marketplace);
      const realEstateConfig = getLatestConfig(realEstate);
      const carsConfig = getLatestConfig(cars);
      const motorcyclesConfig = getLatestConfig(motorcycles);
      const boatsConfig = getLatestConfig(boats);
      const equipmentConfig = getLatestConfig(equipment);
      const subPlansConfig = getLatestConfig(subPlans);
      const systemConfig = getLatestConfig(system);

      setIds({
        m: marketplaceConfig?.id || marketplaceConfig?._id || "",
        r: realEstateConfig?.id || realEstateConfig?._id || "",
        c: carsConfig?.id || carsConfig?._id || "",
        mc: motorcyclesConfig?.id || motorcyclesConfig?._id || "",
        b: boatsConfig?.id || boatsConfig?._id || "",
        e: equipmentConfig?.id || equipmentConfig?._id || "",
        s: subPlansConfig?.id || subPlansConfig?._id || "",
        sys: systemConfig?.id || systemConfig?._id || "",
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
      };

      setData(combined);
      setFormData(combined);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch fee data");
    } finally {
      setLoading((p) => ({ ...p, fetch: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const createTypePayload = (fields: string[], rawPayload: any) => {
    const payload: any = {};
    fields.forEach((field) => {
      if (field === "isActive") {
        payload[field] =
          typeof rawPayload[field] === "boolean" ? rawPayload[field] : true;
      } else if (field in rawPayload) {
        const val = rawPayload[field];
        payload[field] =
          val === "" || val === null || val === undefined ? 0 : parseFloat(val);
      }
    });
    return payload;
  };

  const handleGlobalSave = async () => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      const { _id, id, createdAt, updatedAt, __v, ...rawPayload } = formData;

      const marketplacePayload = createTypePayload(
        fieldMappings.marketplace,
        rawPayload,
      );
      const realEstatePayload = createTypePayload(
        fieldMappings.realEstate,
        rawPayload,
      );
      const carsPayload = createTypePayload(fieldMappings.cars, rawPayload);
      const motorcyclesPayload = createTypePayload(
        fieldMappings.motorcycles,
        rawPayload,
      );
      const boatsPayload = createTypePayload(fieldMappings.boats, rawPayload);
      const equipmentPayload = createTypePayload(
        fieldMappings.equipment,
        rawPayload,
      );
      const subPlansPayload = createTypePayload(
        fieldMappings.subPlans,
        rawPayload,
      );
      const systemPayload = createTypePayload(fieldMappings.system, rawPayload);

      const operations = [];

      if (Object.keys(marketplacePayload).length > 0) {
        operations.push(
          ids.m
            ? updateMarketplaceFee(ids.m, marketplacePayload)
            : createMarketplaceFee(marketplacePayload),
        );
      }

      if (Object.keys(realEstatePayload).length > 0) {
        operations.push(
          ids.r
            ? updateRealEstateFee(ids.r, realEstatePayload)
            : createRealEstateFee(realEstatePayload),
        );
      }

      if (Object.keys(carsPayload).length > 0) {
        operations.push(
          ids.c ? updateCarFee(ids.c, carsPayload) : createCarFee(carsPayload),
        );
      }

      if (Object.keys(motorcyclesPayload).length > 0) {
        operations.push(
          ids.mc
            ? updateMotorcycleFee(ids.mc, motorcyclesPayload)
            : createMotorcycleFee(motorcyclesPayload),
        );
      }

      if (Object.keys(boatsPayload).length > 0) {
        operations.push(
          ids.b
            ? updateBoatFee(ids.b, boatsPayload)
            : createBoatFee(boatsPayload),
        );
      }

      if (Object.keys(equipmentPayload).length > 0) {
        operations.push(
          ids.e
            ? updateEquipmentFee(ids.e, equipmentPayload)
            : createEquipmentFee(equipmentPayload),
        );
      }

      if (Object.keys(subPlansPayload).length > 0) {
        operations.push(
          ids.s
            ? updateSubPlan(ids.s, subPlansPayload)
            : createSubPlan(subPlansPayload),
        );
      }

      if (Object.keys(systemPayload).length > 0) {
        operations.push(
          ids.sys
            ? updateSystemConfig(ids.sys, systemPayload)
            : createSystemConfig(systemPayload),
        );
      }

      if (operations.length > 0) {
        await Promise.all(operations);
        toast.success("Fees updated successfully!");
      } else {
        toast.info("No changes to save");
      }

      setIsOpen(false);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Error deploying configuration.");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  if (loading.fetch) {
    return (
      <div className="flex justify-center py-32">
        <FeeLoading />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Fee Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Setting <span className="font-bold">0</span> marks as{" "}
            <span className="text-emerald-600 font-bold">FREE</span>.
          </p>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
        >
          Update All Prices
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEE_CATEGORIES.map((cat) => (
          <section
            key={cat.title}
            className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group"
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
                const val = parseFloat(data[fee.key] || 0);
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
