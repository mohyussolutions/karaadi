"use client";

import { useState, useMemo } from "react";
import UniversalCard from "../Cards/categoriesCards/UniversalCard";
import Pagination from "@/app/ui/invoices/pagination";
import { useGetRoute } from "../hooks/useGetRoute";
import { groupByPriorityAndRandomize } from "../hooks/RandomizedItemShowcase";

export default function HomeContent({
  serverSearchResults,
  query,
}: {
  serverSearchResults: any[];
  query: string;
}) {
  const [visibleCount, setVisibleCount] = useState(20);
  const { getRoute } = useGetRoute();

  const displayItems = useMemo(() => {
    return groupByPriorityAndRandomize(serverSearchResults || []);
  }, [serverSearchResults]);

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
