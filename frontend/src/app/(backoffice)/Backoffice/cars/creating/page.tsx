"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { apiService } from "@/actions/core/authAction";

export default function CarCreate() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [so, setSo] = useState("");
	const [mainCategory, setMainCategory] = useState("");
	const [category, setCategory] = useState("");
	const [subcategory, setSubcategory] = useState("");
	const [listingType, setListingType] = useState("");
	const [brand, setBrand] = useState("");
	const [vehicleModel, setVehicleModel] = useState("");
	const [year, setYear] = useState("");
	const [mileage, setMileage] = useState("");
	const [transmission, setTransmission] = useState("");
	const [fuelType, setFuelType] = useState("");
	const [color, setColor] = useState("");
	const [region, setRegion] = useState("");
	const [city, setCity] = useState("");
	const [district, setDistrict] = useState("");
	const [subDistrict, setSubDistrict] = useState("");
	const [images, setImages] = useState("");

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
			description,
			price: parseFloat(price) || 0,
			so: so || null,
			mainCategory,
			category: category.split(",").map((s)=>s.trim()).filter(Boolean),
			subcategory: subcategory.split(",").map((s)=>s.trim()).filter(Boolean),
			listingType,
			brand,
			vehicleModel,
			year: year ? parseInt(year) : null,
			mileage: mileage ? parseInt(mileage) : null,
			transmission,
			fuelType,
			color,
			region,
			city,
			district,
			subDistrict,
			images: images.split(",").map((s)=>s.trim()).filter(Boolean),
			maGaday: false,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
			isPaid: false,
		};

		try {
			const res = await fetch(`${BASE_API_URL}/api/cars`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(obj),
			});
			if (!res.ok) throw new Error("Failed to create car");
			alert("Car created");
		} catch (err) {
			console.error(err);
			alert("Failed to create car");
		}
	}

	return (
		<div className="py-6">
			<h2 className="text-2xl font-bold mb-4">Create Car</h2>
			<form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
				<input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
				<textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
				<input value={price} onChange={(e)=>setPrice(e.target.value)} placeholder="Price" className="w-full p-2 border rounded" />
				<input value={so} onChange={(e)=>setSo(e.target.value)} placeholder="SO (optional)" className="w-full p-2 border rounded" />
				<input value={mainCategory} onChange={(e)=>setMainCategory(e.target.value)} placeholder="Main Category" className="w-full p-2 border rounded" />
				<input value={category} onChange={(e)=>setCategory(e.target.value)} placeholder="Category (comma-separated)" className="w-full p-2 border rounded" />
				<input value={subcategory} onChange={(e)=>setSubcategory(e.target.value)} placeholder="Subcategory (comma-separated)" className="w-full p-2 border rounded" />
				<input value={listingType} onChange={(e)=>setListingType(e.target.value)} placeholder="Listing Type" className="w-full p-2 border rounded" />
				<input value={brand} onChange={(e)=>setBrand(e.target.value)} placeholder="Brand" className="w-full p-2 border rounded" />
				<input value={vehicleModel} onChange={(e)=>setVehicleModel(e.target.value)} placeholder="Vehicle Model" className="w-full p-2 border rounded" />
				<div className="grid grid-cols-2 gap-2"><input value={year} onChange={(e)=>setYear(e.target.value)} placeholder="Year" className="p-2 border rounded" /><input value={mileage} onChange={(e)=>setMileage(e.target.value)} placeholder="Mileage" className="p-2 border rounded" /></div>
				<input value={transmission} onChange={(e)=>setTransmission(e.target.value)} placeholder="Transmission" className="w-full p-2 border rounded" />
				<input value={fuelType} onChange={(e)=>setFuelType(e.target.value)} placeholder="Fuel Type" className="w-full p-2 border rounded" />
				<input value={color} onChange={(e)=>setColor(e.target.value)} placeholder="Color" className="w-full p-2 border rounded" />
				<input value={region} onChange={(e)=>setRegion(e.target.value)} placeholder="Region" className="w-full p-2 border rounded" />
				<input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" className="w-full p-2 border rounded" />
				<input value={district} onChange={(e)=>setDistrict(e.target.value)} placeholder="District" className="w-full p-2 border rounded" />
				<input value={subDistrict} onChange={(e)=>setSubDistrict(e.target.value)} placeholder="Sub District (optional)" className="w-full p-2 border rounded" />
				<input value={images} onChange={(e)=>setImages(e.target.value)} placeholder="Images (comma-separated)" className="w-full p-2 border rounded" />
				<div><button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button></div>
			</form>
		</div>
	);
}


