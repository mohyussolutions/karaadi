"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import {
  FaTag,
  FaCar,
  FaCalendarAlt,
  FaTachometerAlt,
  FaFileAlt,
  FaPalette,
  FaMapMarkerAlt,
  FaImage,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

interface Props {
  item: any;
  plan: any;
  itemFee: number;
  planPrice: number;
  total: number;
}

export default function ListingSummaryPanel({ item, plan, itemFee, planPrice, total }: Props) {
  const images: string[] = Array.isArray(item.images) ? item.images.slice(0, 10) : [];
  const [slideIndex, setSlideIndex] = useState(0);
  const prevSlide = () => setSlideIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  const nextSlide = () => setSlideIndex((i) => (i === images.length - 1 ? 0 : i + 1));

  return (
    <div className="w-full lg:w-2/3 bg-white border border-gray-200 rounded-2xl overflow-hidden">
      <div className="px-4 sm:px-5 py-3.5 border-b border-gray-100">
        <h2 className="font-bold text-sm text-gray-900">Listing Summary</h2>
      </div>

      <ImageSlider
        images={images}
        slideIndex={slideIndex}
        setSlideIndex={setSlideIndex}
        prevSlide={prevSlide}
        nextSlide={nextSlide}
      />

      <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-base sm:text-lg text-gray-900 leading-snug">{item.title}</h3>
        <p className="text-gray-400 text-[11px] mt-0.5 uppercase tracking-wide">
          {item.category}{item.subCategory ? ` · ${item.subCategory}` : ""}
        </p>
      </div>

      <ListingAttributes item={item} />
      <PriceSummary item={item} plan={plan} itemFee={itemFee} planPrice={planPrice} total={total} />
    </div>
  );
}

function ImageSlider({
  images,
  slideIndex,
  setSlideIndex,
  prevSlide,
  nextSlide,
}: {
  images: string[];
  slideIndex: number;
  setSlideIndex: (i: number) => void;
  prevSlide: () => void;
  nextSlide: () => void;
}) {
  if (images.length === 0) {
    return (
      <div className="w-full h-40 sm:h-52 bg-gray-50 border-b border-gray-100 flex flex-col items-center justify-center text-gray-300 gap-2">
        <FaImage size={24} />
        <span className="text-xs text-gray-400">No images uploaded</span>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-48 sm:h-64 bg-gray-900 select-none">
        <Image
          key={slideIndex}
          src={images[slideIndex]}
          alt={`Photo ${slideIndex + 1}`}
          fill
          className="object-contain"
        />
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10 touch-manipulation"
            >
              <FaChevronLeft size={11} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition z-10 touch-manipulation"
            >
              <FaChevronRight size={11} />
            </button>
          </>
        )}
        <span className="absolute top-2 right-2 bg-black/55 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          {slideIndex + 1} / {images.length}
        </span>
      </div>

      {images.length > 1 && (
        <div className="flex gap-1.5 px-3 sm:px-4 py-2.5 overflow-x-auto bg-gray-50 border-b border-gray-100 scrollbar-hide">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setSlideIndex(i)}
              className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all touch-manipulation ${
                i === slideIndex
                  ? "border-blue-500 ring-2 ring-blue-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image src={src} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

function ListingAttributes({ item }: { item: any }) {
  const { t } = useTranslation();

  const attrs = [
    item.make && { icon: <FaTag className="text-blue-400" size={11} />, label: t("summary.make", "Make"), value: item.make },
    (item.modelName || item.boatModel || item.model) && { icon: <FaCar className="text-blue-400" size={11} />, label: t("summary.model", "Model"), value: item.modelName || item.boatModel || item.model },
    item.year && { icon: <FaCalendarAlt className="text-blue-400" size={11} />, label: t("summary.year", "Year"), value: item.year },
    item.mileage && { icon: <FaTachometerAlt className="text-blue-400" size={11} />, label: t("summary.mileage", "Mileage"), value: `${item.mileage} km` },
    item.type && { icon: <FaFileAlt className="text-blue-400" size={11} />, label: t("summary.type", "Type"), value: item.type },
    item.color && { icon: <FaPalette className="text-blue-400" size={11} />, label: t("summary.color", "Color"), value: item.color },
    item.city && { icon: <FaMapMarkerAlt className="text-blue-400" size={11} />, label: t("summary.location", "Location"), value: item.city },
    { icon: <FaTag className="text-blue-400" size={11} />, label: t("summary.price", "Price"), value: `$${Number(item.price || 0).toLocaleString()}` },
  ].filter(Boolean) as { icon: React.ReactNode; label: string; value: string }[];

  return (
    <div className="px-4 sm:px-5 py-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {attrs.map((a, i) => (
          <div key={i} className="bg-gray-50 border border-gray-100 rounded-xl p-2.5 sm:p-3 flex items-start gap-2">
            <span className="mt-0.5 flex-shrink-0">{a.icon}</span>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-0.5 leading-none">
                {a.label}
              </span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm truncate block">{a.value}</span>
            </div>
          </div>
        ))}
      </div>

      {item.description && (
        <div className="mt-3 bg-gray-50 border border-gray-100 rounded-xl p-3 sm:p-4">
          <span className="text-[9px] sm:text-[10px] uppercase tracking-widest text-gray-400 font-semibold block mb-1">
            {t("summary.description", "Description")}
          </span>
          <p className="text-gray-600 text-xs sm:text-sm leading-relaxed line-clamp-4">{item.description}</p>
        </div>
      )}
    </div>
  );
}

function PriceSummary({ item, plan, itemFee, planPrice, total }: { item: any; plan: any; itemFee: number; planPrice: number; total: number }) {
  const { t } = useTranslation();

  return (
    <div className="px-4 sm:px-5 py-4 bg-gray-50 border-t border-gray-100">
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{t("summary.itemPrice", "Item Price")}</span>
          <span className="font-semibold text-gray-700">${Number(item.price || 0).toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{t("summary.listingFee", "Listing Fee")}</span>
          <span className="font-semibold text-gray-700">${itemFee.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            {t("summary.planPrice", "Plan Price")} ({plan?.days || 30}d)
          </span>
          <span className="font-semibold text-gray-700">${planPrice.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center pt-3 mt-1 border-t border-gray-200">
          <span className="font-bold text-gray-900">{t("summary.total", "Total")}</span>
          <span className="font-extrabold text-lg sm:text-xl text-blue-600">${total.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
