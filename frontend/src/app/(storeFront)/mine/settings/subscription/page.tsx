"use client";

import React, { useState, useEffect, useMemo } from "react";
import { apiService } from "@/actions/core/authAction";
import {
  regions,
  cities,
  Districts,
} from "@/app/(storeFront)/components/shared/SomLocs/SomaliaRegions";
import {
  FiBell,
  FiLayers,
  FiDollarSign,
  FiCheckCircle,
  FiLoader,
  FiActivity,
  FiChevronDown,
} from "react-icons/fi";
import { createSubscription } from "@/actions/categories/subscriptionsActions";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";

const CreateSubscription = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    mainCategory: "Marketplace",
    subcategory: "",
    region: "",
    city: "",
    district: "",
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const session = await apiService.verifySession();
        const id = session?._id || (session as any)?.user?.id;
        if (id) setUserId(id);
      } catch (err) {
        console.error("Auth required");
      }
    };
    checkSession();
  }, []);

  const filteredCities = useMemo(
    () => cities.filter((city) => city.regionId === formData.region),
    [formData.region],
  );

  const filteredDistricts = useMemo(
    () => Districts.find((d) => d.id === formData.city)?.subDistricts || [],
    [formData.city],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updates: any = { ...prev, [name]: value };
      if (name === "region") {
        updates.city = "";
        updates.district = "";
      }
      if (name === "city") {
        updates.district = "";
      }
      return updates;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return alert("Login required");
    setLoading(true);

    try {
      await createSubscription({
        userId,
        title: formData.title,
        category: formData.mainCategory,
        subCategory: formData.subcategory,
        region: regions.find((r) => r.id === formData.region)?.name || "",
        city: cities.find((c) => c.id === formData.city)?.name || "",
        priceMax: formData.price,
        description: formData.description,
      });

      alert("Watchman active!");
    } catch (err: any) {
      alert(err.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-10 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden font-sans">
      <div className="bg-gray-900 p-8 text-white flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
            <FiBell size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              Search Watchman
            </h2>
            <div className="flex items-center gap-2 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
              <FiActivity className="animate-pulse" /> Live Scanner Active
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Alert Label
            </label>
            <input
              required
              name="title"
              placeholder="e.g. Toyota Aqua"
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none focus:ring-2 focus:ring-blue-600 font-bold"
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Main Category
            </label>
            <div className="relative">
              <FiLayers className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                name="mainCategory"
                value={formData.mainCategory}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none appearance-none font-bold"
                onChange={handleChange}
              >
                {allCategories.map((cat) => (
                  <option key={cat.key} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <FiChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Sub-Category
            </label>
            <select
              name="subcategory"
              required
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold"
              onChange={handleChange}
            >
              <option value="">Choose Type...</option>
              {allCategories
                .find((c) => c.name === formData.mainCategory)
                ?.subCategories?.map((sub: any) => (
                  <option key={sub.title || sub.key} value={sub.title}>
                    {sub.title} ({sub.so})
                  </option>
                ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Max Budget ($)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="number"
                required
                name="price"
                placeholder="5000"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none font-bold"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Region
            </label>
            <select
              required
              name="region"
              value={formData.region}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold appearance-none"
              onChange={handleChange}
            >
              <option value="">Select Region</option>
              {regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              City
            </label>
            <select
              required
              name="city"
              value={formData.city}
              disabled={!formData.region}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold appearance-none disabled:opacity-50"
              onChange={handleChange}
            >
              <option value="">Select City</option>
              {filteredCities.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              District
            </label>
            <select
              name="district"
              value={formData.district}
              disabled={!formData.city}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold appearance-none disabled:opacity-50"
              onChange={handleChange}
            >
              <option value="">Select District</option>
              {filteredDistricts.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !userId}
          className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.97] disabled:opacity-50 shadow-2xl"
        >
          {loading ? (
            <FiLoader className="animate-spin" />
          ) : (
            <FiCheckCircle size={22} />
          )}
          {loading ? "INITIALIZING..." : "START SCANNER"}
        </button>
      </form>
    </div>
  );
};

export default CreateSubscription;
