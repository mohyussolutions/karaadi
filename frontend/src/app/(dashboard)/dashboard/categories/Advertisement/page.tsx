"use client";

import {
  createAdvertisement,
  updateAdvertisement,
  deleteAdvertisement,
  getAdvertisements,
} from "@/actions/categories/advertisementService";
import React, { useState, useEffect } from "react";
import { apiService } from "@/actions/core/authAction";

interface AdFormData {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  buttonText: string;
  position: string;
  priority: number;
  isActive: boolean;
  userId: string;
}

const AdvertisementManager = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<AdFormData>({
    id: "",
    title: "",
    description: "",
    imageUrl: "",
    link: "",
    buttonText: "Learn More",
    position: "sidebar",
    priority: 1,
    isActive: true,
    userId: "",
  });

  useEffect(() => {
    loadAds();
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    try {
      const user = await apiService.verifySession();
      if (user?._id) {
        setCurrentUserId(user._id);
        setForm((prev) => ({ ...prev, userId: user._id }));
      }
    } catch (error) {
      console.error("Failed to get user:", error);
    }
  };

  const loadAds = async () => {
    setLoading(true);
    try {
      const data = await getAdvertisements();
      setAds(data || []);
    } catch (error) {
      console.error("Failed to load ads:", error);
      setAds([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (ad: any) => {
    setEditingId(ad.id);
    setForm({
      id: ad.id,
      title: ad.title,
      description: ad.description,
      imageUrl: ad.imageUrl,
      link: ad.link,
      buttonText: ad.buttonText || "Learn More",
      position: ad.position || "sidebar",
      priority: ad.priority || 1,
      isActive: ad.isActive,
      userId: currentUserId,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserId) {
      alert("Please log in to create advertisements");
      return;
    }

    const formData = {
      ...form,
      userId: currentUserId,
      priority: form.priority || 1,
    };

    try {
      setLoading(true);

      if (editingId) {
        await updateAdvertisement(editingId, formData);
        setEditingId(null);
      } else {
        await createAdvertisement(formData);
      }

      setForm({
        id: "",
        title: "",
        description: "",
        imageUrl: "",
        link: "",
        buttonText: "Learn More",
        position: "sidebar",
        priority: 1,
        isActive: true,
        userId: currentUserId,
      });

      setTimeout(() => {
        loadAds();
      }, 300);
    } catch (error) {
      alert(
        editingId
          ? "Failed to update advertisement"
          : "Failed to create advertisement"
      );
      console.error("Save ad error:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      id: "",
      title: "",
      description: "",
      imageUrl: "",
      link: "",
      buttonText: "Learn More",
      position: "sidebar",
      priority: 1,
      isActive: true,
      userId: currentUserId,
    });
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this ad?")) {
      try {
        setLoading(true);
        await deleteAdvertisement(id);
        setAds((prev) => prev.filter((ad) => ad.id !== id));
        if (editingId === id) {
          handleCancelEdit();
        }
      } catch (error) {
        alert("Failed to delete advertisement");
        console.error("Delete ad error:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    try {
      const ad = ads.find((a) => a.id === id);
      if (!ad) return;

      const updatedAd = {
        ...ad,
        isActive: !currentStatus,
      };

      await updateAdvertisement(id, updatedAd);

      setAds((prev) =>
        prev.map((ad) =>
          ad.id === id ? { ...ad, isActive: !currentStatus } : ad
        )
      );
    } catch (error) {
      alert("Failed to update ad status");
      console.error("Toggle status error:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Manage Advertisements</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8"
      >
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Advertisement" : "Create New Advertisement"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Image URL"
            value={form.imageUrl}
            onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Link URL like al Jazeera.com"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="border p-2 rounded"
            required
          />
          <input
            placeholder="Button Text"
            value={form.buttonText}
            onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
            className="border p-2 rounded"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 rounded md:col-span-2"
            rows={3}
            required
          />
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="sidebar">Sidebar</option>
            <option value="background">Background</option>
          </select>
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Priority (1-10)"
              value={form.priority}
              onChange={(e) =>
                setForm({
                  ...form,
                  priority: e.target.value ? parseInt(e.target.value) : 0,
                })
              }
              className="border p-2 rounded w-full"
              min="1"
              max="10"
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm({ ...form, isActive: e.target.checked })
                }
                className="h-5 w-5"
              />
              <span className="text-sm">Active</span>
            </label>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-6">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!currentUserId || loading}
          >
            {loading ? "Saving..." : editingId ? "Update Ad" : "Create Ad"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
          )}

          {!currentUserId && (
            <p className="text-red-500 text-sm">Please log in to manage ads</p>
          )}
        </div>
      </form>

      <div className="bg-white rounded-lg shadow">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">Current Ads ({ads.length})</h2>
          <div className="flex items-center gap-2">
            {loading && (
              <span className="text-sm text-gray-500">Updating...</span>
            )}
            <button
              onClick={loadAds}
              className="text-blue-600 hover:text-blue-800 text-sm disabled:opacity-50"
              disabled={loading}
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="divide-y">
          {loading && ads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Loading advertisements...
            </div>
          ) : ads.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No advertisements found
            </div>
          ) : (
            ads.map((ad) => (
              <div key={ad.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          ad.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100"
                        }`}
                      >
                        {ad.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="font-medium">{ad.title}</span>
                      <span className="text-gray-600 text-sm">
                        ({ad.position}, Priority: {ad.priority})
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-2">
                      {ad.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div>
                        <span className="font-medium">Link:</span>
                        <a
                          href={ad.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline ml-1"
                        >
                          {ad.link}
                        </a>
                      </div>
                      <div>
                        <span className="font-medium">Button:</span>{" "}
                        {ad.buttonText}
                      </div>
                      <div>
                        <span className="font-medium">Stats:</span>{" "}
                        {ad.clicks || 0} clicks, {ad.views || 0} views
                      </div>
                    </div>

                    {ad.imageUrl && (
                      <div className="mt-2">
                        <span className="text-sm text-gray-500">Image:</span>
                        <img
                          src={ad.imageUrl}
                          alt={ad.title}
                          className="mt-1 max-w-xs max-h-32 object-contain border rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "https://via.placeholder.com/150?text=Image+Error";
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(ad)}
                      className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-200 rounded hover:bg-blue-50"
                      disabled={loading}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => toggleAdStatus(ad.id, ad.isActive)}
                      className={`text-sm px-3 py-1 border rounded ${
                        ad.isActive
                          ? "text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                          : "text-green-600 border-green-200 hover:bg-green-50"
                      }`}
                      disabled={loading}
                    >
                      {ad.isActive ? "Deactivate" : "Activate"}
                    </button>

                    <button
                      onClick={() => handleDelete(ad.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-200 rounded hover:bg-red-50"
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === ad.id && (
                  <div className="mt-3 pt-3 border-t border-blue-200">
                    <p className="text-sm text-blue-600">
                      Currently editing this ad
                    </p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvertisementManager;
