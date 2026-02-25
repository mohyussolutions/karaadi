"use client";

import React, { useState, useEffect, useMemo } from "react";
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
} from "react-icons/fi";
import { createSubscription } from "@/actions/categories/subscriptionsActions";
import { allCategories } from "@/app/(links)/storeFrontLinks/categories";
import { verifySession } from "@/actions/core/authAction";

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

const CreateSubscription: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [showAddCity, setShowAddCity] = useState<boolean>(false);
  const [newCityName, setNewCityName] = useState<string>("");
  const [addingCity, setAddingCity] = useState<boolean>(false);
  const [selectedCities, setSelectedCities] = useState<SelectedCity[]>([]);
  const [citySearchTerm, setCitySearchTerm] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mainCategory: "Marketplace",
    subcategory: "",
    region: "",
    totalFee: "",
  });

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      try {
        const [regionsData, citiesData] = await Promise.all([
          getAllRegions(),
          getAllCities(),
        ]);
        setRegions(regionsData || []);
        setCities(citiesData || []);
      } catch (error) {
        console.error("Data fetch error");
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const checkSession = async (): Promise<void> => {
      try {
        const session = await verifySession();
        const id =
          session?._id || (session as any)?.id || (session as any)?.user?.id;
        if (id) setUserId(id);
      } catch (err) {
        console.error("Auth error");
      }
    };
    checkSession();
  }, []);

  const filteredCities = useMemo(
    () =>
      cities.filter(
        (city) =>
          city.regionId === formData.region &&
          !selectedCities.some((selected) => selected.id === city.id) &&
          city.name.toLowerCase().includes(citySearchTerm.toLowerCase()),
      ),
    [formData.region, cities, selectedCities, citySearchTerm],
  );

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updates: any = { ...prev, [name]: value };
      if (name === "region") {
        setSelectedCities([]);
      }
      return updates;
    });
  };

  const handleAddCityToList = (cityId: string, cityName: string): void => {
    if (!selectedCities.some((city) => city.id === cityId)) {
      setSelectedCities([...selectedCities, { id: cityId, name: cityName }]);
    }
    setCitySearchTerm("");
  };

  const handleRemoveCity = (cityId: string): void => {
    setSelectedCities(selectedCities.filter((city) => city.id !== cityId));
  };

  const handleAddCustomCity = async (): Promise<void> => {
    if (!newCityName.trim() || !formData.region) return;

    setAddingCity(true);
    try {
      const result = await addCity({
        id: `city_${Date.now()}`,
        name: newCityName.trim(),
        regionId: formData.region,
        isActive: true,
      });

      if (result.success && result.data) {
        const newCityData: City = {
          id: result.data.id,
          name: result.data.name,
          regionId: result.data.regionId,
        };
        setCities((prev) => [...prev, newCityData]);
        setSelectedCities((prev) => [
          ...prev,
          { id: newCityData.id, name: newCityData.name },
        ]);
        setShowAddCity(false);
        setNewCityName("");
      }
    } catch (error) {
      alert("Network error adding city");
    } finally {
      setAddingCity(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!userId) return alert("Please login first");
    if (selectedCities.length === 0)
      return alert("Please select at least one city");

    const selectedRegion = regions.find((r) => r.id === formData.region);
    if (!selectedRegion) return alert("Please select a region");

    setLoading(true);
    try {
      const cityNames = selectedCities.map((city) => city.name);
      const cityIds = selectedCities.map((city) => city.id);

      const result = await createSubscription({
        userId,
        title: formData.title,
        category: formData.mainCategory,
        subCategory: formData.subcategory,
        region: selectedRegion.name,
        cities: cityNames,
        cityIds: cityIds,
        description: formData.description || undefined,
        totalFee: formData.totalFee ? parseFloat(formData.totalFee) : undefined,
      });

      if (result.success) {
        alert(
          `Watchman alert created for ${selectedCities.length} location(s)! You will be notified when matching items are posted.`,
        );
        setFormData({
          title: "",
          description: "",
          mainCategory: "Marketplace",
          subcategory: "",
          region: "",
          totalFee: "",
        });
        setSelectedCities([]);
      } else {
        alert(result.message || "Error creating subscription");
      }
    } catch (err: any) {
      alert(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      <div className="w-full bg-gray-900 p-8 text-white flex items-center justify-between">
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

      <form onSubmit={handleSubmit} className="w-full p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
              Alert Label
            </label>
            <input
              required
              name="title"
              value={formData.title}
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
              value={formData.subcategory}
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
              Total Fee ($)
            </label>
            <div className="relative">
              <FiDollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" />
              <input
                type="number"
                name="totalFee"
                value={formData.totalFee}
                placeholder="0.00"
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4 outline-none font-bold"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              Cities
            </label>

            {selectedCities.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedCities.map((city) => (
                  <div
                    key={city.id}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2"
                  >
                    <FiMapPin size={14} />
                    {city.name}
                    <button
                      type="button"
                      onClick={() => handleRemoveCity(city.id)}
                      className="hover:text-red-600 transition-colors"
                    >
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
                  placeholder="Search cities..."
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-3 outline-none font-bold"
                />

                <div className="max-h-48 overflow-y-auto border border-gray-100 rounded-2xl">
                  {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleAddCityToList(city.id, city.name)}
                        className="w-full text-left px-5 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 font-medium transition-colors"
                      >
                        {city.name}
                      </button>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-gray-500 text-sm">
                      No cities found
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setShowAddCity(true)}
                  className="w-full mt-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 flex items-center justify-center gap-2"
                >
                  <FiPlus size={20} />
                  Add Custom City
                </button>
              </div>
            )}

            {showAddCity && (
              <div className="space-y-2">
                <input
                  type="text"
                  value={newCityName}
                  onChange={(e) => setNewCityName(e.target.value)}
                  placeholder="Enter custom city name"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 outline-none font-bold"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleAddCustomCity}
                    disabled={addingCity || !newCityName.trim()}
                    className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-2xl font-bold disabled:opacity-50 hover:bg-emerald-700"
                  >
                    {addingCity ? (
                      <FiLoader className="animate-spin mx-auto" />
                    ) : (
                      "Add City"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddCity(false);
                      setNewCityName("");
                    }}
                    className="px-4 py-3 bg-gray-600 text-white rounded-2xl font-bold hover:bg-gray-700"
                  >
                    <FiX size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
            Notes
          </label>
          <textarea
            name="description"
            value={formData.description}
            rows={4}
            className="w-full bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 outline-none font-bold resize-none"
            onChange={handleChange}
            placeholder="Optional details about what you're looking for..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || !userId || selectedCities.length === 0}
          className="w-full bg-blue-600 text-white py-6 rounded-[1.5rem] font-black uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-blue-700 transition-all active:scale-[0.97] disabled:opacity-50 shadow-2xl text-lg"
        >
          {loading ? (
            <FiLoader className="animate-spin" size={22} />
          ) : (
            <FiCheckCircle size={22} />
          )}
          {loading
            ? "Creating..."
            : `Create Watchman ${selectedCities.length > 0 ? `(${selectedCities.length} cities)` : ""}`}
        </button>
      </form>
    </div>
  );
};

export default CreateSubscription;
