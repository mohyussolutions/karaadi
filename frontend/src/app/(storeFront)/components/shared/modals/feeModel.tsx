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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-6xl max-h-[92vh] sm:max-h-[95vh] shadow-2xl flex flex-col overflow-hidden">
        <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 pt-4 sm:pt-6 md:pt-8 pb-4 border-b border-gray-100 shrink-0">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Update Prices</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5">
          {response && (
            <div className="mb-4 p-3 rounded bg-green-50 text-green-700 text-sm font-semibold">
              {response}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {FEE_CATEGORIES.map((cat, idx) => (
              <div key={cat.title || idx} className="space-y-3">
                <h3 className="text-xs font-black text-indigo-500 uppercase tracking-wider">
                  {cat.title}
                </h3>
                {cat.fees.map((fee) => (
                  <div key={fee.key} className="mb-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                      {fee.label}
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="any"
                        className="flex-1 min-w-0 border rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        value={formData[fee.key] ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setFormData({
                            ...formData,
                            [fee.key]: val === "" ? "" : val,
                          });
                        }}
                      />
                      <button
                        type="button"
                        className="shrink-0 px-2 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                        onClick={() => setFormData({ ...formData, [fee.key]: "" })}
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row gap-3 justify-end px-4 sm:px-6 md:px-8 py-4 border-t border-gray-100 bg-white">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 font-bold text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={loading}
            className="w-full sm:w-auto bg-indigo-600 text-white px-10 py-2.5 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Saving..." : "Deploy Configuration"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeeModal;
