"use client";

import { useState } from "react";
import UniversalCard from "../Cards/categoriesCards/UniversalCard";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";

const INITIAL_COUNT = 52;
const INCREMENT = 20;
const MAX_COUNT = 110;

export default function DataFeedPaginated({
  items,
}: {
  items: UniversalCardProps[];
}) {
  const [visible, setVisible] = useState(INITIAL_COUNT);
  const shown = items.slice(0, visible);
  const hasMore = visible < items.length && visible < MAX_COUNT;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
        {shown.map((item, idx) => (
          <UniversalCard
            key={(item.id ?? item._id ?? idx) as string}
            {...item}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6 pb-4">
          <button
            onClick={() =>
              setVisible((v) =>
                Math.min(v + INCREMENT, MAX_COUNT, items.length)
              )
            }
            className="px-10 py-3 bg-[#1d3557] text-white rounded-xl font-semibold text-sm hover:bg-[#16294a] transition-colors duration-200 shadow-sm"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
}
