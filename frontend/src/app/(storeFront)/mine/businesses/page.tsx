"use client";
export const dynamic = "force-dynamic";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import {
  getMyBusinesses,
  deleteBusiness,
  updateBusiness,
  type Business,
} from "@/actions/categories/businessActions";
import Loading from "../../components/shared/Loading/Loading";
import { IoBusiness } from "react-icons/io5";
import { MdEdit, MdDelete, MdClose, MdCheck } from "react-icons/md";
import { toast } from "react-toastify";

export default function MyBusinessesPage() {
  const { user, loading: authLoading } = useAuth();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [fetching, setFetching] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Business>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setFetching(false);
      return;
    }
    getMyBusinesses()
      .then((res) => setBusinesses(res.businesses ?? []))
      .catch(() => {})
      .finally(() => setFetching(false));
  }, [user, authLoading]);

  const startEdit = (b: Business) => {
    setEditId(b.id);
    setEditForm({
      name: b.name,
      email: b.email,
      phone: b.phone,
      address: b.address ?? "",
      website: b.website ?? "",
      description: b.description ?? "",
      contactName: b.contactName ?? "",
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm({});
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    const res = (await updateBusiness(id, editForm as Record<string, unknown>)) as any;
    if (res?.success) {
      setBusinesses((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...editForm } : b)),
      );
      toast.success("Business updated");
      cancelEdit();
    } else {
      toast.error("Update failed");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this business?")) return;
    setDeletingId(id);
    const res = (await deleteBusiness(id)) as any;
    if (res?.success) {
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
      toast.success("Business deleted");
    } else {
      toast.error("Delete failed");
    }
    setDeletingId(null);
  };

  if (authLoading || fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center mt-16 p-4">
        <p className="text-red-500 font-medium">Please log in to view your businesses.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">My Businesses</h1>

      {businesses.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center text-gray-400">
          <IoBusiness className="text-6xl mb-4" />
          <p className="font-medium">You have no businesses yet.</p>
        </div>
      ) : (
        businesses.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
          >
            {editId === b.id ? (
              <EditForm
                form={editForm}
                onChange={setEditForm}
                onSave={() => saveEdit(b.id)}
                onCancel={cancelEdit}
                saving={saving}
              />
            ) : (
              <BusinessRow
                b={b}
                onEdit={() => startEdit(b)}
                onDelete={() => handleDelete(b.id)}
                deleting={deletingId === b.id}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

function BusinessRow({
  b,
  onEdit,
  onDelete,
  deleting,
}: {
  b: Business;
  onEdit: () => void;
  onDelete: () => void;
  deleting: boolean;
}) {
  const statusColor =
    b.status === "active"
      ? "bg-green-100 text-green-700"
      : b.status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <div className="flex items-start gap-4 p-5">
      <div className="flex-shrink-0">
        {b.logo ? (
          <Image
            src={b.logo}
            alt={b.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-xl object-cover border border-gray-100"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-indigo-50 flex items-center justify-center">
            <IoBusiness className="text-indigo-400 text-3xl" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-base font-bold text-gray-900 truncate">{b.name}</h2>
          <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${statusColor}`}>
            {b.status}
          </span>
          {b.isVerified && (
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
              Verified
            </span>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-0.5">{b.email} · {b.phone}</p>
        {b.address && <p className="text-sm text-gray-500">{b.address}</p>}
        {b.website && (
          <a href={b.website} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline">
            {b.website}
          </a>
        )}
        {b.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{b.description}</p>
        )}

        {b.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {b.categories.map((cat) => (
              <span key={cat} className="text-[10px] uppercase font-semibold bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        )}

        {(b.images as string[] | undefined)?.length ? (
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {(b.images as string[]).slice(0, 5).map((img, i) => (
              <Image
                key={i}
                src={img}
                alt=""
                width={48}
                height={48}
                className="w-12 h-12 rounded-lg object-cover border border-gray-100"
              />
            ))}
          </div>
        ) : null}

        {b.expiryDate && (
          <p className="text-xs text-gray-400 mt-1">
            Plan expires: {new Date(b.expiryDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
        >
          <MdEdit size={18} />
        </button>
        <button
          onClick={onDelete}
          disabled={deleting}
          className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition disabled:opacity-50"
        >
          {deleting ? <span className="text-xs">…</span> : <MdDelete size={18} />}
        </button>
      </div>
    </div>
  );
}

function EditForm({
  form,
  onChange,
  onSave,
  onCancel,
  saving,
}: {
  form: Partial<Business>;
  onChange: (f: Partial<Business>) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const field = (key: keyof typeof form, label: string, type = "text") => (
    <div key={key}>
      <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
      <input
        type={type}
        value={(form[key] as string) ?? ""}
        onChange={(e) => onChange({ ...form, [key]: e.target.value })}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />
    </div>
  );

  return (
    <div className="p-5 space-y-3">
      <p className="font-semibold text-gray-700 text-sm">Edit Business</p>
      <div className="grid sm:grid-cols-2 gap-3">
        {field("name", "Business Name")}
        {field("email", "Email", "email")}
        {field("phone", "Phone")}
        {field("contactName", "Contact Name")}
        {field("address", "Address")}
        {field("website", "Website")}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-500 mb-1">Description</label>
        <textarea
          rows={3}
          value={form.description ?? ""}
          onChange={(e) => onChange({ ...form, description: e.target.value })}
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none"
        />
      </div>
      <div className="flex gap-2 justify-end pt-1">
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
        >
          <MdClose size={16} /> Cancel
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex items-center gap-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition disabled:opacity-60"
        >
          <MdCheck size={16} /> {saving ? "Saving…" : "Save"}
        </button>
      </div>
    </div>
  );
}
