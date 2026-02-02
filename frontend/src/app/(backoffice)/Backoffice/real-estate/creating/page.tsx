"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { verifySession } from "@/actions/core/authAction";

export default function RealEstateCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [address, setAddress] = useState("");
  const [hasGarage, setHasGarage] = useState(false);
  const [hasGarden, setHasGarden] = useState(false);
  const [region, setRegion] = useState("");
  const [so, setSo] = useState("");
  const [city, setCity] = useState("");
  const [county, setCounty] = useState("");
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
      bedrooms: bedrooms ? parseInt(bedrooms) : null,
      bathrooms: bathrooms ? parseInt(bathrooms) : null,
      squareFeet: squareFeet ? parseInt(squareFeet) : null,
      address,
      hasGarage,
      hasGarden,
      region,
      so: so || null,
      city,
      county,
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
      const res = await fetch(`${BASE_API_URL}/api/properties`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) throw new Error("Failed to create property");
      alert("Real estate created");
    } catch (err) {
      console.error(err);
      alert("Failed to create real estate");
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
      <h2 className="text-2xl font-bold mb-4">Create Real Estate</h2>
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
        <div className="grid grid-cols-2 gap-2">
          <input
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            placeholder="Bedrooms"
            className="p-2 border rounded"
          />
          <input
            value={bathrooms}
            onChange={(e) => setBathrooms(e.target.value)}
            placeholder="Bathrooms"
            className="p-2 border rounded"
          />
        </div>
        <input
          value={squareFeet}
          onChange={(e) => setSquareFeet(e.target.value)}
          placeholder="Square Feet"
          className="w-full p-2 border rounded"
        />
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Address"
          className="w-full p-2 border rounded"
        />
        <div className="flex gap-2 items-center">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasGarage}
              onChange={(e) => setHasGarage(e.target.checked)}
            />{" "}
            Has Garage
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasGarden}
              onChange={(e) => setHasGarden(e.target.checked)}
            />{" "}
            Has Garden
          </label>
        </div>
        <input
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          placeholder="Region"
          className="w-full p-2 border rounded"
        />
        <input
          value={so}
          onChange={(e) => setSo(e.target.value)}
          placeholder="SO (optional)"
          className="w-full p-2 border rounded"
        />
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City"
          className="w-full p-2 border rounded"
        />
        <input
          value={county}
          onChange={(e) => setCounty(e.target.value)}
          placeholder="County"
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
