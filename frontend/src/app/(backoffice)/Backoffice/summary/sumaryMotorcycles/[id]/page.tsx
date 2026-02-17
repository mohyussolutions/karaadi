"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Bike,
  Hash,
  MapPin,
  ChevronRight,
  User,
  Calendar,
  ShieldCheck,
  Gauge,
  Settings,
  Fuel,
  Palette,
  Globe,
  Info,
  Layers,
  Activity,
} from "lucide-react";
import { useAppSelector } from "@/app/(storeFront)/store/hooks";
import { RootState } from "@/store";

export default function SummaryMotorcycle() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const entityId = params.id as string;

  const entity = useAppSelector((state: RootState) => {
    const motorcycleState = (state as any).motorcycles;
    if (!motorcycleState) return null;
    return motorcycleState.motorcycles?.find(
      (m: any) => m.id === entityId || m._id === entityId,
    );
  });

  if (!entity) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">No Data Found</h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const specsList = [
    {
      icon: <Settings className="w-3 h-3" />,
      label: "Make",
      value: entity.make,
    },
    {
      icon: <Activity className="w-3 h-3" />,
      label: "Model",
      value: entity.modelName,
    },
    {
      icon: <Calendar className="w-3 h-3" />,
      label: "Year",
      value: entity.year,
    },
    {
      icon: <Gauge className="w-3 h-3" />,
      label: "Mileage",
      value: entity.mileage ? `${entity.mileage.toLocaleString()} km` : null,
    },
    {
      icon: <Layers className="w-3 h-3" />,
      label: "Engine",
      value: entity.engineSize,
    },
    {
      icon: <Activity className="w-3 h-3" />,
      label: "Transmission",
      value: entity.transmission,
    },
    {
      icon: <Fuel className="w-3 h-3" />,
      label: "Fuel Type",
      value: entity.fuelType,
    },
    {
      icon: <Palette className="w-3 h-3" />,
      label: "Color",
      value: entity.color,
    },
    {
      icon: <Globe className="w-3 h-3" />,
      label: "Region",
      value: entity.region,
    },
    { icon: <MapPin className="w-3 h-3" />, label: "City", value: entity.city },
    {
      icon: <Hash className="w-3 h-3" />,
      label: "District",
      value: entity.district,
    },
    {
      icon: <MapPin className="w-3 h-3" />,
      label: "Sub-District",
      value: entity.subDistrict,
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 pb-6 border-b border-slate-100">
          <div>
            <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em]">
              Vehicle Summary
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mt-1 uppercase tracking-tight">
              {entity.title}
            </h1>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 min-w-[280px]">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                Item ID
              </span>
              <span className="text-[10px] font-mono font-bold text-slate-700">
                {entity.id}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase">
                User ID
              </span>
              <span className="text-[10px] font-mono font-bold text-indigo-600">
                {entity.userId}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-500" /> Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {entity.description}
              </p>
            </div>

            {entity.images && entity.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {entity.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Motorcycle"
                    className="w-full h-24 object-cover rounded-xl border border-slate-100 shadow-sm"
                  />
                ))}
              </div>
            )}

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl uppercase shadow-lg rotate-3">
                  {entity.userId?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                    Ownership Details
                  </p>
                  <p className="font-bold uppercase tracking-tight">
                    UID_{entity.userId?.slice(-6)}
                  </p>
                </div>
              </div>
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 uppercase font-bold">
                    Created At
                  </span>
                  <span className="font-mono">
                    {new Date(entity.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 uppercase font-bold">
                    Listing Status
                  </span>
                  <span
                    className={`font-bold ${entity.isPaid ? "text-green-400" : "text-amber-400"}`}
                  >
                    {entity.isPaid ? "PAID" : "DRAFT"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
            <h3 className="col-span-full text-xs font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Bike className="w-4 h-4 text-indigo-500" /> Specifications &
              Location
            </h3>

            {specsList.map((spec, index) => {
              if (!spec.value || spec.value === "" || spec.value === 0)
                return null;
              return (
                <div
                  key={index}
                  className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1 text-slate-400">
                    {spec.icon}
                    <span className="text-[10px] font-bold uppercase tracking-tight">
                      {spec.label}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-slate-800 uppercase truncate">
                    {spec.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[380px] bg-slate-50 p-8 md:p-12 flex flex-col justify-between border-l border-slate-100">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Asking Price
            </p>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              ${entity.price?.toLocaleString()}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 text-slate-500">
            <MapPin className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {entity.city}, {entity.region}
            </span>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <button
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300 shadow-lg shadow-indigo-100"
          >
            {isSubmitting ? "Processing..." : "Confirm & Post"}
            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600"
          >
            Go Back & Edit
          </button>
        </div>
      </div>
    </div>
  );
}
