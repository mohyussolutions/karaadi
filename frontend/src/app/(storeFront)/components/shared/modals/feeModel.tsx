"use client";

import { FEE_CATEGORIES } from "@/app/(links)/dashboardLinks/FEE_CATEGORIES";
import React from "react";

interface FeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
}

const FeeModal = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  loading,
}: FeeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl p-8 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Update Prices</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {FEE_CATEGORIES.map((cat) => (
            <div key={cat.title} className="space-y-4">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-wider">
                {cat.title}
              </h3>
              {cat.fees.map((fee) => (
                <div key={fee.key}>
                  <label className="text-[10px] font-bold text-gray-400 uppercase">
                    {fee.label}
                  </label>
                  <input
                    type="number"
                    className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-1 focus:ring-indigo-500"
                    value={formData[fee.key] ?? 0}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [fee.key]: e.target.value,
                      })
                    }
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex gap-4 justify-end mt-10 border-t pt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 font-bold text-gray-400 hover:text-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="bg-indigo-600 text-white px-10 py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Saving..." : "Deploy Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeModal;
