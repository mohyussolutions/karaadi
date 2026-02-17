"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  RealEstate,
  getRealEstateListings,
} from "@/actions/categories/realEstateActions";
import {
  Home,
  MapPin,
  Plus,
  ChevronLeft,
  BedDouble,
  Bath,
  Square,
} from "lucide-react";

export default function RealEstatePage() {
  const [items, setItems] = useState<RealEstate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const data = await getRealEstateListings();
        setItems(data ?? []);
      } catch (error) {
        console.error("Error fetching real estate:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 text-slate-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <Home className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight text-slate-900">
              Real Estate
            </h2>
            <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest">
              Maamulka Guryaha & Dhulka
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            href="/Backoffice/real-estate/creating"
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
          <Home className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <div className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Ma jiraan guryo la heli karo xilligan.
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
                    <Home className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-black text-slate-900 uppercase tracking-tight">
                    {it.title || "Cinwaan la'aan"}
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                    <span>{it.subCategory}</span>
                    <span className="text-slate-300">•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {it.city}, {it.region}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-slate-500 text-xs">
                    {it.bedrooms && (
                      <span className="flex items-center gap-1">
                        <BedDouble className="w-3 h-3" /> {it.bedrooms} Bed
                      </span>
                    )}
                    {it.bathrooms && (
                      <span className="flex items-center gap-1">
                        <Bath className="w-3 h-3" /> {it.bathrooms} Bath
                      </span>
                    )}
                    {it.squareFeet && (
                      <span className="flex items-center gap-1">
                        <Square className="w-3 h-3" /> {it.squareFeet} sqft
                      </span>
                    )}
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
