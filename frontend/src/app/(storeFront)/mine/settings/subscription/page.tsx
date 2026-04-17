"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getAllRegions, getAllCities, addCity } from "@/actions/categories/geoAction";
import {
  FiBell, FiLayers, FiCheckCircle, FiLoader, FiActivity,
  FiChevronDown, FiPlus, FiX, FiDollarSign, FiMapPin,
} from "react-icons/fi";
import { createSubscription } from "@/actions/categories/subscriptionsActions";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { categories } from "@/app/(links)/storeFrontLinks/nesSubCategoryLinks";
import { useAuth } from "@/context/AuthContext";

interface Region { id: string; name: string }
interface City { id: string; name: string; regionId: string }
interface SelectedCity { id: string; name: string }

const SubscriptionPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showAddCity, setShowAddCity] = useState(false);
  const [newCityName, setNewCityName] = useState("");
  const [addingCity, setAddingCity] = useState(false);
  const [selectedCities, setSelectedCities] = useState<SelectedCity[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainCategory: "Marketplace",
    subcategory: "",
    region: "",
    totalFee: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [regionsData, citiesData] = await Promise.all([getAllRegions(), getAllCities()]);
        setRegions(regionsData || []);
        setCities(citiesData || []);
      } catch {}
    };
    fetchData();
  }, []);

  const filteredCities = useMemo(
    () =>
      cities.filter(
        (city) =>
          city.regionId === formData.region &&
          !selectedCities.some((s) => s.id === city.id) &&
          city.name.toLowerCase().includes(citySearchTerm.toLowerCase()),
      ),
    [formData.region, cities, selectedCities, citySearchTerm],
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updates = { ...prev, [name]: value };
      if (name === "region") setSelectedCities([]);
      return updates;
    });
  };

  const handleAddCityToList = (cityId: string, cityName: string) => {
    setSelectedCities([{ id: cityId, name: cityName }]);
    setCitySearchTerm("");
    setShowAddCity(false);
  };

  const handleRemoveCity = () => setSelectedCities([]);

  const handleAddCustomCity = async () => {
    if (!newCityName.trim() || !formData.region) return;
    setAddingCity(true);
    try {
      const result: any = await addCity({ name: newCityName.trim(), regionId: formData.region });
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
    } catch {} finally {
      setAddingCity(false);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userId = user?.id || user?._id || user?.sub;
    if (!userId) return alert("Please login first");
    if (!formData.title.trim()) return alert("Please enter a title");
    if (!formData.region.trim()) return alert("Please select a region");
    if (selectedCities.length === 0) return alert("Please select at least one city");
    const selectedRegion = regions.find((r) => r.id === formData.region);
    if (!selectedRegion) return alert("Please select a region");

    setLoading(true);
    try {
      const cityIds = selectedCities.map((c) => c.id);
      const payload: Record<string, any> = {
        userId: String(userId),
        title: formData.title,
        category: formData.mainCategory,
        region: selectedRegion.name,
        cities: cityIds,
        selectedCityIds: cityIds,
        customCities: [],
      };
      if (formData.subcategory?.trim()) payload.subCategory = formData.subcategory;
      if (formData.description?.trim()) payload.description = formData.description;
      if (formData.totalFee && !isNaN(Number(formData.totalFee)))
        payload.totalFee = parseFloat(formData.totalFee);

      const result: any = await createSubscription(payload);
      if (result?.success) {
        alert(`Watchman alert created for ${selectedCities.length} location(s)!`);
        setFormData({ title: "", description: "", mainCategory: "Marketplace", subcategory: "", region: "", totalFee: "" });
        setSelectedCities([]);
      } else {
        alert(result?.message || "Error creating subscription");
      }
    } catch (err: any) {
      alert(err?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-0 md:p-10 border border-gray-100">
        <div className="flex items-center gap-4 px-8 pt-8 pb-4 border-b border-gray-100">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <FiBell size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight text-gray-900">
              {t("subscription.title")}
            </h2>
            <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase tracking-widest mt-1">
              <FiActivity className="animate-pulse" /> Live Scanner Active
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="w-full p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.title")}
              </label>
              <input
                required
                name="title"
                value={formData.title}
                placeholder={t("subscription.title")}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900"
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.category")}
              </label>
              <div className="relative">
                <FiLayers className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                <select
                  name="mainCategory"
                  value={formData.mainCategory}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-14 pr-6 py-4 outline-none appearance-none font-semibold text-gray-900"
                  onChange={handleChange}
                >
                  {allCategories.map((cat) => (
                    <option key={cat.key} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.category")}
              </label>
              <select
                name="subcategory"
                required
                value={formData.subcategory}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-6 py-4 outline-none font-semibold text-gray-900"
                onChange={handleChange}
              >
                <option value="">{t("subscription.selectCategory")}</option>
                {(() => {
                  const mainCat = allCategories.find((c) => c.name === formData.mainCategory);
                  if (!mainCat) return null;
                  const mapKey = mainCat.key;
                  if (mapKey === "Marketplace")
                    return Object.values(categories.marketplaceNestedMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "RealEstate")
                    return Object.values(categories.categoryNestedMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "Cars")
                    return Object.values(categories.carsNestedCategoriesMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "Boats")
                    return Object.values(categories.boatsNestedMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "Motorcycles")
                    return Object.values(categories.motorcyclesNestedMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "farmequipment")
                    return Object.values(categories.traktorNestedMap).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  if (mapKey === "Jobs")
                    return Object.values(categories.jobsSubCategories).flat().map((sub: any, i) => (
                      <option key={sub.key + i} value={sub.name}>{sub.name}</option>
                    ));
                  return null;
                })()}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.priceRange")}
              </label>
              <div className="relative">
                <FiDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                <input
                  type="number"
                  name="totalFee"
                  value={formData.totalFee}
                  placeholder={t("subscription.minPrice") + " - " + t("subscription.maxPrice")}
                  className="w-full bg-gray-100 border border-gray-200 rounded-xl pl-14 pr-6 py-4 outline-none font-semibold text-gray-900"
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.region")}
              </label>
              <select
                required
                name="region"
                value={formData.region}
                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-5 py-4 outline-none font-semibold text-gray-900 appearance-none"
                onChange={handleChange}
              >
                <option value="">{t("subscription.selectRegion")}</option>
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
                {t("subscription.cities")}
              </label>
              {selectedCities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedCities.map((city) => (
                    <div key={city.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                      <FiMapPin size={14} />
                      {city.name}
                      <button type="button" onClick={handleRemoveCity} className="hover:text-red-600 transition-colors">
                        <FiX size={16} />
                      </button>
                    </div>
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
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-5 py-3 outline-none font-semibold text-gray-900"
                  />
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl">
                    {filteredCities.length > 0 ? (
                      filteredCities.map((city) => (
                        <button
                          key={city.id}
                          type="button"
                          onClick={() => handleAddCityToList(city.id, city.name)}
                          className="w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-200 last:border-0 font-medium transition-colors"
                        >
                          {city.name}
                        </button>
                      ))
                    ) : (
                      <div className="px-5 py-3 text-gray-400 text-xs">{t("subscription.error")}</div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCity(true)}
                    className="w-full mt-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <FiPlus size={20} /> {t("subscription.addCity")}
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
                    className="w-full bg-gray-100 border border-gray-200 rounded-xl px-5 py-4 outline-none font-semibold text-gray-900"
                    autoFocus
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleAddCustomCity}
                      disabled={addingCity || !newCityName.trim()}
                      className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-bold disabled:opacity-50 hover:bg-emerald-700"
                    >
                      {addingCity ? <FiLoader className="animate-spin mx-auto" /> : t("subscription.addCity")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setShowAddCity(false); setNewCityName(""); }}
                      className="px-4 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700"
                    >
                      <FiX size={20} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">
              {t("subscription.description") || "Notes"}
            </label>
            <textarea
              name="description"
              value={formData.description}
              rows={4}
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-6 py-4 outline-none font-semibold text-gray-900 resize-none"
              onChange={handleChange}
              placeholder={t("subscription.description") || "Optional details about what you're looking for..."}
            />
          </div>

          <button
            type="submit"
            disabled={loading || authLoading || !user || selectedCities.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:from-blue-700 hover:to-emerald-600 transition-all active:scale-[0.97] disabled:opacity-50 shadow-xl text-lg mt-4"
          >
            {loading ? <FiLoader className="animate-spin" size={22} /> : <FiCheckCircle size={22} />}
            {loading ? t("subscription.submitting") : t("subscription.submit")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionPage;
