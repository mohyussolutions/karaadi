"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Hash,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize,
  ChevronRight,
  User,
  Calendar,
  ShieldCheck,
  Warehouse,
  Trees,
  CheckCircle2,
  Layers,
  Globe,
  Info,
} from "lucide-react";
import { useAppSelector } from "@/app/(storeFront)/store/hooks";
import { RootState } from "@/store";

export default function SummaryRealEstate() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const entityId = params.id as string;

  const entity = useAppSelector((state: RootState) =>
    state.realEstate.realEstates.find(
      (r) => r.id === entityId || (r as any)._id === entityId,
    ),
  );

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
      icon: <Home className="w-3 h-3" />,
      label: "Main Category",
      value: entity.mainCategory,
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
      label: "County",
      value: entity.county,
    },
    {
      icon: <MapPin className="w-3 h-3" />,
      label: "Sub-District",
      value: entity.subDistrict,
    },
    {
      icon: <Bed className="w-3 h-3" />,
      label: "Bedrooms",
      value: entity.bedrooms,
    },
    {
      icon: <Bath className="w-3 h-3" />,
      label: "Bathrooms",
      value: entity.bathrooms,
    },
    {
      icon: <Maximize className="w-3 h-3" />,
      label: "Square Feet",
      value: entity.squareFeet,
    },
    {
      icon: <Warehouse className="w-3 h-3" />,
      label: "Garage",
      value: entity.hasGarage ? "Yes" : "No",
    },
    {
      icon: <Trees className="w-3 h-3" />,
      label: "Garden",
      value: entity.hasGarden ? "Yes" : "No",
    },
    {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: "Ma Gaday",
      value: entity.maGaday ? "Yes" : "No",
    },
  ];

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:flex-grow p-6 md:p-12 overflow-y-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-10 pb-6 border-b border-slate-100">
          <div>
            <span className="text-indigo-600 font-bold uppercase text-[10px] tracking-[0.2em]">
              Listing Review
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
                <Info className="w-4 h-4 text-indigo-500" /> Property
                Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-lg">
                {entity.description}
              </p>
            </div>

            {entity.images && entity.images.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {entity.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="Property"
                    className="w-full h-24 object-cover rounded-xl border border-slate-100 shadow-sm"
                  />
                ))}
              </div>
            )}

            <div className="bg-slate-900 p-8 rounded-[2rem] text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-indigo-500 rounded-xl flex items-center justify-center font-bold text-xl uppercase">
                  {entity.userId?.charAt(0)}
                </div>
                <div>
                  <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest">
                    Ownership
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
                    Payment Status
                  </span>
                  <span
                    className={`font-bold ${entity.isPaid ? "text-green-400" : "text-amber-400"}`}
                  >
                    {entity.isPaid ? "PAID" : "PENDING"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 content-start">
            <h3 className="col-span-full text-xs font-bold text-slate-900 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-500" /> Specifications &
              Location
            </h3>

            {specsList.map((spec, index) => {
              if (
                spec.value === undefined ||
                spec.value === null ||
                spec.value === ""
              )
                return null;
              return (
                <div
                  key={index}
                  className="p-4 bg-white border border-slate-100 rounded-2xl shadow-sm"
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

            <div className="col-span-full p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-[10px] font-bold text-indigo-400 uppercase mb-1">
                Full Address
              </p>
              <p className="text-sm font-bold text-indigo-900 uppercase">
                {entity.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[380px] bg-slate-50 p-8 md:p-12 flex flex-col justify-between border-l border-slate-100">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Total Price
            </p>
            <p className="text-5xl font-black text-slate-900 tracking-tighter">
              ${entity.price?.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-12 space-y-4">
          <button
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
            className="w-full py-5 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:bg-slate-300"
          >
            {isSubmitting ? "Processing..." : "Confirm & Post"}
            {!isSubmitting && <ChevronRight className="w-5 h-5" />}
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-2 text-slate-400 font-bold uppercase text-[10px] tracking-widest hover:text-slate-600"
          >
            Back to Editor
          </button>
        </div>
      </div>
    </div>
  );
}
