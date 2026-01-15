"use client";

import React, { useState, useEffect } from "react";
import { FIXED_USER_ID } from "../../lib/storage";
import { ADVERTISEMENT_ENDPOINTS } from "@/actions/constant/constant";
import { apiService } from "@/actions/core/authAction";

export default function AdvertisementCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [link, setLink] = useState("");
  const [buttonText, setButtonText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [position, setPosition] = useState("general");
  const [priority, setPriority] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const obj = {
      id: Date.now().toString(),
      userId: currentUserId,
      title,
      description,
      imageUrl,
      link,
      buttonText: buttonText || null,
      isActive,
      position,
      priority: parseInt(priority) || 1,
      startDate: startDate || null,
      endDate: endDate || null,
      clicks: 0,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(ADVERTISEMENT_ENDPOINTS.CREATE, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj),
      });
      if (!res.ok) throw new Error("Failed to create advertisement");
      alert("Advertisement created");
    } catch (err) {
      console.error(err);
      alert("Failed to create advertisement");
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
      <h2 className="text-2xl font-bold mb-4">Create Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl">
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea value={description} onChange={(e)=>setDescription(e.target.value)} placeholder="Description" className="w-full p-2 border rounded" />
        <input value={imageUrl} onChange={(e)=>setImageUrl(e.target.value)} placeholder="Image URL" className="w-full p-2 border rounded" />
        <input value={link} onChange={(e)=>setLink(e.target.value)} placeholder="Link" className="w-full p-2 border rounded" />
        <input value={buttonText} onChange={(e)=>setButtonText(e.target.value)} placeholder="Button Text (optional)" className="w-full p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" checked={isActive} onChange={(e)=>setIsActive(e.target.checked)} /> Active</label>
        <input value={position} onChange={(e)=>setPosition(e.target.value)} placeholder="Position" className="w-full p-2 border rounded" />
        <input value={priority} onChange={(e)=>setPriority(e.target.value)} placeholder="Priority (number)" className="w-full p-2 border rounded" />
        <div className="grid grid-cols-2 gap-2"><input value={startDate} onChange={(e)=>setStartDate(e.target.value)} placeholder="Start Date (ISO)" className="p-2 border rounded" /><input value={endDate} onChange={(e)=>setEndDate(e.target.value)} placeholder="End Date (ISO)" className="p-2 border rounded" /></div>
        <div><button className="px-4 py-2 bg-blue-600 text-white rounded">Create</button></div>
      </form>
    </div>
  );
}
