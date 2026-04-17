"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisements,
} from "@/actions/categories/advertisementService";
import AdForm from "./AdForm";
import AdCard from "./AdCard";
import { emptyForm, type AdFormData, type AdItem } from "./types";

export default function AdvertisementManager() {
  const { user } = useAuth();
  const [ads, setAds] = useState<AdItem[]>([]);
  const [loading, setLoading] = useState(false);

  const currentUserId = user?._id || user?.id || "";

  const [sidebarForm, setSidebarForm] = useState<AdFormData>(
    emptyForm("sidebar", currentUserId),
  );
  const [sidebarEditingId, setSidebarEditingId] = useState<string | null>(null);

  const [bgForm, setBgForm] = useState<AdFormData>(
    emptyForm("background", currentUserId),
  );
  const [bgEditingId, setBgEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserId) {
      setSidebarForm((p) => ({ ...p, userId: currentUserId }));
      setBgForm((p) => ({ ...p, userId: currentUserId }));
    }
  }, [currentUserId]);

  const loadAds = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdvertisements();
      setAds(data || []);
    } catch {
      setAds([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAds();
  }, [loadAds]);

  const handleSubmit = async (
    e: React.FormEvent,
    form: AdFormData,
    editingId: string | null,
    setEditingId: (v: string | null) => void,
    setForm: (f: AdFormData) => void,
    position: string,
  ) => {
    e.preventDefault();
    const payload = { ...form, userId: currentUserId };
    try {
      setLoading(true);
      if (editingId) {
        await updateAdvertisement(editingId, payload);
        setEditingId(null);
      } else {
        await createAdvertisement(payload);
      }
      setForm(emptyForm(position, currentUserId));
      setTimeout(loadAds, 300);
    } catch {
      alert(editingId ? "Failed to update" : "Failed to create");
    }
  };

  const handleEdit = (ad: AdItem) => {
    const formData: AdFormData = {
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      link: ad.link,
      buttonText: ad.buttonText || "Learn More",
      position: ad.position,
      priority: ad.priority || 1,
      isActive: ad.isActive,
      userId: currentUserId,
    };
    if (ad.position === "sidebar") {
      setSidebarForm(formData);
      setSidebarEditingId(ad.id);
    } else {
      setBgForm(formData);
      setBgEditingId(ad.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this advertisement?")) return;
    try {
      setLoading(true);
      await deleteAdvertisement(id);
      setAds((prev) => prev.filter((a) => a.id !== id));
    } catch {
      alert("Failed to delete");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id: string, current: boolean) => {
    try {
      const ad = ads.find((a) => a.id === id);
      if (!ad) return;
      await updateAdvertisement(id, { ...ad, isActive: !current });
      setAds((prev) =>
        prev.map((a) => (a.id === id ? { ...a, isActive: !current } : a)),
      );
    } catch {
      alert("Failed to update status");
    }
  };

  const sidebarAds = ads.filter((a) => a.position === "sidebar");
  const bgAds = ads.filter((a) => a.position === "background");

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">
          Advertisement Manager
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Create and manage two types of ads: Sidebar (small card) and
          Background (full-width banner)
        </p>
      </header>

      {/* Create / Edit forms */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdForm
          position="sidebar"
          label="Sidebar Ad"
          hint="Small card shown beside listings"
          form={sidebarForm}
          setForm={setSidebarForm}
          editingId={sidebarEditingId}
          loading={loading}
          onSubmit={(e) =>
            handleSubmit(
              e,
              sidebarForm,
              sidebarEditingId,
              setSidebarEditingId,
              setSidebarForm,
              "sidebar",
            )
          }
          onCancelEdit={() => {
            setSidebarEditingId(null);
            setSidebarForm(emptyForm("sidebar", currentUserId));
          }}
        />
        <AdForm
          position="background"
          label="Background Ad"
          hint="Full-width banner shown across the website"
          form={bgForm}
          setForm={setBgForm}
          editingId={bgEditingId}
          loading={loading}
          onSubmit={(e) =>
            handleSubmit(
              e,
              bgForm,
              bgEditingId,
              setBgEditingId,
              setBgForm,
              "background",
            )
          }
          onCancelEdit={() => {
            setBgEditingId(null);
            setBgForm(emptyForm("background", currentUserId));
          }}
        />
      </div>

      {/* Ads list */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sidebar ads */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
              Sidebar Ads
            </span>
            <span className="text-xs text-gray-400">
              {sidebarAds.length} ad{sidebarAds.length !== 1 ? "s" : ""}
            </span>
            <button
              onClick={loadAds}
              disabled={loading}
              className="ml-auto text-xs text-gray-400 hover:text-gray-600"
            >
              ↻ Refresh
            </button>
          </div>
          <div className="space-y-3">
            {loading && sidebarAds.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Loading...
              </div>
            ) : sidebarAds.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-indigo-100 rounded-xl">
                No sidebar ads yet
              </div>
            ) : (
              sidebarAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>

        {/* Background ads */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Background Ads
            </span>
            <span className="text-xs text-gray-400">
              {bgAds.length} ad{bgAds.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="space-y-3">
            {loading && bgAds.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                Loading...
              </div>
            ) : bgAds.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm border-2 border-dashed border-emerald-100 rounded-xl">
                No background ads yet
              </div>
            ) : (
              bgAds.map((ad) => (
                <AdCard
                  key={ad.id}
                  ad={ad}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggle={handleToggle}
                  loading={loading}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
