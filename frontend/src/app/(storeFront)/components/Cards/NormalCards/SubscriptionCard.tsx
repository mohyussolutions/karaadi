"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { getCategoryRoute } from "../../hooks/useGetRoute";

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlNWU3ZWIiLz48L3N2Zz4=";

interface Subscription {
  id: string;
  title: string;
  category: string;
  region: string;
  cities: string[];
  priceMin?: number;
  priceMax?: number;
  images?: string[];
  isPaid: boolean;
}

export default function SubscriptionCard({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  if (!subscriptions || subscriptions.length === 0) return null;

  return (
    <div className="w-full py-8">
      <div className="flex items-center gap-2 mb-6 px-4">
        <h2 className="text-xl font-bold text-gray-800 uppercase tracking-tight">
          Premium Listings
        </h2>
        <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
          PRO
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
        {subscriptions.map((sub) => (
          <Link
            key={sub.id}
            href={`/${getCategoryRoute(sub.category)}/${sub.id}`}
            className="group relative flex flex-col bg-white border border-blue-100 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="relative h-48 w-full bg-gray-100">
              <Image
                src={sub.images?.[0] || "/placeholder.png"}
                alt={sub.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
              />
              <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-lg flex items-center gap-1">
                <AiOutlineCheckCircle size={14} />
                VERIFIED
              </div>
            </div>

            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
                  {sub.category}
                </span>
                <span className="text-gray-400 text-[10px] font-medium uppercase">
                  {sub.region}
                </span>
              </div>

              <h3 className="text-gray-900 font-bold text-lg mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
                {sub.title}
              </h3>

              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-blue-700 font-black text-xl">
                  {sub.priceMin
                    ? `$${sub.priceMin.toLocaleString()}`
                    : "Contact for Price"}
                </span>
                {sub.priceMax && (
                  <span className="text-gray-400 text-sm font-medium">
                    {" "}
                    - ${sub.priceMax.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="pt-4 border-t border-gray-50 flex items-center justify-between">
                <p className="text-[11px] text-gray-500 font-medium truncate italic">
                  Available in: {sub.cities.join(", ")}
                </p>
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
