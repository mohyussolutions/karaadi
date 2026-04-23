"use client";

import {
  deleteAgency,
  fetchAgencies,
  updateAgency,
  createAgency,
} from "@/actions/categories/actionsAgency";
import React, { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
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

const EMPTY_FORM = {
  name: "",
  type: "",
  location: "",
  specialty: "",
  image: "",
  link: "",
  status: "Verified",
};

function isResultSuccess(r: unknown): r is { success: boolean; error?: string } {
  return !!(r && typeof r === "object" && (r as Record<string, unknown>).success);
}

export default function AgencyDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const currentUserId = user?._id || null;
  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchAgencies();
    setAgencies(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
    setFormData(EMPTY_FORM);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserId) return alert("Session expired.");
    if (editingId) {
      const res = await updateAgency(editingId, formData);
      if (isResultSuccess(res) && res.success) { handleCloseModal(); loadData(); }
      else alert((res as any)?.error || "Failed to update agency");
    } else {
      const res = await createAgency({ ...formData, userId: currentUserId });
      if (isResultSuccess(res) && res.success) { handleCloseModal(); loadData(); }
      else alert((res as any)?.error || "Failed to create agency");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm(t("adminTable.delete") + "?")) {
      const res = await deleteAgency(id);
      if (isResultSuccess(res) && res.success) loadData();
    }
  };

  const toggleVerify = async (id: string, currentStatus?: string) => {
    const newStatus = (currentStatus ?? "Verified") === "Verified" ? "Pending" : "Verified";
    const res = await updateAgency(id, { status: newStatus });
    if (isResultSuccess(res) && res.success) loadData();
  };

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative">
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-black text-gray-900">
                {editingId ? t("adminTable.editAgency") : t("adminTable.newAgency")}
              </h3>
              <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600">
                <FiX size={22} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <input
                required type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={t("adminTable.name")}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  required type="text"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={t("adminTable.type")}
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                />
                <input
                  required type="text"
                  className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={t("adminTable.location")}
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <input
                required type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder={t("adminTable.specialty")}
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
              />
              <input
                required type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Image URL"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              />
              <input
                type="text"
                className="w-full px-4 py-2 bg-gray-50 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                placeholder="Website Link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              />
              <button
                type="submit"
                disabled={!currentUserId}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400 text-sm"
              >
                {editingId ? t("adminTable.updateAgency") : t("adminTable.saveAgency")}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900">{t("adminTable.agencies")}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
          >
            <FiPlus size={16} /> <span className="hidden sm:inline">{t("adminTable.createAgency")}</span>
          </button>
          <button onClick={loadData} className="p-2 hover:bg-gray-100 rounded-full border">
            <FiRefreshCw className={loading ? "animate-spin" : ""} size={17} />
          </button>
        </div>
      </div>

      <div className="block lg:hidden space-y-3">
        {agencies.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm">{t("adminTable.noItems")}</div>
        ) : agencies.map((agency) => {
          const id = String(agency.id ?? agency._id ?? "");
          return (
            <div key={id} className="border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                {agency.image && (
                  <Image
                    src={`/api/images/${agency.image}`}
                    width={40} height={40}
                    className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    alt={agency.name ?? ""}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-gray-900 truncate">{agency.name}</p>
                  <p className="text-[11px] text-gray-500 truncate">{agency.type} · {agency.location}</p>
                </div>
                <button
                  onClick={() => toggleVerify(id, agency.status)}
                  className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 ${
                    agency.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                  }`}
                >
                  <FiCheckCircle size={9} /> {agency.status === "Verified" ? t("adminTable.verifyStatus") : t("adminTable.pendingStatus")}
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleOpenEdit(agency)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-blue-600 bg-blue-50 border border-blue-100 rounded-lg text-xs font-medium"
                >
                  <FiEdit2 size={12} /> {t("adminTable.edit")}
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="flex-1 flex items-center justify-center gap-1 py-2 text-red-600 bg-red-50 border border-red-100 rounded-lg text-xs font-medium"
                >
                  <FiTrash2 size={12} /> {t("adminTable.delete")}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block overflow-x-hidden">
        <table className="w-full text-left border-collapse table-fixed">
          <thead>
            <tr className="border-b text-[10px] uppercase text-gray-400 font-black tracking-widest">
              <th className="py-3 px-4 w-[35%]">{t("adminTable.name")}</th>
              <th className="py-3 px-4 w-[25%]">{t("adminTable.location")}</th>
              <th className="py-3 px-4 w-[20%]">{t("adminTable.status")}</th>
              <th className="py-3 px-4 w-[20%] text-right">{t("adminTable.actions")}</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {agencies.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-10 text-gray-400 text-sm">{t("adminTable.noItems")}</td>
              </tr>
            ) : agencies.map((agency) => {
              const id = String(agency.id ?? agency._id ?? "");
              return (
                <tr key={id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {agency.image && (
                        <Image
                          src={`/api/images/${agency.image}`}
                          width={30} height={30}
                          className="w-8 h-8 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                          alt={agency.name ?? ""}
                          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                        />
                      )}
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 truncate">{agency.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{agency.type}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600 truncate">{agency.location}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => toggleVerify(id, agency.status)}
                      className={`px-2 py-1 rounded-md text-[10px] font-black uppercase flex items-center gap-1 transition-all ${
                        agency.status === "Verified" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                      }`}
                    >
                      <FiCheckCircle size={10} />
                      {agency.status === "Verified" ? t("adminTable.verifyStatus") : t("adminTable.pendingStatus")}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button onClick={() => handleOpenEdit(agency)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <FiEdit2 size={15} />
                      </button>
                      <button onClick={() => handleDelete(id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
