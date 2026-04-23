"use client";

import React from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import type { AdFormData } from "./types";

interface AdFormProps {
  position: string;
  label: string;
  hint: string;
  form: AdFormData;
  setForm: (f: AdFormData) => void;
  editingId: string | null;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit: () => void;
}

export default function AdForm({
  position,
  label,
  hint,
  form,
  setForm,
  editingId,
  loading,
  onSubmit,
  onCancelEdit,
}: AdFormProps) {
  const { t } = useTranslation();
  const isEditing = !!editingId;
  const isSidebar = position === "sidebar";

  return (
    <div
      className={`bg-white rounded-2xl border-2 shadow-sm ${isSidebar ? "border-indigo-100" : "border-emerald-100"}`}
    >
      <div
        className={`px-6 py-4 rounded-t-2xl flex items-center gap-3 ${isSidebar ? "bg-indigo-50" : "bg-emerald-50"}`}
      >
        <span
          className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${isSidebar ? "bg-indigo-600 text-white" : "bg-emerald-600 text-white"}`}
        >
          {label}
        </span>
        <span className="text-xs text-gray-500">{hint}</span>
      </div>

      <div className="p-6">
        <div className="mb-6">
          {isSidebar ? (
            <div className="w-48 border-2 border-dashed border-indigo-200 rounded-xl p-3 bg-indigo-50/40 flex flex-col gap-2">
              <div className="w-full h-24 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {form.imageUrl ? (
                  <Image
                    src={
                      /^https?:\/\//.test(form.imageUrl)
                        ? form.imageUrl
                        : "https://placehold.co/200x100?text=Preview"
                    }
                    alt="preview"
                    width={192}
                    height={96}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-xs text-gray-400">Image preview</span>
                )}
              </div>
              <p className="text-xs font-bold text-gray-700 truncate">
                {form.title || "Ad Title"}
              </p>
              <p className="text-[10px] text-gray-400 line-clamp-2">
                {form.description || "Description..."}
              </p>
              <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-md self-start">
                {form.buttonText || "Learn More"}
              </span>
            </div>
          ) : (
            <div className="w-full h-28 border-2 border-dashed border-emerald-200 rounded-xl overflow-hidden relative flex items-center justify-center bg-gray-900">
              {form.imageUrl && /^https?:\/\//.test(form.imageUrl) && (
                <Image
                  src={form.imageUrl}
                  alt="preview"
                  fill
                  className="object-cover opacity-50"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              )}
              <div className="relative z-10 text-center px-4">
                <p className="text-white font-bold text-sm drop-shadow">
                  {form.title || "Background Ad Title"}
                </p>
                <p className="text-white/70 text-xs mt-1">
                  {form.description || "Subtitle / tagline"}
                </p>
                <span className="inline-block mt-2 text-[10px] bg-emerald-500 text-white px-3 py-0.5 rounded-full">
                  {form.buttonText || "Learn More"}
                </span>
              </div>
            </div>
          )}
          <p className="text-[10px] text-gray-400 mt-1">{t("adminTable.livePreview")}</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              placeholder="Title *"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              placeholder="Image URL *"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              placeholder="Link URL (e.g. https://example.com) *"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <input
              placeholder="Button Text"
              value={form.buttonText}
              onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
              className="border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <textarea
            placeholder="Description *"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
            rows={2}
            required
          />
          <div className="flex items-center gap-4">
            <input
              type="number"
              placeholder="Priority (1–10)"
              value={form.priority}
              onChange={(e) =>
                setForm({ ...form, priority: parseInt(e.target.value) || 1 })
              }
              className="border rounded-lg px-3 py-2 text-sm w-36 outline-none focus:ring-2 focus:ring-indigo-400"
              min="1"
              max="10"
            />
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-4 w-4"
              />
              {t("adminTable.active")}
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={loading}
              className={`px-5 py-2 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 ${isSidebar ? "bg-indigo-600 hover:bg-indigo-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
            >
              {loading
                ? t("adminTable.saving")
                : isEditing
                  ? `${t("adminTable.update")} ${label}`
                  : `${t("adminTable.create")} ${label}`}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                {t("adminTable.cancel")}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
