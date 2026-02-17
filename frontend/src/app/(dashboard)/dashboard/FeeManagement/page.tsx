"use client";

import React, { useState, useEffect } from "react";
import {
  getActiveFee,
  getAllFees,
  createFee,
} from "@/actions/categories/feeAction";
import { FEE_CATEGORIES } from "../../../../actions/common/FEE_CATEGORIES";
import FeeModal from "@/app/(storeFront)/components/shared/modals/feeModel";
import FeeLoading from "./FeeLoading";

const FeeManagement = () => {
  const [activeFees, setActiveFees] = useState<any>(null);
  const [allFees, setAllFees] = useState<any[]>([]);
  const [loading, setLoading] = useState({ active: true, action: false });
  const [showNewFeeForm, setShowNewFeeForm] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const fetchData = async () => {
    setLoading((p) => ({ ...p, active: true }));
    try {
      const [active, history] = await Promise.all([
        getActiveFee(),
        getAllFees(),
      ]);
      setActiveFees(active);
      setAllFees(history);
      if (active) setFormData(active);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading((p) => ({ ...p, active: false }));
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async () => {
    setLoading((p) => ({ ...p, action: true }));
    try {
      const {
        _id,
        id,
        createdAt,
        updatedAt,
        isActive,
        createdBy,
        updatedBy,
        feeChangeLogs,
        ...rawPayload
      } = formData;

      const payload: any = {
        adminId: "system-admin",
        currency: rawPayload.currency || "USD",
      };

      Object.keys(rawPayload).forEach((key) => {
        if (key !== "currency") {
          const val = rawPayload[key];
          payload[key] =
            val === "" || val === null || val === undefined
              ? 0
              : parseFloat(val);
        }
      });

      await createFee(payload);
      setShowNewFeeForm(false);
      await fetchData();
    } catch (err) {
      alert("Error deploying fees.");
    } finally {
      setLoading((p) => ({ ...p, action: false }));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Fee Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Setting a value to{" "}
            <span className="font-bold text-gray-700">0</span> marks it as{" "}
            <span className="text-emerald-600 font-bold">FREE</span>.
          </p>
        </div>
        <button
          onClick={() => setShowNewFeeForm(true)}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all active:scale-95"
        >
          New Configuration
        </button>
      </header>

      <FeeModal
        isOpen={showNewFeeForm}
        onClose={() => setShowNewFeeForm(false)}
        onSave={handleCreate}
        formData={formData}
        setFormData={setFormData}
        loading={loading.action}
      />

      {loading.active ? (
        <div className="flex justify-center items-center py-32">
          <FeeLoading />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEE_CATEGORIES.map((cat) => (
            <section
              key={cat.title}
              className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-xs font-black text-gray-400 uppercase mb-4 tracking-widest">
                {cat.title}
              </h3>
              <div className="space-y-3">
                {cat.fees.map((fee) => {
                  const val = activeFees
                    ? parseFloat(activeFees[fee.key] || 0)
                    : 0;
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
      )}
    </div>
  );
};

export default FeeManagement;
