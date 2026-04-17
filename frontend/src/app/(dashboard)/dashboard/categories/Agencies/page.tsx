"use client";
import {
  deleteAgency,
  fetchAgencies,
  updateAgency,
  createAgency,
} from "@/actions/categories/actionsAgency";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiRefreshCw,
  FiCheckCircle,
  FiX,
} from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

export default function AgencyDashboard() {
  interface Agency {
    id?: string;
    _id?: string;
    name?: string;
    type?: string;
    location?: string;
    specialty?: string;
    image?: string;
    link?: string;
    status?: string;
  }

  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentUserId = user?._id || null;

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    specialty: "",
    image: "",
    link: "",
    status: "Verified",
  });

  function isResultSuccess(
    r: unknown,
  ): r is { success: boolean; error?: string } {
    return !!(
      r &&
      typeof r === "object" &&
      (r as Record<string, unknown>).success
    );
  }

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAgencies();
    setAgencies(data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenEdit = (agency: Agency) => {
    setEditingId(String(agency.id ?? agency._id ?? ""));
    setFormData({
      name: agency.name ?? "",
      type: agency.type ?? "",
      location: agency.location ?? "",
      specialty: agency.specialty ?? "",
      image: agency.image ?? "",
      link: agency.link ?? "",
      status: agency.status ?? "Verified",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormData({
      name: "",
      type: "",
      location: "",
      specialty: "",
      image: "",
      link: "",
      status: "Verified",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return alert("Session expired.");

    if (editingId) {
      const res = await updateAgency(editingId, formData);
      if (isResultSuccess(res) && res.success) {
        handleCloseModal();
        loadData();
      } else {
        const err = res && (res as Record<string, unknown>).error;
        alert(err || "Failed to update agency");
      }
    } else {
      const agencyData = {
        name: formData.name,
        type: formData.type,
        location: formData.location,
        specialty: formData.specialty,
        image: formData.image,
        link: formData.link,
        userId: currentUserId,
      };

      const res = await createAgency(agencyData);
      if (isResultSuccess(res) && res.success) {
        handleCloseModal();
        loadData();
      } else {
        const err = res && (res as Record<string, unknown>).error;
        alert(err || "Failed to create agency");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const res = await deleteAgency(id);
      if (isResultSuccess(res) && res.success) loadData();
    }
  };

  const toggleVerify = async (id: string, currentStatus?: string) => {
    const status = currentStatus ?? "Verified";
    const newStatus = status === "Verified" ? "Pending" : "Verified";
    const res = await updateAgency(id, { status: newStatus });
    if (isResultSuccess(res) && res.success) loadData();
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-xl font-black text-gray-900">
                {editingId ? "Edit Agency" : "New Agency"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                required
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Agency Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                />
                <input
                  required
                  type="text"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>
              <input
                required
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Specialty"
                value={formData.specialty}
                onChange={(e) =>
                  setFormData({ ...formData, specialty: e.target.value })
                }
              />
              <input
                required
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Website Link"
                value={formData.link}
                onChange={(e) =>
                  setFormData({ ...formData, link: e.target.value })
                }
              />

              <button
                type="submit"
                disabled={!currentUserId}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              >
                {editingId ? "Update Agency" : "Save Agency"}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-black text-gray-900">Manage Agencies</h2>
          <p className="text-sm text-gray-500">
            Update or remove agency listings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-blue-700 transition-all"
          >
            <FiPlus size={18} /> Create Agency
          </button>
          <button
            onClick={loadData}
            className="p-2 hover:bg-gray-100 rounded-full border"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-[10px] uppercase text-gray-400 font-black tracking-widest">
              <th className="py-3 px-4">Agency</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {agencies.map((agency) => (
              <tr
                key={String(agency.id ?? agency._id ?? "")}
                className="border-b hover:bg-gray-50 transition-colors"
              >
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    {agency.image ? (
                      <Image
                        src={`/api/images/${agency.image}`}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-lg object-cover bg-gray-100 shadow-sm"
                        alt={agency.name ?? ""}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    ) : null}
                    <div>
                      <p className="font-bold text-gray-900">{agency.name}</p>
                      <p className="text-[10px] text-gray-500">{agency.type}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-600">{agency.location}</td>
                <td className="py-4 px-4">
                  <button
                    onClick={() =>
                      toggleVerify(
                        String(agency.id ?? agency._id ?? ""),
                        agency.status ?? "Verified",
                      )
                    }
                    className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                      agency.status === "Verified"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    <FiCheckCircle size={10} /> {agency.status || "Verified"}
                  </button>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(agency)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(String(agency.id ?? agency._id ?? ""))
                      }
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
