"use client";

import React, { useEffect, useState } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { verifySession } from "@/actions/core/authAction";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

export default function MotorcycleCreate() {
  const [title, setTitle] = useState("");
  const [transmission, setTransmission] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [price, setPrice] = useState("");
  const [so, setSo] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [images, setImages] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [make, setMake] = useState("");
  const [modelName, setModelName] = useState("");
  const [year, setYear] = useState("");
  const [mileage, setMileage] = useState("");
  const [engineSize, setEngineSize] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [color, setColor] = useState("");
  const [description, setDescription] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const obj = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      transmission,
      mainCategory,
      category: category
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      subcategory: subcategory
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      price: parseFloat(price) || 0,
      so: so || null,
      region,
      city,
      district,
      subDistrict,
      images: images
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      type: typeVal,
      make,
      modelName,
      year: year ? parseInt(year) : null,
      mileage: mileage ? parseInt(mileage) : null,
      engineSize,
      fuelType,
      color,
      description,
      maGaday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPaid: false,
    };

    try {
      const res = await fetch(`${BASE_API_URL}/api/motorcycles`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) throw new Error("Failed to create motorcycle");
      alert("Motorcycle created");
    } catch (err) {
      console.error(err);
      alert("Failed to create motorcycle");
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
      <h2 className="text-2xl font-bold mb-4">Create Motorcycle</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded"
        />
        <input
          value={transmission}
          onChange={(e) => setTransmission(e.target.value)}
          placeholder="Transmission"
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
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full p-2 border rounded"
        />
        <input
          value={so}
          onChange={(e) => setSo(e.target.value)}
          placeholder="SO (optional)"
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
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
          placeholder="Model Name"
          className="w-full p-2 border rounded"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Year"
            className="p-2 border rounded"
          />
          <input
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            placeholder="Mileage"
            className="p-2 border rounded"
          />
        </div>
        <input
          value={engineSize}
          onChange={(e) => setEngineSize(e.target.value)}
          placeholder="Engine Size"
          className="w-full p-2 border rounded"
        />
        <input
          value={fuelType}
          onChange={(e) => setFuelType(e.target.value)}
          placeholder="Fuel Type"
          className="w-full p-2 border rounded"
        />
        <input
          value={color}
          onChange={(e) => setColor(e.target.value)}
          placeholder="Color"
          className="w-full p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
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
