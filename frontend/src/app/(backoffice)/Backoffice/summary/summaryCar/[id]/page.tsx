"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FaCar,
  FaMapMarkerAlt,
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaHashtag,
  FaShieldAlt,
  FaChevronRight,
} from "react-icons/fa";
import { useAppSelector } from "@/app/(storeFront)/store/hooks";
import { selectActiveCar } from "@/app/(storeFront)/store/slices/carsSlice";

export default function SummaryCar() {
  const router = useRouter();
  const params = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const entityId = params.id as string;

  const activeCar = useAppSelector(selectActiveCar);
  const allCars = useAppSelector((state) => state.cars.cars);

  const entity =
    activeCar?.id === entityId || (activeCar as any)?._id === entityId
      ? activeCar
      : allCars.find((c) => c.id === entityId || (c as any)._id === entityId);

  if (!entity) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h2 className="text-xl font-bold text-slate-900 mb-4">
          No Car Data Found
        </h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  const specs = [
    { label: "Brand", value: entity.brand },
    { label: "Model", value: entity.vehicleModel },
    { label: "Transmission", value: entity.transmission },
    { label: "Fuel Type", value: entity.fuelType },
    { label: "Color", value: entity.color },
    { label: "Year", value: entity.year },
    {
      label: "Mileage",
      value: entity.mileage ? `${entity.mileage.toLocaleString()} km` : null,
    },
  ].filter((item) => item.value);

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:flex-row">
      <div className="w-full lg:flex-grow p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <FaCar className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-xs">
              Car Summary
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <FaHashtag className="w-3 h-3" />
            <span className="text-[10px] font-mono uppercase tracking-tighter">
              Item ID: {entity.id}
            </span>
          </div>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 uppercase tracking-tight leading-none">
          {entity.title}
        </h1>

        <p className="text-slate-500 text-sm md:text-lg mb-8 max-w-3xl font-medium leading-relaxed">
          {entity.description}
        </p>

        {entity.images && entity.images.length > 0 && (
          <div className="flex flex-wrap gap-4 mb-12">
            {entity.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Car Preview"
                className="w-40 h-32 object-cover rounded-2xl border border-slate-100 shadow-sm hover:scale-105 transition-transform"
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {specs.map((spec, idx) => (
            <div
              key={idx}
              className="p-6 bg-slate-50 rounded-2xl border border-slate-100"
            >
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {spec.label}
              </p>
              <p className="text-lg font-bold text-slate-800 uppercase">
                {spec.value}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-slate-900 rounded-3xl text-white">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FaUser className="w-5 h-5 text-indigo-400" />
              <h3 className="text-xl font-bold">Seller Information</h3>
            </div>
            <div className="flex items-center gap-1 text-slate-500">
              <FaShieldAlt className="w-4 h-4" />
              <span className="text-[10px] font-mono">
                User ID: {entity.userId}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center text-2xl font-bold">
                {entity.userId.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest">
                  Listing Owner
                </p>
                <p className="text-xl font-bold uppercase tracking-tight">
                  User_{entity.userId.slice(-5)}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <FaEnvelope className="w-4 h-4" />
                <span className="text-sm">Privacy Protected Email</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <FaCalendarAlt className="w-4 h-4" />
                <span className="text-sm">
                  Listed on: {new Date(entity.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[400px] bg-slate-50 border-t lg:border-t-0 lg:border-l border-slate-100 p-8 sm:p-12 flex flex-col justify-between shrink-0">
        <div className="space-y-10">
          <div className="flex items-center gap-2 text-indigo-600">
            <FaMapMarkerAlt className="w-5 h-5" />
            <span className="font-bold uppercase tracking-widest text-[10px]">
              Location & Price
            </span>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Market Location
              </p>
              <p className="text-2xl font-bold text-slate-800 uppercase">
                {entity.city}, {entity.region}
              </p>
            </div>
            <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                Asking Price
              </p>
              <p className="text-4xl font-bold text-slate-900 tracking-tighter leading-none">
                ${entity.price.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
          <button
            disabled={isSubmitting}
            onClick={() => setIsSubmitting(true)}
            className="w-full flex items-center justify-center gap-3 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-black transition-all active:scale-[0.98] disabled:bg-slate-400"
          >
            {isSubmitting ? "Processing..." : "Confirm & Pay"}
            <FaChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => router.back()}
            className="w-full py-2 text-slate-400 font-bold uppercase tracking-widest text-[10px] hover:text-slate-600 transition-colors"
          >
            Go Back & Edit
          </button>
        </div>
      </div>
    </div>
  );
}
