"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppDispatch } from "@/store/slices/hooks/hooks";
import { createWantedPost } from "@/store/slices/reducers/wantedSlice";
import { useRouter } from "next/navigation";
import { allCategories } from "@/app/(links)/storeFrontLinks/mainCategotyCategorySubCategory";

const EXPIRY_OPTIONS = [
  { label: "7 days", value: 7 },
  { label: "15 days", value: 15 },
  { label: "30 days", value: 30 },
];

const CreateWantedPage = () => {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [bannerVisible, setBannerVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    category: "",
    title: "",
    details: "",
    location: "",
    maxBudget: "",
    expiryDays: 7,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const userId: string = user.id || user._id || user.sub;
    const userName: string = user.name || user.username || "";
    const userAvatar: string = user.avatar || user.profileImage || "";

    const expiresAt = new Date(
      Date.now() + form.expiryDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    setSubmitting(true);
    try {
      await dispatch(
        createWantedPost({
          userId,
          userName,
          userAvatar,
          category: form.category,
          title: form.title,
          details: form.details,
          location: form.location,
          maxBudget: form.maxBudget ? Number(form.maxBudget) : 0,
          expiresAt,
          active: true,
        }),
      ).unwrap();

      setBannerVisible(true);
      setTimeout(() => {
        setBannerVisible(false);
        router.push("/wanted");
      }, 1800);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-10 px-4 max-w-2xl mx-auto">
      {bannerVisible && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg">
          Your wanted post is live
        </div>
      )}

      <h1 className="text-2xl font-black text-gray-900 mb-8">
        Post a <span className="text-blue-600">Wanted</span> Ad
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Category
          </label>
          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {allCategories.map((cat) => (
              <option key={cat.key} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Title{" "}
            <span className="normal-case text-gray-400">(max 100 chars)</span>
          </label>
          <input
            name="title"
            required
            maxLength={100}
            value={form.title}
            onChange={handleChange}
            placeholder="What are you looking for?"
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Details{" "}
            <span className="normal-case text-gray-400">(max 500 chars)</span>
          </label>
          <textarea
            name="details"
            maxLength={500}
            value={form.details}
            onChange={handleChange}
            rows={4}
            placeholder="Describe what you need..."
            className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Location
            </label>
            <input
              name="location"
              required
              value={form.location}
              onChange={handleChange}
              placeholder="City or region"
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
              Max Budget ($)
            </label>
            <input
              name="maxBudget"
              type="number"
              min={0}
              value={form.maxBudget}
              onChange={handleChange}
              placeholder="0"
              className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 font-semibold text-gray-900 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5">
            Expires In
          </label>
          <div className="flex gap-3">
            {EXPIRY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() =>
                  setForm((prev) => ({ ...prev, expiryDays: opt.value }))
                }
                className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-colors ${
                  form.expiryDays === opt.value
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-200 text-gray-700 hover:border-blue-300"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting || !user}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-700 transition-colors disabled:opacity-50 shadow-lg shadow-blue-100"
        >
          {submitting ? "Posting..." : "Post Wanted Ad"}
        </button>
      </form>
    </div>
  );
};

export default CreateWantedPage;
