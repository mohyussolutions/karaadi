"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getCars } from "@/actions/categories/carActions";
import { CarFront, Plus, ChevronLeft } from "lucide-react";

export default function CarsPage() {
  const [items, setItems] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCars() {
      try {
        const cars = await getCars();
        setItems(cars ?? []);
      } finally {
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 text-slate-900">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200">
            <CarFront className="text-white w-8 h-8" />
          </div>
          <div>
            <h2 className="text-3xl font-black uppercase tracking-tight">
              Vehicles
            </h2>
            <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest">
              Maamulka Gawaarida
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Link
            href="/Backoffice/marketplace/creating"
            className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-full font-bold shadow-lg hover:bg-green-600 transition-all"
          >
            <Plus className="w-5 h-5" /> Abuur
          </Link>
          <Link
            href="/Backoffice"
            className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-full font-bold hover:bg-slate-200 transition-all"
          >
            <ChevronLeft className="w-5 h-5" /> Dib
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400 font-medium italic">
          Waa la raryaa...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-100 text-center">
          <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
            Ma jiraan gawaari la heli karo.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {items.map((it) => (
            <div
              key={it._id || it.id}
              className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden border">
                  {it.images?.[0] ? (
                    <img
                      src={it.images[0]}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <CarFront className="w-8 h-8 text-slate-300 m-auto mt-6" />
                  )}
                </div>
                <div>
                  <div className="text-lg font-black uppercase tracking-tight">
                    {it.title || "No Title"}
                  </div>
                  <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                    {it.brand} • {it.vehicleModel} • {it.year}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
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
