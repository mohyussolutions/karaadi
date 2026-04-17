"use client";

import React, { useState, useEffect, useCallback } from "react";

import {
  FaBriefcase,
  FiCheckCircle,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
} from "@/app/utils/icons";

interface Agency {
  image: string;
  name: string;
  status?: string;
  type: string;
  location: string;
  specialty: string;
  link?: string;
}

export default function AgenciesClient({
  initialAgencies,
}: {
  initialAgencies: Agency[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const agencies = initialAgencies || [];

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev === agencies.length - 1 ? 0 : prev + 1));
  }, [agencies.length]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? agencies.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (agencies.length <= 1) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide, agencies.length]);

  if (agencies.length === 0) return null;

  const current = agencies[currentIndex];

  return (
    <div className="bg-gray-50 py-2 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="mb-3">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <FaBriefcase className="text-blue-600" size={20} />
            Agencies
          </h1>
        </div>

        <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-xl group bg-gray-200">
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <FiChevronLeft size={20} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100"
          >
            <FiChevronRight size={20} />
          </button>

          <div
            className="w-full h-full duration-700 ease-in-out bg-cover bg-center flex items-center justify-center transition-all relative"
            style={{ backgroundImage: `url(${current.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

            <div className="relative text-center text-white px-6 max-w-2xl">
              <div className="inline-flex items-center gap-1 bg-emerald-500 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase mb-3 shadow-lg">
                <FiCheckCircle size={10} /> {current.status || "Verified"}
              </div>

              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-1 leading-none">
                {current.name}
              </h2>

              <p className="text-blue-400 font-bold text-xs uppercase tracking-[0.2em] mb-6">
                {current.type}
              </p>

              <div className="flex justify-center gap-6 mb-6 border-t border-white/10 pt-4">
                <div>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                    Base
                  </p>
                  <p className="font-bold text-xs">{current.location}</p>
                </div>
                <div>
                  <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                    Expertise
                  </p>
                  <p className="font-bold text-xs">{current.specialty}</p>
                </div>
              </div>

              <a
                href={current.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white text-gray-900 rounded-lg text-[9px] font-black uppercase tracking-widest flex items-center gap-2 mx-auto hover:bg-blue-600 hover:text-white transition-all shadow-md w-fit"
              >
                View Agency <FiExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
            {agencies.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`h-1 transition-all duration-300 rounded-full ${
                  currentIndex === index
                    ? "w-6 bg-blue-500"
                    : "w-1.5 bg-white/40 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
