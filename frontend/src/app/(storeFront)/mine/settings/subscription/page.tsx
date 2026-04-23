"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  getAllRegions,
  getAllCities,
  addCity,
} from "@/actions/categories/geoAction";
import {
  FiBell,
  FiLayers,
  FiCheckCircle,
  FiLoader,
  FiActivity,
  FiChevronDown,
  FiPlus,
  FiX,
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
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { categories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import { useAuth } from "@/context/AuthContext";
import { Subscription } from "@/app/utils/types/subscription";
import { deleteNotification } from "@/actions/categories/notificationActions";

interface Region {
  id: string;
  name: string;
}
interface City {
  id: string;
  name: string;
  regionId: string;
}
interface SelectedCity {
  id: string;
  name: string;
}

const SubscriptionPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [selectedCities, setSelectedCities] = useState<SelectedCity[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
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
    getAllRegions()
      .then((r) => setRegions(r || []))
      .catch(() => {});
  }, []);

  const loadSubscriptions = useCallback(async () => {
    setSubsLoading(true);
    try {
      const subs = await getMySubscriptions();
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

  const handleRegionChange = useCallback(async (regionId: string) => {
    setFormData((prev) => ({ ...prev, region: regionId }));
    setSelectedCities([]);
    setCities([]);
    if (!regionId) return;
    setCitiesLoading(true);
    try {
      const data = await getAllCities(regionId);
      setCities(data || []);
    } catch {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  const filteredCities = useMemo(
    () =>
      cities.filter(
        (city) =>
          city.regionId === formData.region &&
          !selectedCities.some((s) => s.id === city.id) &&
          city.name.toLowerCase().includes(citySearchTerm.toLowerCase()),
      ),
    [cities, selectedCities, citySearchTerm, formData.region],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    if (name === "region") {
      handleRegionChange(value);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAddCityToList = (cityId: string, cityName: string) => {
    setSelectedCities([{ id: cityId, name: cityName }]);
    setCitySearchTerm("");
    setShowAddCity(false);
  };

  const handleAddCustomCity = async () => {
    if (!newCityName.trim() || !formData.region) return;
    setAddingCity(true);
    try {
      const result: any = await addCity({
        name: newCityName.trim(),
        regionId: formData.region,
      });
      if (result?.success && result?.data) {
        const newCity: City = {
          id: String(result.data.id),
          name: String(result.data.name),
          regionId: String(result.data.regionId),
        };
        setCities((prev) => [...prev, newCity]);
        setSelectedCities([{ id: newCity.id, name: newCity.name }]);
        setShowAddCity(false);
        setNewCityName("");
      }
    } catch {
    } finally {
      setAddingCity(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      const result: any = await deleteSubscription(id);
      if (result?.success) {
        setMySubscriptions((prev) =>
          prev.filter((s) => (s.id ?? s._id) !== id),
        );
      }
    } catch {
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      // Optionally refresh notifications or show a toast
    } catch (err) {
      // Optionally handle error
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.id || user?._id || user?.sub;
    if (!userId) return alert("Please login first");
    if (!formData.title.trim()) return alert("Please enter a title");
    if (!formData.region.trim()) return alert("Please select a region");
    if (selectedCities.length === 0)
      return alert("Please select at least one city");
    const selectedRegion = regions.find((r) => r.id === formData.region);
    if (!selectedRegion) return alert("Please select a region");

    setLoading(true);
    try {
      const cityNames = selectedCities.map((c) => c.name);
      const cityIds = selectedCities.map((c) => c.id);
      const payload: Record<string, any> = {
        userId: String(userId),
        title: formData.title,
        category: formData.mainCategory,
        region: selectedRegion.name,
        cities: cityNames,
        selectedCityIds: cityIds,
        customCities: [],
      };
      if (formData.subcategory?.trim())
        payload.subCategory = formData.subcategory;
      if (formData.description?.trim())
        payload.description = formData.description;
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
        setSelectedCities([]);
        setCities([]);
        if (result.subscription) {
          setMySubscriptions((prev) => [result.subscription, ...prev]);
        } else {
          loadSubscriptions();
        }
      } else {
        alert(result?.message || "Error creating subscription");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getSubcategoryOptions = () => {
    const mainCat = allCategories.find((c) => c.name === formData.mainCategory);
    if (!mainCat) return [];
    const mapKey = mainCat.key;
    if (mapKey === "Marketplace")
      return Object.values(categories.marketplaceNestedMap).flat();
    if (mapKey === "RealEstate")
      return Object.values(categories.categoryNestedMap).flat();
    if (mapKey === "Cars")
      return Object.values(categories.carsNestedCategoriesMap).flat();
    if (mapKey === "Boats")
      return Object.values(categories.boatsNestedMap).flat();
    if (mapKey === "Motorcycles")
      return Object.values(categories.motorcyclesNestedMap).flat();
    if (mapKey === "farmequipment")
      return Object.values(categories.traktorNestedMap).flat();
    if (mapKey === "Jobs")
      return Object.values(categories.jobsSubCategories).flat();
    return [];
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/25">
            <FiBell size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">
              {t("subscription.title")}
            </h1>
            <div className="flex items-center gap-1.5 text-blue-500 text-xs font-bold uppercase tracking-widest mt-0.5">
              <FiActivity size={11} className="animate-pulse" />
              Live Scanner Active
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100">
            <h2 className="text-base font-bold text-gray-800">
              Create New Alert
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Get notified when a matching item is posted
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Alert Title
                </label>
                <input
                  required
                  name="title"
                  value={formData.title}
                  placeholder="e.g. Toyota Hilux under $15k"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-gray-900 placeholder:text-gray-400"
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.category")}
                </label>
                <div className="relative">
                  <FiLayers
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <select
                    name="mainCategory"
                    value={formData.mainCategory}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    {allCategories.map((cat) => (
                      <option key={cat.key} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Subcategory
                </label>
                <div className="relative">
                  <select
                    name="subcategory"
                    value={formData.subcategory}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    <option value="">{t("subscription.selectCategory")}</option>
                    {getSubcategoryOptions().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.priceRange")}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <FiDollarSign
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="number"
                      name="priceMin"
                      value={formData.priceMin}
                      placeholder="Min"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-sm outline-none font-medium text-gray-900 placeholder:text-gray-400"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="relative flex-1">
                    <FiDollarSign
                      size={14}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500"
                    />
                    <input
                      type="number"
                      name="priceMax"
                      value={formData.priceMax}
                      placeholder="Max"
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-3 py-3 text-sm outline-none font-medium text-gray-900 placeholder:text-gray-400"
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t("subscription.region")}
                </label>
                <div className="relative">
                  <select
                    required
                    name="region"
                    value={formData.region}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none appearance-none font-medium text-gray-900"
                    onChange={handleChange}
                  >
                    <option value="">{t("subscription.selectRegion")}</option>
                    {regions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown
                    size={14}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                  <FiMapPin size={11} /> {t("subscription.cities")}
                </label>

                {selectedCities.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {selectedCities.map((city) => (
                      <span
                        key={city.id}
                        className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        {city.name}
                        <button
                          type="button"
                          onClick={() => setSelectedCities([])}
                          className="hover:text-red-500 transition-colors"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}

                {formData.region && !showAddCity && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={citySearchTerm}
                      onChange={(e) => setCitySearchTerm(e.target.value)}
                      placeholder={t("subscription.selectCities")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-medium text-gray-900 placeholder:text-gray-400"
                    />
                    <div className="max-h-36 overflow-y-auto border border-gray-100 rounded-xl bg-white divide-y divide-gray-50">
                      {citiesLoading ? (
                        <div className="flex items-center justify-center py-4">
                          <FiLoader
                            size={14}
                            className="animate-spin text-gray-300"
                          />
                        </div>
                      ) : filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <button
                            key={city.id}
                            type="button"
                            onClick={() =>
                              handleAddCityToList(city.id, city.name)
                            }
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 hover:text-blue-700 font-medium transition-colors"
                          >
                            {city.name}
                          </button>
                        ))
                      ) : (
                        <p className="px-4 py-3 text-gray-400 text-xs">
                          {t("subscription.error")}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddCity(true)}
                      className="w-full px-4 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <FiPlus size={14} /> {t("subscription.addCity")}
                    </button>
                  </div>
                )}

                {showAddCity && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      placeholder={t("subscription.newCityPlaceholder")}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-medium text-gray-900"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCustomCity}
                        disabled={addingCity || !newCityName.trim()}
                        className="flex-1 px-4 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-bold disabled:opacity-50 hover:bg-emerald-700 transition-colors"
                      >
                        {addingCity ? (
                          <FiLoader
                            className="animate-spin mx-auto"
                            size={14}
                          />
                        ) : (
                          t("subscription.addCity")
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddCity(false);
                          setNewCityName("");
                        }}
                        className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                      >
                        <FiX size={14} />
                      </button>
                    </div>
                  </div>
                )}

                {!formData.region && (
                  <p className="text-xs text-gray-400 italic">
                    Select a region first
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t("subscription.description") || "Notes"}
              </label>
              <textarea
                name="description"
                value={formData.description}
                rows={3}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none font-medium text-gray-900 resize-none placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleChange}
                placeholder="Optional: describe what you're looking for..."
              />
            </div>

            <button
              type="submit"
              disabled={
                loading || authLoading || !user || selectedCities.length === 0
              }
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2.5 transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <FiLoader className="animate-spin" size={18} />
              ) : (
                <FiCheckCircle size={18} />
              )}
              {loading
                ? t("subscription.submitting")
                : t("subscription.submit")}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-8 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-800">My Alerts</h2>
              <p className="text-xs text-gray-400 mt-0.5">
                {mySubscriptions.length} active alert
                {mySubscriptions.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={loadSubscriptions}
              disabled={subsLoading}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all"
              title="Refresh"
            >
              <FiRefreshCw
                size={15}
                className={subsLoading ? "animate-spin" : ""}
              />
            </button>
          </div>

          <div className="divide-y divide-gray-50">
            {subsLoading ? (
              <div className="flex items-center justify-center py-12">
                <FiLoader size={20} className="animate-spin text-gray-300" />
              </div>
            ) : mySubscriptions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 gap-3 text-gray-300">
                <FiPackage size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">
                  No alerts yet
                </p>
              </div>
            ) : (
              mySubscriptions.map((sub) => (
                <div
                  key={sub.id ?? sub._id}
                  className="px-8 py-5 flex items-start justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm text-gray-900 truncate">
                        {sub.title}
                      </span>
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        {sub.category}
                      </span>
                      {sub.isActive ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          Inactive
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 text-xs text-gray-400">
                        <FiMapPin size={11} /> {sub.region}
                      </span>
                      {sub.cities && sub.cities.length > 0 && (
                        <span className="text-xs text-gray-400">
                          {sub.cities.slice(0, 2).join(", ")}
                          {sub.cities.length > 2
                            ? ` +${sub.cities.length - 2}`
                            : ""}
                        </span>
                      )}
                      {(sub.notificationCount ?? 0) > 0 && (
                        <span className="flex items-center gap-1 text-xs text-blue-400 font-medium">
                          <FiBell size={11} /> {sub.notificationCount} match
                          {sub.notificationCount !== 1 ? "es" : ""}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(sub.id ?? sub._id ?? "")}
                    disabled={deletingId === (sub.id ?? sub._id)}
                    className="flex-shrink-0 p-2 rounded-xl text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                    title="Delete alert"
                  >
                    {deletingId === (sub.id ?? sub._id) ? (
                      <FiLoader size={15} className="animate-spin" />
                    ) : (
                      <FiTrash2 size={15} />
                    )}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
          <FiAlertCircle
            size={16}
            className="text-amber-500 flex-shrink-0 mt-0.5"
          />
          <p className="text-xs text-amber-700 leading-relaxed">
            You will be notified in <strong>/notifications</strong> whenever
            someone posts an item that matches your alert criteria.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
