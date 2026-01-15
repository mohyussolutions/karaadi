"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { apiService } from "@/actions/core/authAction";

export default function BoatCreate() {
  const [title, setTitle] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [so, setSo] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState("");
  const [typeVal, setTypeVal] = useState("");
  const [boatModel, setBoatModel] = useState("");
  const [transmission, setTransmission] = useState("");
  const [color, setColor] = useState("");

  const [currentUserId, setCurrentUserId] = useState<string>(FIXED_USER_ID);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const u = await apiService.verifySession();
        if (mounted) setCurrentUserId(u?._id ?? FIXED_USER_ID);
      } catch {
        if (mounted) setCurrentUserId(FIXED_USER_ID);
      }
    })();
    return () => { mounted = false; };
  }, []);


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const obj = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      mainCategory,
      category: category.split(",").map((s) => s.trim()).filter(Boolean),
      subcategory: subcategory.split(",").map((s) => s.trim()).filter(Boolean),
      region,
      city,
      so: so || null,
      district,
      subDistrict: subDistrict || null,
      description,
      price: parseFloat(price) || 0,
      images: images.split(",").map((s) => s.trim()).filter(Boolean),
      type: typeVal,
      boatModel,
      transmission,
      color,
      listingType: null,
      maGaday: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isPaid: false,
    };

    try {
      const res = await fetch(`${BASE_API_URL}/api/boats`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Failed to create boat: ${res.status} ${body}`);
      }
      alert("Boat created");
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Failed to create boat");
    }
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Create Boat</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <input value={mainCategory} onChange={(e)=>setMainCategory(e.target.value)} placeholder="Main Category" className="w-full p-2 border rounded" />
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (comma-separated)" className="w-full p-2 border rounded" />
        <input value={subcategory} onChange={(e)=>setSubcategory(e.target.value)} placeholder="Subcategory (comma-separated)" className="w-full p-2 border rounded" />
        <input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="Region" className="w-full p-2 border rounded" />
        <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
        <input value={so} onChange={(e)=>setSo(e.target.value)} placeholder="SO (optional)" className="w-full p-2 border rounded" />
        <input value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="District" className="w-full p-2 border rounded" />
        <input value={subDistrict} onChange={(e)=>setSubDistrict(e.target.value)} placeholder="Sub District (optional)" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded" />
        <input value={images} onChange={(e)=>setImages(e.target.value)} placeholder="Images (comma-separated)" className="w-full p-2 border rounded" />
        <input value={typeVal} onChange={(e)=>setTypeVal(e.target.value)} placeholder="Type" className="w-full p-2 border rounded" />
        <input value={boatModel} onChange={(e)=>setBoatModel(e.target.value)} placeholder="Boat Model" className="w-full p-2 border rounded" />
        <input value={transmission} onChange={(e)=>setTransmission(e.target.value)} placeholder="Transmission" className="w-full p-2 border rounded" />
        <input value={color} onChange={(e)=>setColor(e.target.value)} placeholder="Color" className="w-full p-2 border rounded" />
        <div><button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button></div>
      </form>
    </div>
  );
}

