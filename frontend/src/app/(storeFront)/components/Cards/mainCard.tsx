"use client";

import React, { useState } from "react";
import SeeEmore from "../shared/buttons/SeeEmore";
import CardItem from "./CardItem";
import UniversalCard from "./UniversalCard";

interface ItemsGridProps {
  items: any[];
}

const ITEMS_PER_LOAD = 10;
const INITIAL_LOAD = 30;
const MAX_ITEMS = 100;

export default function ItemsGrid({ items }: ItemsGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);

  if (!Array.isArray(items) || items.length === 0) {
    return null;
  }

  const itemsToShow = items.slice(0, Math.min(visibleCount, MAX_ITEMS));

  return (
    <div className={"relative transition-opacity"}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {itemsToShow.map((item, index) => (
          <UniversalCard
            key={item.id ? `${item.category}-${item.id}` : index}
            id={item.id}
            title={item.title}
            description={item.description}
            city={item.city}
            price={item.price}
            images={item.images}
            maGaday={item.maGaday}
            category={item.category}
          />
        ))}
      </div>

      {items.length > visibleCount && (
        <div className="flex justify-center pb-10">
          <SeeEmore
            onClick={() =>
              setVisibleCount((prev) =>
                Math.min(prev + ITEMS_PER_LOAD, MAX_ITEMS),
              )
            }
          />
        </div>
      )}
    </div>
  );
}
