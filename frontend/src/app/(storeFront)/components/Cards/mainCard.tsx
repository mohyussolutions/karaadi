"use client";
import React from "react";
import UniversalCard from "./UniversalCard";
import { FeedItem } from "@/app/utils/types/feed";

interface ItemsGridProps {
  items: FeedItem[];
  onItemView?: (item: FeedItem) => void;
}

export default function ItemsGrid({ items }: ItemsGridProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100 mx-4">
        <p className="text-gray-400 font-medium italic">
          Ma jiraan waxyaabo la helay
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {items.map((item, index) => (
        <UniversalCard
          key={`${item.category || "item"}-${item.id || item._id || index}`}
          id={(item.id ?? item._id) as string | number}
          title={item.title || "Untitled"}
          description={item.description || item.title}
          city={item.city || "Mogadishu"}
          price={item.price || 0}
          images={item.images || []}
          category={item.category}
        />
      ))}
    </div>
  );
}
