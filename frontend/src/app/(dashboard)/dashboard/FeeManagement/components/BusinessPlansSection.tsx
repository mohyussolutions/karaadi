"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import {
  BusinessPlan,
  createBusinessPlan,
  updateBusinessPlan,
  deleteBusinessPlan,
} from "@/actions/categories/businessPlanActions";

interface Props {
  plans: BusinessPlan[];
  onRefresh: () => void;
}

const EMPTY_FORM = {
  name: "",
  price: "",
  durationDays: "",
  maxListings: "",
};

export default function BusinessPlansSection({ plans, onRefresh }: Props) {
  const { t } = useTranslation();
  const [editing, setEditing] = useState<BusinessPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEdit = (plan: BusinessPlan) => {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      durationDays: String(plan.durationDays),
      maxListings: String(plan.maxListings),
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.durationDays || !form.maxListings) {
      toast.error("All fields are required");
      return;
    }
    setSaving(true);
    const payload = {
      name: form.name,
      price: Number(form.price),
      durationDays: Number(form.durationDays),
      maxListings: Number(form.maxListings),
    };
    const res = editing
      ? await updateBusinessPlan(editing.id, payload)
      : await createBusinessPlan(payload);

    if ((res as any)?.success) {
      toast.success(editing ? "Plan updated" : "Plan created");
      setShowForm(false);
      onRefresh();
    } else {
      toast.error("Failed to save plan");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this plan?")) return;
    const res = await deleteBusinessPlan(id);
    if ((res as any)?.success !== false) {
      toast.success("Plan deleted");
      onRefresh();
    } else {
      toast.error("Failed to delete plan");
    }
  };

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 lg:p-6 shadow-sm col-span-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-5">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {t("adminTable.businessPlansTitle")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("adminTable.businessPlansSubtitle")}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="w-full sm:w-auto bg-indigo-600 text-white text-sm px-4 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all"
        >
          + {t("adminTable.addPlan")}
        </button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-200 grid grid-cols-2 md:grid-cols-4 gap-3">
          {(
            [
              { key: "name", label: "Plan Name", type: "text" },
              { key: "price", label: "Price ($)", type: "number" },
              { key: "durationDays", label: "Duration (days)", type: "number" },
              { key: "maxListings", label: "Max Listings", type: "number" },
            ] as const
          ).map(({ key, label, type }) => (
            <div key={key}>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
            </div>
          ))}
          <div className="col-span-full flex gap-2 mt-1">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-indigo-600 text-white text-sm px-5 py-2 rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-60"
            >
              {saving ? t("adminTable.saving") : editing ? t("adminTable.updatePlan") : t("adminTable.createPlan")}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-sm px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100"
            >
              {t("adminTable.cancel")}
            </button>
          </div>
        </div>
      )}

      {plans.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t("adminTable.noPlans")}</p>
      ) : (
        <>
          <div className="block lg:hidden space-y-3">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-semibold text-gray-800">{plan.name}</p>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${plan.isActive ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-100"}`}>
                    {plan.isActive ? t("adminTable.active").toUpperCase() : t("adminTable.inactive").toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500 mb-3">
                  <div><span className="font-bold text-gray-700">{plan.price === 0 ? <span className="text-emerald-600">FREE</span> : `$${plan.price.toFixed(2)}`}</span><br />{t("adminTable.price")}</div>
                  <div><span className="font-bold text-gray-700">{plan.durationDays}d</span><br />{t("adminTable.durationDays")}</div>
                  <div><span className="font-bold text-gray-700">{plan.maxListings}</span><br />{t("adminTable.maxListings")}</div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(plan)} className="flex-1 text-xs font-bold text-indigo-600 border border-indigo-200 rounded-lg py-1.5 hover:bg-indigo-50">
                    {t("adminTable.edit")}
                  </button>
                  <button onClick={() => handleDelete(plan.id)} className="flex-1 text-xs font-bold text-red-500 border border-red-200 rounded-lg py-1.5 hover:bg-red-50">
                    {t("adminTable.delete")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[t("adminTable.planName"), t("adminTable.price"), t("adminTable.durationDays"), t("adminTable.maxListings"), t("adminTable.status"), ""].map((h) => (
                    <th key={h} className="text-left text-xs font-black text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4 font-semibold text-gray-800">{plan.name}</td>
                    <td className="py-3 pr-4 font-bold text-gray-900">
                      {plan.price === 0 ? (
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">FREE</span>
                      ) : (
                        `$${plan.price.toFixed(2)}`
                      )}
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{plan.durationDays}d</td>
                    <td className="py-3 pr-4 text-gray-600">{plan.maxListings}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${plan.isActive ? "text-emerald-600 bg-emerald-50" : "text-gray-400 bg-gray-100"}`}>
                        {plan.isActive ? t("adminTable.active").toUpperCase() : t("adminTable.inactive").toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button onClick={() => openEdit(plan)} className="text-indigo-600 text-xs font-bold hover:underline mr-3">
                        {t("adminTable.edit")}
                      </button>
                      <button onClick={() => handleDelete(plan.id)} className="text-red-500 text-xs font-bold hover:underline">
                        {t("adminTable.delete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
