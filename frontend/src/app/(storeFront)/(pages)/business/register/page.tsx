"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { IoBusiness } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { addCity } from "@/actions/categories/geoAction";
import { createBusiness } from "@/actions/categories/businessActions";
import type { BusinessPlan } from "@/actions/categories/businessPlanActions";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import type { Region, City } from "@/app/utils/types/geoTypes";

const CATEGORIES = [
  { id: "realestate", labelKey: "mine.businesses.categories.realestate", descKey: "mine.businesses.categories.realestateDesc" },
  { id: "schools",    labelKey: "mine.businesses.categories.schools",    descKey: "mine.businesses.categories.schoolsDesc" },
  { id: "motor",      labelKey: "mine.businesses.categories.motor",      descKey: "mine.businesses.categories.motorDesc" },
  { id: "marketplace",labelKey: "mine.businesses.categories.marketplace",descKey: "mine.businesses.categories.marketplaceDesc" },
];

export default function BusinessRegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<City[]>([]);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showNewCityInput, setShowNewCityInput] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    orgNumber: "",
    address: "",
    website: "",
    description: "",
    contactName: "",
    region: "",
    city: "",
  });

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
    if (!authLoading && user?.email) {
      setForm((f) => ({ ...f, email: user.email }));
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_API_URL}/api/locations/regions`).then((r) => r.json()),
      fetch(`${BASE_API_URL}/api/locations/cities`).then((r) => r.json()),
      fetch(`${BASE_API_URL}/api/business-plans`).then((r) => r.json()),
    ])
      .then(([regs, cits, plansRes]) => {
        setRegions(Array.isArray(regs) ? regs : []);
        setAllCities(Array.isArray(cits) ? cits : []);
        const planList = plansRes?.plans ?? [];
        setPlans(planList.filter((p: BusinessPlan) => p.isActive));
      })
      .finally(() => setDataLoading(false));
  }, []);

  useEffect(() => {
    if (form.region) {
      setFilteredCities(allCities.filter((c) => c.regionId === form.region));
      setForm((f) => ({ ...f, city: "" }));
      setShowNewCityInput(false);
      setNewCityName("");
    } else {
      setFilteredCities([]);
    }
  }, [form.region, allCities]);

  const toggleCategory = (id: string) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  const handleAddCity = async () => {
    if (!newCityName.trim() || !form.region) return;
    setAddingCity(true);
    try {
      const res = await addCity({ name: newCityName.trim(), regionId: form.region });
      if (res.success && res.data) {
        const newCity: City = { id: res.data.id, name: res.data.name, regionId: form.region };
        setAllCities((prev) => [...prev, newCity]);
        setFilteredCities((prev) => [...prev, newCity]);
        setForm((f) => ({ ...f, city: res.data.name }));
        setShowNewCityInput(false);
        setNewCityName("");
        toast.success(`City "${res.data.name}" added`);
      } else {
        toast.error("Failed to add city");
      }
    } catch {
      toast.error("Failed to add city");
    } finally {
      setAddingCity(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    if (!selectedCategories.length) {
      toast.error(t("mine.businesses.selectAtLeastOne"));
      return;
    }
    if (!form.region || !form.city) {
      toast.error("Please select a region and city");
      return;
    }
    if (!selectedPlanId) {
      toast.error("Please select a plan");
      return;
    }

    setSubmitting(true);
    try {
      const res = await createBusiness({
        ...form,
        website: form.website || undefined,
        categories: selectedCategories,
        planId: selectedPlanId,
      }) as any;

      if (res?.success) {
        toast.success("Business registered! You can now post ads.");
        router.push("/business");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || dataLoading) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Back"
        >
          ←
        </button>
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
          <IoBusiness className="text-white text-xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("mine.businesses.registerTitle")}</h1>
          <p className="text-sm text-gray-500">{t("mine.businesses.registerDesc")}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        <section className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-base">Company Information</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.companyName")} *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.orgNumber")}
              </label>
              <input
                value={form.orgNumber}
                onChange={(e) => setForm({ ...form, orgNumber: e.target.value })}
                placeholder="123 456 789"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.businessEmail")} *
              </label>
              <input
                required
                type="email"
                readOnly
                value={form.email}
                className="w-full border rounded-lg px-3 py-2 text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-0.5">Same as your account email</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.phone")} *
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.contactPerson")}
              </label>
              <input
                value={form.contactName}
                onChange={(e) => setForm({ ...form, contactName: e.target.value })}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                {t("mine.businesses.website")} <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input
                type="url"
                value={form.website}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                placeholder="https://"
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("mine.businesses.description")}
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-base">Location</h2>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Region *</label>
            <select
              required
              value={form.region}
              onChange={(e) => setForm({ ...form, region: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Select region…</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>

          {form.region && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-medium text-gray-700">City *</label>
                {!showNewCityInput && (
                  <button
                    type="button"
                    onClick={() => setShowNewCityInput(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    + Add new city
                  </button>
                )}
              </div>

              {!showNewCityInput ? (
                <select
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="">
                    {filteredCities.length === 0 ? "No cities — add one below" : "Select city…"}
                  </option>
                  {filteredCities.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              ) : (
                <div className="flex gap-2">
                  <input
                    autoFocus
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    placeholder="New city name"
                    className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddCity())}
                  />
                  <button
                    type="button"
                    onClick={handleAddCity}
                    disabled={addingCity || !newCityName.trim()}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
                  >
                    {addingCity ? "Adding…" : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewCityInput(false); setNewCityName(""); }}
                    className="px-3 py-2 rounded-lg border text-sm text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {form.city && !showNewCityInput && (
                <p className="text-xs text-green-600 mt-1">✓ {form.city} selected</p>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              {t("mine.businesses.address")}
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </section>

        <section className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 text-base mb-3">
            {t("mine.businesses.selectCategories")} *
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={`border rounded-xl p-3 text-left transition-colors ${
                  selectedCategories.includes(cat.id)
                    ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                    : "border-gray-200 hover:border-blue-300 bg-white"
                }`}
              >
                <div className="font-medium text-sm text-gray-900">{t(cat.labelKey)}</div>
                <div className="text-xs text-gray-500 mt-0.5">{t(cat.descKey)}</div>
              </button>
            ))}
          </div>
          {!selectedCategories.length && (
            <p className="text-xs text-red-500 mt-2">{t("mine.businesses.selectAtLeastOne")}</p>
          )}
        </section>

        <section className="bg-white border rounded-xl p-5">
          <h2 className="font-semibold text-gray-800 text-base mb-1">Choose Plan *</h2>
          <p className="text-xs text-gray-500 mb-4">
            How long your business stays listed on the website. Expiry starts from registration date.
          </p>
          {plans.length === 0 ? (
            <p className="text-sm text-gray-400">No plans available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {plans.map((plan) => {
                const expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + plan.durationDays);
                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`border rounded-xl p-4 text-left transition-all ${
                      selectedPlanId === plan.id
                        ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600"
                        : "border-gray-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <div className="font-semibold text-sm text-gray-900">{plan.name}</div>
                    <div className="text-base font-bold text-gray-800 mt-1">{plan.durationDays} days</div>
                    <div className="text-xs text-gray-500 mt-1">{plan.maxListings} listings max</div>
                    <div className="text-xs text-gray-400 mt-1">
                      Expires {expiryDate.toLocaleDateString()}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
          {!selectedPlanId && plans.length > 0 && (
            <p className="text-xs text-red-500 mt-2">Please select a plan</p>
          )}
        </section>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting || !selectedCategories.length || !selectedPlanId}
            className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            <IoBusiness />
            {submitting ? t("mine.businesses.submitting") : t("mine.businesses.submitVerification")}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-5 py-3 rounded-xl border text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {t("mine.businesses.cancel")}
          </button>
        </div>
      </form>
    </div>
  );
}
