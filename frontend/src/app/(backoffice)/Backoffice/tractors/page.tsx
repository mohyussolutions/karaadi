"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Tractor as TractorIcon,
  Plus,
  ChevronLeft,
  Gauge,
  Cog,
} from "lucide-react";

import { getTraktors, Traktor } from "@/actions/categories/tractorActions";

export default function TractorsPage() {
  // 2. Use Traktor type here
  const [items, setItems] = useState<Traktor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTractors() {
      try {
        const data = await getTraktors();
        setItems(data ?? []);
      } catch (error) {
        console.error("Error fetching tractors:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchTractors();
  }, []);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 text-slate-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-amber-600 p-3 rounded-2xl shadow-lg shadow-amber-200">
            <TractorIcon className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">
              Heavy Machinery
            </h2>
            <p className="text-amber-600 text-sm font-bold uppercase tracking-widest">
              Maamulka Cagafyada
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/Backoffice/tractors/creating"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" /> Abuur
          </Link>
          <Link
            href="/Backoffice"
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-full font-bold hover:bg-slate-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Dib u laabo
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium italic">
          Waa la raryaa...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <TractorIcon className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Ma jiraan cagafyo la heli karo xilligan.
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <div
              key={it._id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center overflow-hidden border border-slate-100">
                  {it.images && it.images[0] ? (
                    <img
                      src={it.images[0]}
                      alt={it.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <TractorIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {it.title || "Cinwaan la'aan"}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-2">
                    <span>{it.make}</span>
                    <span className="text-slate-300">•</span>
                    <span>{it.traktortModel}</span>
                    <span className="text-slate-300">•</span>
                    <span>{it.year}</span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-xs">
                    <span className="flex items-center gap-1 font-bold">
                      <Gauge className="w-3 h-3 text-slate-400" /> {it.hours}{" "}
                      Hrs
                    </span>
                    <span className="flex items-center gap-1 font-bold">
                      <Cog className="w-3 h-3 text-slate-400" />{" "}
                      {it.enginePower}
                    </span>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      {it.condition}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">
                  Qiimaha USD
                </div>
                <div className="text-2xl font-black text-green-600 tracking-tighter">
                  ${Number(it.price).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
