"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeaders } from "@/app/(storeFront)/components/hooks/useAuthheaders";
import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import { FiEdit2, FiTrash2, FiPlus, FiArrowLeft, FiChevronRight } from "react-icons/fi";

type Sub = { id: string; key: string; nameEn: string; nameSo: string };
type Cat = { id: string; key: string; nameEn: string; nameSo: string; subcategories: Sub[] };

export default function CategoriesPage() {
  const router = useRouter();
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Cat | null>(null);
  const [saving, setSaving] = useState(false);

  const [newCat, setNewCat] = useState({ nameEn: "", nameSo: "" });
  const [editCat, setEditCat] = useState<Cat | null>(null);
  const [newSub, setNewSub] = useState({ nameEn: "", nameSo: "" });
  const [editSub, setEditSub] = useState<Sub | null>(null);

  const fetchCats = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories`);
      if (res.ok) setCats(await res.json());
    } catch {} finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchCats(); }, [fetchCats]);

  useEffect(() => {
    if (selected) {
      const updated = cats.find(c => c.key === selected.key);
      if (updated) setSelected(updated);
    }
  }, [cats]);

  const authHeaders = useCallback(async () => {
    const h = await getAuthHeaders();
    return { ...h, "Content-Type": "application/json" } as HeadersInit;
  }, []);

  const addCategory = async () => {
    if (!newCat.nameEn.trim() || !newCat.nameSo.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories`, {
        method: "POST", credentials: "include",
        headers: await authHeaders(),
        body: JSON.stringify(newCat),
      });
      if (res.ok) { const cat = await res.json(); setCats(p => [...p, cat]); setNewCat({ nameEn: "", nameSo: "" }); }
    } catch {} finally { setSaving(false); }
  };

  const saveEditCat = async () => {
    if (!editCat) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories/${editCat.key}`, {
        method: "PUT", credentials: "include",
        headers: await authHeaders(),
        body: JSON.stringify({ nameEn: editCat.nameEn, nameSo: editCat.nameSo }),
      });
      if (res.ok) { const updated = await res.json(); setCats(p => p.map(c => c.key === updated.key ? updated : c)); setEditCat(null); }
    } catch {} finally { setSaving(false); }
  };

  const deleteCat = async (key: string) => {
    if (!confirm("Delete this category and all its subcategories?")) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories/${key}`, {
        method: "DELETE", credentials: "include", headers: await authHeaders(),
      });
      if (res.ok) { setCats(p => p.filter(c => c.key !== key)); if (selected?.key === key) setSelected(null); }
    } catch {} finally { setSaving(false); }
  };

  const addSub = async () => {
    if (!selected || !newSub.nameEn.trim() || !newSub.nameSo.trim()) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories/${selected.key}/subcategories`, {
        method: "POST", credentials: "include",
        headers: await authHeaders(),
        body: JSON.stringify(newSub),
      });
      if (res.ok) {
        const sub = await res.json();
        setCats(p => p.map(c => c.key === selected.key ? { ...c, subcategories: [...c.subcategories, sub] } : c));
        setNewSub({ nameEn: "", nameSo: "" });
      }
    } catch {} finally { setSaving(false); }
  };

  const saveEditSub = async () => {
    if (!editSub || !selected) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories/${selected.key}/subcategories/${editSub.id}`, {
        method: "PUT", credentials: "include",
        headers: await authHeaders(),
        body: JSON.stringify({ nameEn: editSub.nameEn, nameSo: editSub.nameSo }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCats(p => p.map(c => c.key === selected.key
          ? { ...c, subcategories: c.subcategories.map(s => s.id === updated.id ? updated : s) }
          : c));
        setEditSub(null);
      }
    } catch {} finally { setSaving(false); }
  };

  const deleteSub = async (subId: string) => {
    if (!selected || !confirm("Delete this subcategory?")) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/marketplace-categories/${selected.key}/subcategories/${subId}`, {
        method: "DELETE", credentials: "include", headers: await authHeaders(),
      });
      if (res.ok) {
        setCats(p => p.map(c => c.key === selected.key
          ? { ...c, subcategories: c.subcategories.filter(s => s.id !== subId) }
          : c));
      }
    } catch {} finally { setSaving(false); }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.push("/dashboard/settings")}
          className="flex items-center gap-2 text-indigo-600 text-sm font-semibold mb-6 hover:underline">
          <FiArrowLeft /> Back to Settings
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace Categories</h1>
          <p className="text-gray-500 text-sm mt-1">Add custom categories and subcategories for marketplace listings.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-800 mb-4">Categories</h2>

            <div className="flex flex-col gap-2 mb-4">
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Name (English)"
                value={newCat.nameEn}
                onChange={e => setNewCat(p => ({ ...p, nameEn: e.target.value }))}
              />
              <input
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                placeholder="Summada (Soomaali)"
                value={newCat.nameSo}
                onChange={e => setNewCat(p => ({ ...p, nameSo: e.target.value }))}
              />
              <button
                onClick={addCategory} disabled={saving || !newCat.nameEn.trim() || !newCat.nameSo.trim()}
                className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                <FiPlus size={14} /> Add Category
              </button>
            </div>

            {loading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}</div>
            ) : cats.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-6">No custom categories yet.</p>
            ) : (
              <ul className="space-y-1">
                {cats.map(cat => (
                  <li key={cat.key}>
                    {editCat?.key === cat.key ? (
                      <div className="flex flex-col gap-1 p-2 bg-indigo-50 rounded-lg">
                        <input className="border border-indigo-200 rounded px-2 py-1 text-sm" value={editCat.nameEn} onChange={e => setEditCat(p => p ? { ...p, nameEn: e.target.value } : p)} placeholder="English" />
                        <input className="border border-indigo-200 rounded px-2 py-1 text-sm" value={editCat.nameSo} onChange={e => setEditCat(p => p ? { ...p, nameSo: e.target.value } : p)} placeholder="Soomaali" />
                        <div className="flex gap-2">
                          <button onClick={saveEditCat} disabled={saving} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded">Save</button>
                          <button onClick={() => setEditCat(null)} className="text-xs font-bold text-gray-500 px-3 py-1 rounded border">Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelected(cat)}
                        className={`w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${selected?.key === cat.key ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"}`}>
                        <span className="text-left">
                          <span className="font-semibold">{cat.nameEn}</span>
                          <span className="text-gray-400 ml-2 text-xs">{cat.nameSo}</span>
                        </span>
                        <div className="flex items-center gap-1 shrink-0">
                          <button onClick={e => { e.stopPropagation(); setEditCat(cat); }} className="p-1 text-gray-400 hover:text-indigo-600"><FiEdit2 size={13} /></button>
                          <button onClick={e => { e.stopPropagation(); deleteCat(cat.key); }} className="p-1 text-gray-400 hover:text-red-600"><FiTrash2 size={13} /></button>
                          <FiChevronRight size={13} className="text-gray-300" />
                        </div>
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            {!selected ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-300">
                <FiChevronRight size={32} className="mb-2" />
                <p className="text-sm font-medium">Select a category to manage subcategories</p>
              </div>
            ) : (
              <>
                <h2 className="font-bold text-gray-800 mb-1">
                  Subcategories — <span className="text-indigo-600">{selected.nameEn}</span>
                </h2>
                <p className="text-xs text-gray-400 mb-4">{selected.nameSo}</p>

                <div className="flex flex-col gap-2 mb-4">
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                    placeholder="Name (English)"
                    value={newSub.nameEn}
                    onChange={e => setNewSub(p => ({ ...p, nameEn: e.target.value }))}
                  />
                  <input
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-full"
                    placeholder="Summada Qayb-hoosaadka (Soomaali)"
                    value={newSub.nameSo}
                    onChange={e => setNewSub(p => ({ ...p, nameSo: e.target.value }))}
                  />
                  <button
                    onClick={addSub} disabled={saving || !newSub.nameEn.trim() || !newSub.nameSo.trim()}
                    className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50">
                    <FiPlus size={14} /> Add Subcategory
                  </button>
                </div>

                {selected.subcategories.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-6">No subcategories yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {selected.subcategories.map(sub => (
                      <li key={sub.id}>
                        {editSub?.id === sub.id ? (
                          <div className="flex flex-col gap-1 p-2 bg-indigo-50 rounded-lg">
                            <input className="border border-indigo-200 rounded px-2 py-1 text-sm" value={editSub.nameEn} onChange={e => setEditSub(p => p ? { ...p, nameEn: e.target.value } : p)} placeholder="English" />
                            <input className="border border-indigo-200 rounded px-2 py-1 text-sm" value={editSub.nameSo} onChange={e => setEditSub(p => p ? { ...p, nameSo: e.target.value } : p)} placeholder="Soomaali" />
                            <div className="flex gap-2">
                              <button onClick={saveEditSub} disabled={saving} className="text-xs font-bold text-white bg-indigo-600 px-3 py-1 rounded">Save</button>
                              <button onClick={() => setEditSub(null)} className="text-xs font-bold text-gray-500 px-3 py-1 rounded border">Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-50">
                            <span className="text-sm">
                              <span className="font-medium text-gray-700">{sub.nameEn}</span>
                              <span className="text-gray-400 ml-2 text-xs">{sub.nameSo}</span>
                            </span>
                            <div className="flex gap-1">
                              <button onClick={() => setEditSub(sub)} className="p-1 text-gray-400 hover:text-indigo-600"><FiEdit2 size={13} /></button>
                              <button onClick={() => deleteSub(sub.id)} className="p-1 text-gray-400 hover:text-red-600"><FiTrash2 size={13} /></button>
                            </div>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
