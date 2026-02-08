"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getItemDetailAction } from "@/actions/categories/paymentActions";

export default function PaymentItemDetailPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const [item, setItem] = useState<any>(null);
  const [category, setCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getItemDetailAction(id);
        if (res.success) {
          setItem(res.data);
          setCategory(res.category);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [id]);

  if (loading)
    return (
      <div className="p-20 text-center animate-pulse font-black text-slate-400">
        LOADING DATA...
      </div>
    );
  if (!item)
    return <div className="p-20 text-center font-black">ITEM NOT FOUND</div>;

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            ← Back to Transactions
          </button>
          <span className="px-4 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
            {category}
          </span>
        </div>

        <div className="bg-white rounded-[3rem] border border-slate-200/60 shadow-sm overflow-hidden">
          <div className="p-12 border-b border-slate-100 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-[0.9]">
                {item.title || item.make || "Untitled Listing"}
              </h1>
              <div className="flex items-center gap-6">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Price
                  </p>
                  <p className="text-3xl font-black text-emerald-600">
                    ${item.price?.toLocaleString()}
                  </p>
                </div>
                <div className="h-10 w-[1px] bg-slate-100" />
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Location
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {item.region}, {item.city}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center font-black text-slate-400 text-xl shadow-sm">
                  {item.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">
                    Listed By
                  </p>
                  <p className="text-lg font-black text-slate-900">
                    {item.user?.username}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">
                    {item.user?.email}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {item.images && item.images.length > 0 && (
            <div className="p-12 border-b border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
                Media Gallery ({item.images.length})
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {item.images.map((img: string, index: number) => (
                  <div
                    key={index}
                    className="aspect-square rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-sm bg-slate-50"
                  >
                    <img
                      src={img}
                      alt="listing"
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Description
              </p>
              <p className="text-slate-600 font-medium leading-relaxed text-lg italic">
                "{item.description || "No description provided."}"
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Metadata
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Item ID
                  </p>
                  <p className="text-[10px] font-mono font-bold text-slate-600 truncate">
                    {id}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    Listed Date
                  </p>
                  <p className="text-[10px] font-bold text-slate-600">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
