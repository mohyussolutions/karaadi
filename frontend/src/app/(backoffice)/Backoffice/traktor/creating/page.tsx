"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { verifySession } from "@/actions/core/authAction";

export default function TraktorCreatingPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [so, setSo] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [make, setMake] = useState("");
  const [traktortModel, setTraktortModel] = useState("");
  const [year, setYear] = useState("");
  const [conditionVal, setConditionVal] = useState("");
  const [hours, setHours] = useState("");
  const [enginePower, setEnginePower] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [images, setImages] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const obj = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      description,
      price: parseFloat(price) || 0,
      mainCategory,
      category: category
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      subcategory: subcategory
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      so: so || null,
      type: typeVal,
      make,
      traktortModel,
      year: year ? parseInt(year) : null,
      condition: conditionVal,
      hours: hours ? parseInt(hours) : null,
      enginePower,
      fuelType,
      region,
      city,
      district,
      subDistrict,
      images: images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      maGaday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPaid: false,
    };

    try {
      const res = await fetch(`${BASE_API_URL}/api/traktors`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) throw new Error("Failed to create traktor");
      alert("Traktor created");
    } catch (err) {
      console.error(err);
      alert("Failed to create traktor");
    }
  }

  const [currentUserId, setCurrentUserId] = useState<string>(FIXED_USER_ID);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await verifySession();
        if (mounted) setCurrentUserId(u?._id ?? FIXED_USER_ID);
      } catch {
        if (mounted) setCurrentUserId(FIXED_USER_ID);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Create Traktor</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded"
        />
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        <input
          value={mainCategory}
          onChange={(e) => setMainCategory(e.target.value)}
          placeholder="Main Category"
          className="w-full p-2 border rounded"
        />
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Category (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <input
          value={subcategory}
          onChange={(e) => setSubcategory(e.target.value)}
          placeholder="Subcategory (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <input
          value={so}
          onChange={(e) => setSo(e.target.value)}
          placeholder="SO (optional)"
          className="w-full p-2 border rounded"
        />
        <input
          value={typeVal}
          onChange={(e) => setTypeVal(e.target.value)}
          placeholder="Type"
          className="w-full p-2 border rounded"
        />
        <input
          value={make}
          onChange={(e) => setMake(e.target.value)}
          placeholder="Make"
          className="w-full p-2 border rounded"
        />
        <input
          value={traktortModel}
          onChange={(e) => setTraktortModel(e.target.value)}
          placeholder="Traktor Model"
          className="w-full p-2 border rounded"
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-2 border rounded"
          />
          <input
            value={conditionVal}
            onChange={(e) => setConditionVal(e.target.value)}
            placeholder="Condition"
            className="p-2 border rounded"
          />
          <input
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            placeholder="Hours"
            className="p-2 border rounded"
          />
        </div>
        <input
          value={enginePower}
          onChange={(e) => setEnginePower(e.target.value)}
          placeholder="Engine Power"
          className="w-full p-2 border rounded"
        />
        <input
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          placeholder="Fuel Type"
          className="w-full p-2 border rounded"
        />
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
          className="w-full p-2 border rounded"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full p-2 border rounded"
        />
        <input
          value={district}
          onChange={(e) => setDistrict(e.target.value)}
          placeholder="District"
          className="w-full p-2 border rounded"
        />
        <input
          value={subDistrict}
          onChange={(e) => setSubDistrict(e.target.value)}
          placeholder="Sub District"
          className="w-full p-2 border rounded"
        />
        <input
          value={images}
          onChange={(e) => setImages(e.target.value)}
          placeholder="Images (comma-separated)"
          className="w-full p-2 border rounded"
        />
        <div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Create
          </button>
        </div>
      </form>
    </div>
  );
}
