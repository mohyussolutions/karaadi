"use client";

import { useState, useMemo } from "react";
import UniversalCard from "../Cards/categoriesCards/UniversalCard";
import Pagination from "@/app/ui/invoices/pagination";
import { useGetRoute } from "../hooks/useGetRoute";
import { groupByPriorityAndRandomize } from "../hooks/RandomizedItemShowcase";

function parseQuery(query: string) {
  const parts = query.split("/").map((p) => p.trim()).filter(Boolean);
  return {
    text: parts[0] ?? "",
    location: parts.slice(1).join(" ").toLowerCase(),
  };
}

export default function HomeContent({
  serverSearchResults,
  query,
  minPrice,
  maxPrice,
}: {
  serverSearchResults: any[];
  query: string;
  minPrice?: number;
  maxPrice?: number;
}) {
  const [visibleCount, setVisibleCount] = useState(20);
  const { getRoute } = useGetRoute();

  const { location } = parseQuery(query);

  const displayItems = useMemo(() => {
    let items = groupByPriorityAndRandomize(serverSearchResults || []);

    if (location) {
      items = items.filter((item: any) => {
        const city = (item.city ?? item.region ?? "").toLowerCase();
        return city.includes(location);
      });
    }

    if (minPrice !== undefined && minPrice > 0) {
      items = items.filter((item: any) => Number(item.price ?? 0) >= minPrice);
    }

    if (maxPrice !== undefined && maxPrice > 0) {
      items = items.filter((item: any) => Number(item.price ?? 0) <= maxPrice);
    }

    return items;
  }, [serverSearchResults, location, minPrice, maxPrice]);

  const itemsToShow = useMemo(() => {
    return displayItems.slice(0, visibleCount);
  }, [displayItems, visibleCount]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {itemsToShow.length > 0 ? (
          itemsToShow.map((item: any, idx: number) => {
            const itemId = item.id || item._id;
            const routePrefix = getRoute(item.category);
            const dynamicHref = itemId ? `${routePrefix}/${itemId}` : "#";

            return (
              <UniversalCard
                key={itemId || idx}
                id={itemId}
                title={item.title || item.name}
                price={item.price}
                city={item.city || item.region}
                images={item.images || (item.image ? [item.image] : [])}
                description={item.description}
                category={item.category}
                maGaday={!!item.maGaday}
                isBasic30={item.isBasic30}
                isStandard60={item.isStandard60}
                isPremium90={item.isPremium90}
                linkHref={dynamicHref}
                type={item.type || item.vehicleModel}
              />
            );
          })
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No items found.
          </div>
        )}
      </div>

      {visibleCount < displayItems.length && (
        <Pagination
          hasMore={true}
          onSeeMore={() => setVisibleCount((prev) => prev + 20)}
        />
      )}
    </div>
  );
}
