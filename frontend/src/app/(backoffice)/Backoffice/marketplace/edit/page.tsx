"use client";

import React, { useEffect, useState } from "react";
import { loadBackofficeItems, loadBackofficeItemById, updateBackofficeItem } from "../../lib/storage";

export default function MarketplaceEditPage() {
  const [items, setItems] = useState<Array<any>>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [so, setSo] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState<string | null>(null);
  const [images, setImages] = useState("");
  const [extra, setExtra] = useState("");
  const [maGaday, setMaGaday] = useState(false);

  useEffect(() => {
    setItems(loadBackofficeItems("marketplace"));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    const it = loadBackofficeItemById("marketplace", selectedId);
    if (!it) return;
    setTitle(it.title || "");
    setSo(it.so ?? null);
    setDescription(it.description || "");
    setPrice(String(it.price ?? ""));
    setMainCategory(it.mainCategory || "");
    setCategory((it.category || []).join(","));
    setSubcategory((it.subcategory || []).join(","));
    setRegion(it.region || "");
    setCity(it.city || "");
    setDistrict(it.district || "");
    setSubDistrict(it.subDistrict ?? null);
    setImages((it.images || []).join(","));
    setExtra(it.extra ? JSON.stringify(it.extra) : "");
    setMaGaday(!!it.maGaday);
  }, [selectedId]);

  function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId) {
      alert("Select an item to edit first");
      return;
    }
    let parsedExtra = null;
    try { parsedExtra = extra ? JSON.parse(extra) : null; } catch { parsedExtra = null; }

    const obj = {
      id: selectedId,
      title,
      so: so || null,
      description,
      price: parseFloat(price) || 0,
      mainCategory,
      category: category.split(",").map((s)=>s.trim()).filter(Boolean),
      subcategory: subcategory.split(",").map((s)=>s.trim()).filter(Boolean),
      region,
      city,
      district,
      subDistrict: subDistrict || null,
      images: images.split(",").map((s)=>s.trim()).filter(Boolean),
      extra: parsedExtra,
      maGaday,
      updatedAt: new Date().toISOString(),
    };

    updateBackofficeItem("marketplace", obj);
    setItems(loadBackofficeItems("marketplace"));
    alert("Marketplace item updated (local demo)");
  }

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Edit Marketplace Item</h2>
      <div className="mb-4">
        <label className="block text-sm mb-2">Select item</label>
        <select className="p-2 border rounded w-full" value={selectedId ?? ""} onChange={(e)=>setSelectedId(e.target.value || null)}>
          <option value="">-- choose --</option>
          {items.map((it) => (
            <option key={it.id} value={it.id}>{it.title || it.id}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleUpdate} className="space-y-3 max-w-2xl">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <input value={so ?? ""} onChange={(e)=>setSo(e.target.value)} placeholder="SO (optional)" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded" />
        <input value={mainCategory} onChange={(e)=>setMainCategory(e.target.value)} placeholder="Main Category" className="w-full p-2 border rounded" />
        <input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (comma-separated)" className="w-full p-2 border rounded" />
        <input value={subcategory} onChange={(e)=>setSubcategory(e.target.value)} placeholder="Subcategory (comma-separated)" className="w-full p-2 border rounded" />
        <input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="Region" className="w-full p-2 border rounded" />
        <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
        <input value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="District" className="w-full p-2 border rounded" />
        <input value={subDistrict ?? ""} onChange={(e)=>setSubDistrict(e.target.value)} placeholder="Sub District (optional)" className="w-full p-2 border rounded" />
        <input value={images} onChange={(e)=>setImages(e.target.value)} placeholder="Images (comma-separated URLs)" className="w-full p-2 border rounded" />
        <textarea value={extra} onChange={(e)=>setExtra(e.target.value)} placeholder='Extra JSON (optional) e.g. {"k": "v"}' className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={maGaday} onChange={(e)=>setMaGaday(e.target.checked)} /> maGaday</label>
        <div><button className="px-4 py-2 bg-green-600 text-white rounded">Update</button></div>
      </form>
    </div>
  );
}

