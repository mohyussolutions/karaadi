"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { apiService } from "@/actions/core/authAction";

export default function MarketplaceCreate() {
  const [title, setTitle] = useState("");
  const [so, setSo] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [subDistrict, setSubDistrict] = useState("");
  const [images, setImages] = useState("");
  const [extra, setExtra] = useState("");
  const [maGaday, setMaGaday] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [categoryList, setCategoryList] = useState<string[]>([]);
  const [categoryInput, setCategoryInput] = useState("");
  const [subcategoryList, setSubcategoryList] = useState<string[]>([]);
  const [subcategoryInput, setSubcategoryInput] = useState("");
  const [imagesList, setImagesList] = useState<string[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  function addCategory() {
    const v = categoryInput.trim();
    if (!v) return;
    setCategoryList((s) => [...s, v]);
    setCategoryInput("");
  }
  function removeCategory(idx: number) {
    setCategoryList((s) => s.filter((_, i) => i !== idx));
  }
  function addSubcategory() {
    const v = subcategoryInput.trim();
    if (!v) return;
    setSubcategoryList((s) => [...s, v]);
    setSubcategoryInput("");
  }
  function removeSubcategory(idx: number) {
    setSubcategoryList((s) => s.filter((_, i) => i !== idx));
  }
  function addImage() {
    const v = imageInput.trim();
    if (!v) return;
    setImagesList((s) => [...s, v]);
    setImageInput("");
  }
  function removeImage(idx: number) {
    setImagesList((s) => s.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: string[] = [];
    const parsedPrice = parseFloat(price);
    const categoryArr = categoryList.length ? categoryList : category.split(",").map((s) => s.trim()).filter(Boolean);
    const subcategoryArr = subcategoryList.length ? subcategoryList : subcategory.split(",").map((s) => s.trim()).filter(Boolean);
    const imagesArr = imagesList.length ? imagesList : images.split(",").map((s) => s.trim()).filter(Boolean);

    if (!title.trim()) nextErrors.push("Title is required.");
    if (!description.trim()) nextErrors.push("Description is required.");
    if (Number.isNaN(parsedPrice)) nextErrors.push("Price must be a valid number.");
    if (!mainCategory.trim()) nextErrors.push("Main category is required.");
    if (categoryArr.length === 0) nextErrors.push("At least one category is required (comma-separated).");
    if (!region.trim()) nextErrors.push("Region is required.");
    if (!city.trim()) nextErrors.push("City is required.");
    if (!district.trim()) nextErrors.push("District is required.");
    if (imagesArr.length === 0) nextErrors.push("At least one image URL is required (comma-separated).");

    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }
    const obj = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      so: so || null,
      description,
      price: parsedPrice || 0,
      mainCategory,
      category: categoryArr,
      subcategory: subcategoryArr,
      region,
      city,
      district,
      subDistrict: subDistrict || null,
      images: imagesArr,
      extra: (() => {
        try { return extra ? JSON.parse(extra) : null; } catch { return null; }
      })(),
      maGaday,
      isPaid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${BASE_API_URL}/api/marketplace`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) throw new Error("Failed to create marketplace item");
      setErrors([]);
      alert("Marketplace item created");
    } catch (err) {
      console.error(err);
      alert("Failed to create marketplace item");
    }
  }

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

  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold mb-4">Create Marketplace</h2>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
        {errors.length > 0 && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded">
            <ul className="list-disc pl-5">
              {errors.map((err, i) => (<li key={i}>{err}</li>))}
            </ul>
          </div>
        )}
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <input value={so} onChange={(e)=>setSo(e.target.value)} placeholder="SO (optional)" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
        <input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" className="w-full p-2 border rounded" />
        <input value={mainCategory} onChange={(e)=>setMainCategory(e.target.value)} placeholder="Main Category" className="w-full p-2 border rounded" />
        <div>
          <label className="block text-sm font-medium mb-1">Categories</label>
          <div className="flex gap-2">
            <input value={categoryInput} onChange={(e)=>setCategoryInput(e.target.value)} placeholder="Add category" className="flex-1 p-2 border rounded" />
            <button type="button" onClick={addCategory} className="px-3 py-2 bg-gray-200 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {categoryList.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                {c}
                <button type="button" onClick={()=>removeCategory(i)} className="text-xs text-red-600">x</button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Subcategories</label>
          <div className="flex gap-2">
            <input value={subcategoryInput} onChange={(e)=>setSubcategoryInput(e.target.value)} placeholder="Add subcategory" className="flex-1 p-2 border rounded" />
            <button type="button" onClick={addSubcategory} className="px-3 py-2 bg-gray-200 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {subcategoryList.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                {c}
                <button type="button" onClick={()=>removeSubcategory(i)} className="text-xs text-red-600">x</button>
              </span>
            ))}
          </div>
        </div>
        <input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="Region" className="w-full p-2 border rounded" />
        <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
        <input value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="District" className="w-full p-2 border rounded" />
        <input value={subDistrict} onChange={(e)=>setSubDistrict(e.target.value)} placeholder="Sub District (optional)" className="w-full p-2 border rounded" />

        <div>
          <label className="block text-sm font-medium mb-1">Images (URLs)</label>
          <div className="flex gap-2">
            <input value={imageInput} onChange={(e)=>setImageInput(e.target.value)} placeholder="Add image URL" className="flex-1 p-2 border rounded" />
            <button type="button" onClick={addImage} className="px-3 py-2 bg-gray-200 rounded">Add</button>
          </div>
          <div className="flex gap-2 flex-wrap mt-2">
            {imagesList.map((img, i) => (
              <span key={i} className="inline-flex items-center gap-2 bg-gray-100 px-2 py-1 rounded">
                <a href={img} target="_blank" rel="noreferrer" className="underline text-blue-600">{img}</a>
                <button type="button" onClick={()=>removeImage(i)} className="text-xs text-red-600">x</button>
              </span>
            ))}
          </div>
        </div>
        <textarea value={extra} onChange={(e)=>setExtra(e.target.value)} placeholder='Extra JSON (optional) e.g. {"k": "v"}' className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={maGaday} onChange={(e)=>setMaGaday(e.target.checked)} /> maGaday</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={isPaid} onChange={(e)=>setIsPaid(e.target.checked)} /> isPaid</label>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
        </div>
      </form>
    </div>
  );
}

