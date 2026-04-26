"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { addCity } from "@/actions/categories/geoAction";
import { useTranslation } from "react-i18next";

export interface CityOption {
  id: string;
  name: string;
  regionId: string;
}

interface CitySelectProps {
  regionId: string;
  cities: CityOption[];
  value: string;
  onChange: (cityName: string) => void;
  onCitiesUpdate?: (cities: CityOption[]) => void;
  disabled?: boolean;
  placeholder?: string;
  label?: string;
  allowAdd?: boolean;
}

export default function CitySelect({
  regionId,
  cities,
  value,
  onChange,
  onCitiesUpdate,
  disabled,
  placeholder = "Select City",
  label = "City",
  allowAdd = true,
}: CitySelectProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [addingNew, setAddingNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [saving, setSaving] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setAddingNew(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearch("");
    setAddingNew(false);
    setNewName("");
  }, [regionId]);

  const filtered = useMemo(
    () =>
      cities.filter(
        (c) =>
          c.regionId === regionId &&
          c.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [cities, regionId, search],
  );

  const displayName = (c: CityOption) => c.name;

  const handleSelect = (c: CityOption) => {
    onChange(c.name);
    setOpen(false);
    setSearch("");
    setAddingNew(false);
  };

  const handleSaveNew = async () => {
    if (!newName.trim() || !regionId || saving) return;
    setSaving(true);
    try {
      const res: any = await addCity({ name: newName.trim(), regionId });
      if (res?.success && res.data) {
        const created: CityOption = {
          id: res.data.id,
          name: res.data.name,
          regionId: res.data.regionId ?? regionId,
        };
        onCitiesUpdate?.([...cities, created]);
        onChange(created.name);
        setNewName("");
        setAddingNew(false);
        setOpen(false);
      }
    } finally {
      setSaving(false);
    }
  };

  const isDisabled = disabled || !regionId;

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
          {label}
        </label>
      )}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !isDisabled && setOpen((p) => !p)}
          disabled={isDisabled}
          className="w-full text-left border-2 border-gray-100 bg-gray-50 p-4 rounded-2xl font-bold flex justify-between items-center disabled:opacity-40 focus:border-blue-500 transition-all"
        >
          <span className={value ? "text-gray-900" : "text-gray-400 font-semibold"}>
            {value || placeholder}
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {open && (
          <div className="absolute z-40 left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-2 border-b border-gray-50">
              <input
                autoFocus
                type="text"
                placeholder={t("citySelect.search")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold outline-none bg-gray-50 rounded-xl placeholder:text-gray-400 placeholder:font-normal"
              />
            </div>

            <div className="overflow-y-auto max-h-44">
              {filtered.length === 0 && !addingNew && (
                <p className="text-center text-xs text-gray-400 font-semibold py-4">
                  {t("citySelect.noResults")}
                </p>
              )}
              {filtered.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => handleSelect(c)}
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 font-bold text-sm border-b border-gray-50 last:border-0 transition-colors"
                >
                  {displayName(c)}
                </button>
              ))}
            </div>

            {allowAdd && (
              <div className="border-t border-gray-100">
                {!addingNew ? (
                  <button
                    type="button"
                    onClick={() => setAddingNew(true)}
                    className="w-full flex items-center gap-2 px-4 py-3 text-blue-600 font-black text-xs hover:bg-blue-50 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                    </svg>
                    {t("citySelect.addNew")}
                  </button>
                ) : (
                  <div className="flex gap-2 p-2">
                    <input
                      autoFocus
                      type="text"
                      placeholder={t("citySelect.newPlaceholder")}
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); handleSaveNew(); }
                        if (e.key === "Escape") { setAddingNew(false); setNewName(""); }
                      }}
                      className="flex-1 px-3 py-2 text-sm font-bold outline-none border-2 border-blue-200 rounded-xl bg-blue-50/60 placeholder:font-normal placeholder:text-gray-400"
                    />
                    <button
                      type="button"
                      onClick={handleSaveNew}
                      disabled={saving || !newName.trim()}
                      className="px-3 py-2 bg-blue-600 text-white text-xs font-black rounded-xl disabled:opacity-40 hover:bg-blue-700 transition-colors min-w-[44px]"
                    >
                      {saving ? (
                        <svg className="w-3.5 h-3.5 animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : t("citySelect.save")}
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAddingNew(false); setNewName(""); }}
                      className="px-3 py-2 bg-gray-100 text-gray-500 text-xs font-black rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
