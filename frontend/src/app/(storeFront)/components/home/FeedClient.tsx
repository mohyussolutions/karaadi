"use client";

import { useState, useTransition } from "react";
import UniversalCard from "../Cards/categoriesCards/UniversalCard";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { loadMoreFeedItems } from "@/actions/categories/feedActions";

const INITIAL_DISPLAY = 40;
const DISPLAY_INCREMENT = 10;

export default function FeedClient({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  const [pool, setPool] = useState(initialItems);
  const [displayed, setDisplayed] = useState(
    Math.min(INITIAL_DISPLAY, initialItems.length),
  );
  const [serverPage, setServerPage] = useState(2);
  const [exhausted, setExhausted] = useState(false);
  const [pending, startTransition] = useTransition();

  const showMore = () => {
    const next = displayed + DISPLAY_INCREMENT;

    if (next <= pool.length) {
      setDisplayed(next);
      return;
    }

    if (exhausted) {
      setDisplayed(pool.length);
      return;
    }

    startTransition(async () => {
      const incoming = await loadMoreFeedItems(serverPage);
      if (!incoming.length) {
        setExhausted(true);
        setDisplayed(pool.length);
        return;
      }
      const merged = [...pool, ...incoming];
      setPool(merged);
      setDisplayed(Math.min(displayed + DISPLAY_INCREMENT, merged.length));
      setServerPage((p) => p + 1);
    });
  };

  const visible = pool.slice(0, displayed);
  const hasMore = !exhausted || displayed < pool.length;

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
        {visible.map((item, idx) => (
          <UniversalCard
            key={(item.id ?? item._id ?? idx) as string}
            {...item}
          />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pt-6 pb-4">
          <button
            onClick={showMore}
            disabled={pending}
            className="px-10 py-3 bg-[#1d3557] text-white rounded-xl font-semibold text-sm hover:bg-[#16294a] disabled:opacity-60 transition-colors duration-200 shadow-sm"
          >
            {pending ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}
