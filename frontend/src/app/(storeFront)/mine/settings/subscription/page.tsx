"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { getAllRegions, getAllCities } from "@/actions/categories/geoAction";
import CitySelect, { CityOption } from "@/app/(storeFront)/components/shared/CitySelect/CitySelect";
import {
  FiBell,
  FiLayers,
  FiCheckCircle,
  FiLoader,
  FiActivity,
  FiChevronDown,
  FiDollarSign,
  FiMapPin,
  FiTrash2,
  FiAlertCircle,
  FiPackage,
  FiRefreshCw,
} from "react-icons/fi";
import {
  createSubscription,
  getMySubscriptions,
  deleteSubscription,
} from "@/actions/categories/subscriptionsActions";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { categories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";
import { useAuth } from "@/context/AuthContext";
import { Subscription } from "@/app/utils/types/subscription";

interface Region {
  id: string;
  name: string;
}

const FILTERED_CATEGORIES = allCategories.filter((c) => c.key !== "Jobs");

const SubscriptionPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [allCities, setAllCities] = useState<CityOption[]>([]);
  const allCitiesRef = useRef<CityOption[]>([]);
  const [selectedCity, setSelectedCity] = useState<CityOption | null>(null);
  const [mySubscriptions, setMySubscriptions] = useState<Subscription[]>([]);
  const [subsLoading, setSubsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainCategory: "Marketplace",
    subcategory: "",
    region: "",
    priceMin: "",
    priceMax: "",
  });

  useEffect(() => {
    Promise.all([getAllRegions(), getAllCities()])
      .then(([regs, cities]) => {
        setRegions(regs || []);
        const cityList = cities || [];
        setAllCities(cityList);
        allCitiesRef.current = cityList;
      })
      .catch(() => {});
  }, []);

  const loadSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const subs = await getMySubscriptions(false);
      setMySubscriptions(subs || []);
    } catch {
      setMySubscriptions([]);
    } finally {
      setSubsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) loadSubscriptions();
  }, [user, loadSubscriptions]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "region") {
      setFormData((prev) => ({ ...prev, region: value }));
      setSelectedCity(null);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result: any = await deleteSubscription(id);
      if (result?.success) {
        setMySubscriptions((prev) => prev.filter((s) => (s.id ?? s._id) !== id));
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.id || user?._id || user?.sub;
    if (!userId || !formData.title.trim() || !formData.region.trim() || !selectedCity) {
      return alert(t("subscription.required"));
    }
    const selectedRegion = regions.find((r) => r.id === formData.region);
    if (!selectedRegion) return alert(t("subscription.required"));

    setLoading(true);
    try {
      const resolvedCity =
        allCitiesRef.current.find(
          (c) => c.name === selectedCity.name && c.regionId === formData.region,
        ) ?? selectedCity;

      const payload: Record<string, any> = {
        userId: String(userId),
        title: formData.title,
        category: formData.mainCategory,
        region: selectedRegion.name,
        cities: [resolvedCity.name],
        selectedCityIds: resolvedCity.id ? [resolvedCity.id] : [],
        customCities: [],
      };
      if (formData.subcategory?.trim()) payload.subCategory = formData.subcategory;
      if (formData.description?.trim()) payload.description = formData.description;
      if (formData.priceMin && !isNaN(Number(formData.priceMin)))
        payload.priceMin = parseFloat(formData.priceMin);
      if (formData.priceMax && !isNaN(Number(formData.priceMax)))
        payload.priceMax = parseFloat(formData.priceMax);

      const result: any = await createSubscription(payload);
      if (result?.success) {
        setFormData({
          title: "",
          description: "",
          mainCategory: "Marketplace",
          subcategory: "",
          region: "",
          priceMin: "",
          priceMax: "",
        });
        setSelectedCity(null);
        if (result.subscription) {
          setMySubscriptions((prev) => [result.subscription, ...prev]);
        } else {
          loadSubscriptions();
        }
      } else {
        alert(result?.message || t("subscription.error"));
      }
    } catch {
      alert(t("subscription.error"));
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryOptions = () => {
    const mainCat = FILTERED_CATEGORIES.find((c) => c.name === formData.mainCategory);
    if (!mainCat) return [];
    const mapKey = mainCat.key;
    if (mapKey === "Marketplace") return Object.values(categories.marketplaceNestedMap).flat();
    if (mapKey === "RealEstate") return Object.values(categories.categoryNestedMap).flat();
    if (mapKey === "Cars") return Object.values(categories.carsNestedCategoriesMap).flat();
    if (mapKey === "Boats") return Object.values(categories.boatsNestedMap).flat();
    if (mapKey === "Motorcycles") return Object.values(categories.motorcyclesNestedMap).flat();
    if (mapKey === "farmequipment") return Object.values(categories.traktorNestedMap).flat();
    return [];
  };

  return (
    <div className="min-h-screen py-6 px-3 sm:px-4">
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="flex items-center gap-3">
          <div className="p-2.5 sm:p-3 bg-blue-600 rounded-xl sm:rounded-2xl shadow-lg shadow-blue-500/25 flex-shrink-0">
            <FiBell size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              {t("subscription.title")}
            </h1>
            <div className="flex items-center gap-1.5 text-blue-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-0.5">
              <FiActivity size={10} className="animate-pulse" />
              {t("subscription.liveScanner")}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">
              {t("subscription.createNewAlert")}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {t("subscription.createNewAlertSub")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-4 sm:p-8 space-y-4 sm:space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("subscription.alertTitle")}
              </label>
              <input
                required
                name="title"
                value={formData.title}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900"
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.category")}
                </label>
                <div className="relative">
                  <FiLayers size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <select
                    name="mainCategory"
                    value={formData.mainCategory}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-8 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    {FILTERED_CATEGORIES.map((cat) => (
                      <option key={cat.key} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.subcategoryLabel")}
                </label>
                <div className="relative">
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pr-8 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    <option value="">{t("subscription.selectCategory")}</option>
                    {getSubcategoryOptions().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("subscription.priceRange")}
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiDollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="number"
                    name="priceMin"
                    value={formData.priceMin}
                    placeholder={t("subscription.minPrice")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-sm outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
                <div className="relative flex-1">
                  <FiDollarSign size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 pointer-events-none" />
                  <input
                    type="number"
                    name="priceMax"
                    value={formData.priceMax}
                    placeholder={t("subscription.maxPrice")}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-sm outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.region")}
                </label>
                <div className="relative">
                  <select
                    required
                    name="region"
                    value={formData.region}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 pr-8 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    <option value="">{t("subscription.selectRegion")}</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <CitySelect
                regionId={formData.region}
                cities={allCities}
                value={selectedCity?.name ?? ""}
                onChange={(name) => {
                  const found = allCitiesRef.current.find(
                    (c) => c.name === name && c.regionId === formData.region,
                  );
                  setSelectedCity(found ?? { id: "", name, regionId: formData.region });
                }}
                onCitiesUpdate={(updated) => {
                  allCitiesRef.current = updated;
                  setAllCities(updated);
                }}
                disabled={!formData.region}
                label={t("subscription.cities")}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("subscription.description")}
              </label>
              <textarea
                name="description"
                value={formData.description}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-medium text-gray-900 resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleChange}
                placeholder={t("subscription.descriptionPlaceholder")}
              />
            </div>

            <button
              type="submit"
              disabled={loading || authLoading || !user || !selectedCity}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-3.5 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <FiLoader className="animate-spin" size={16} />
              ) : (
                <FiCheckCircle size={16} />
              )}
              {loading ? t("subscription.submitting") : t("subscription.submit")}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-5 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-gray-800">
              {t("subscription.myAlerts")}
            </h2>
            <button
              onClick={loadSubscriptions}
              disabled={subsLoading}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              title={t("subscription.refresh")}
            >
              <FiRefreshCw size={14} className={subsLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {subsLoading ? (
              <div className="flex items-center justify-center py-10">
                <FiLoader size={20} className="animate-spin text-gray-300" />
              </div>
            ) : mySubscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-300">
                <FiPackage size={28} />
                <p className="text-xs font-bold uppercase tracking-widest">
                  {t("subscription.noAlerts")}
                </p>
              </div>
            ) : (
              mySubscriptions.map((sub) => (
                <div
                  key={sub.id ?? sub._id}
                  className="px-4 sm:px-8 py-4 sm:py-5 flex items-start justify-between gap-3 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 break-words">
                        {sub.title}
                      </span>
                      <span className="inline-flex items-center bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                        {sub.category}
                      </span>
                      {sub.isActive ? (
                        <span className="inline-flex items-center bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                          {t("subscription.status.active")}
                        </span>
                      ) : (
                        <span className="inline-flex items-center bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap">
                          {t("subscription.status.inactive")}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiMapPin size={10} /> {sub.region}
                      </span>
                      {sub.cities && sub.cities.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {sub.cities.slice(0, 2).join(", ")}
                          {sub.cities.length > 2 ? ` +${sub.cities.length - 2}` : ""}
                        </span>
                      )}
                      {(sub.notificationCount ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                          <FiBell size={10} />
                          {sub.notificationCount}{" "}
                          {sub.notificationCount === 1
                            ? t("subscription.match")
                            : t("subscription.matches")}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(sub.id ?? sub._id ?? "")}
                    disabled={deletingId === (sub.id ?? sub._id)}
                    className="flex-shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title={t("subscription.deleteAlert")}
                  >
                    {deletingId === (sub.id ?? sub._id) ? (
                      <FiLoader size={14} className="animate-spin" />
                    ) : (
                      <FiTrash2 size={14} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-xl sm:rounded-2xl px-4 py-3">
          <FiAlertCircle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-700 leading-relaxed">
            {t("subscription.notifyHint")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
