"use client";

import { FEE_CATEGORIES } from "@/actions/common/FEE_CATEGORIES";
import React from "react";

interface FeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => Promise<void>;
  formData: any;
  setFormData: (data: any) => void;
  loading: boolean;
  response?: string;
}

const FeeModal = ({
  isOpen,
  onClose,
  onSave,
  formData,
  setFormData,
  loading,
  response,
}: FeeModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 md:p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl p-2 md:p-8 max-h-[95vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold">Update Prices</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl md:text-3xl self-end md:self-auto"
          >
            &times;
          </button>
        </div>
        {response && (
          <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm font-semibold">
            {response}
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {FEE_CATEGORIES.map((cat, idx) => (
            <div key={cat.title || idx} className="space-y-4">
              <h3 className="text-xs font-black text-indigo-500 uppercase tracking-wider">
                {cat.title}
              </h3>
              {cat.fees.map((fee) => (
                <div key={fee.key} className="flex items-center gap-2 mb-2">
                  <div className="flex-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                      {fee.label}
                    </label>
                    <input
                      type="number"
                      step="any"
                      className="w-full border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                      value={formData[fee.key] ?? ""}
                      onChange={(e) => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          [fee.key]: val === "" ? "" : val,
                        });
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    className="ml-2 px-2 py-1 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                    onClick={() => setFormData({ ...formData, [fee.key]: "" })}
                  >
                    Clear
                  </button>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-4 justify-end mt-10 border-t pt-6">
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
