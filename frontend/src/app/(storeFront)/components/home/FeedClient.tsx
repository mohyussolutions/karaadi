"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import UniversalCard from "../Cards/categoriesCards/UniversalCard";
import { UniversalCardProps } from "@/app/utils/types/universalCard.types";
import { loadFeedPage } from "@/actions/categories/feedActions";
import { parseSearchQuery } from "@/app/ui/search/parseSearchQuery";
import { SEARCH_EVENT } from "@/app/ui/search/SearchInput";
import {
  DISPLAY_INCREMENT,
  INITIAL_DISPLAY,
} from "@/actions/constant/constant";

function dedupById(items: UniversalCardProps[]): UniversalCardProps[] {
  const seen = new Set<string>();
  return items.filter((i) => {
    const id = String(i.id ?? i._id ?? "");
    if (!id || id === "undefined" || seen.has(id)) return false;
    seen.add(id);
    return true;
  });
}

function normalizeItem(item: any): UniversalCardProps {
  const id = item.id ?? item._id;
  const images =
    Array.isArray(item.images) && item.images.length
      ? item.images
      : item.image
        ? [item.image]
        : [];
  return {
    id,
    _id: id,
    title: item.title ?? item.name ?? "",
    price: item.price,
    city: item.city ?? item.region ?? "",
    images,
    description: item.description ?? "",
    category:
      typeof item.category === "string" && item.category
        ? item.category
        : (item.mainCategory ?? ""),
    subcategory: item.subcategory,
    maGaday: !!item.maGaday,
    isBasic30: !!item.isBasic30,
    isStandard60: !!item.isStandard60,
    isPremium90: !!item.isPremium90,
    type: item.type ?? item.vehicleModel ?? "",
    sellerName: item.sellerName,
  };
}

async function fetchSearch(query: string): Promise<UniversalCardProps[]> {
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    return Array.isArray(data) ? data.map(normalizeItem) : [];
  } catch {
    return [];
  }
}

export default function FeedClient({
  initialItems,
}: {
  initialItems: UniversalCardProps[];
}) {
  const [pool, setPool] = useState(() => dedupById(initialItems));
  const [displayed, setDisplayed] = useState(
    Math.min(INITIAL_DISPLAY, initialItems.length),
  );
  const [serverPage, setServerPage] = useState(2);
  const [exhausted, setExhausted] = useState(initialItems.length === 0);
  const [pending, startTransition] = useTransition();
  const [searchResults, setSearchResults] = useState<
    UniversalCardProps[] | null
  >(null);
  const [searching, setSearching] = useState(false);
  const lastQueryRef = useRef<string>("");

  useEffect(() => {
    const handler = async (e: Event) => {
      const rawQuery: string = (e as CustomEvent).detail?.q ?? "";

      if (!rawQuery.trim()) {
        setSearchResults(null);
        lastQueryRef.current = "";
        return;
      }

      const parsed = parseSearchQuery(rawQuery);
      const apiText = [parsed.text, parsed.location]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const stableKey = `${apiText}|${parsed.price ?? ""}`;

      if (stableKey === lastQueryRef.current) return;
      lastQueryRef.current = stableKey;
      setSearching(true);

      try {
        let items = apiText
          ? await fetchSearch(apiText)
          : dedupById((await loadFeedPage(1)).map(normalizeItem));

        items = dedupById(items);

        if (parsed.location) {
          const loc = parsed.location.toLowerCase();
          items = items.filter((i) =>
            (i.city ?? "").toLowerCase().includes(loc),
          );
        }

        if (parsed.price && parsed.price > 0) {
          items = items.filter((i) => Number(i.price ?? 0) <= parsed.price!);
        }

        setSearchResults(items);
      } finally {
        setSearching(false);
      }
    };

    window.addEventListener(SEARCH_EVENT, handler);
    return () => window.removeEventListener(SEARCH_EVENT, handler);
  }, []);

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
      const raw = await loadFeedPage(serverPage);
      const incoming = raw.map(normalizeItem);
      if (!incoming.length) {
        setExhausted(true);
        setDisplayed(pool.length);
        return;
      }
      const existingIds = new Set(pool.map((i) => String(i.id ?? i._id ?? "")));
      const deduped = incoming.filter((i) => {
        const id = String(i.id ?? i._id ?? "");
        return id && !existingIds.has(id);
      });
      const merged = [...pool, ...deduped];
      setPool(merged);
      setDisplayed(Math.min(displayed + DISPLAY_INCREMENT, merged.length));
      setServerPage((p) => p + 1);
    });
  };

  if (searchResults !== null || searching) {
    return (
      <div>
        {searching ? (
          <FeedSkeleton count={8} />
        ) : searchResults!.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No results found.</p>
            <p className="text-sm mt-1">
              Try a different name, city, or price.
            </p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {searchResults!.length} result
              {searchResults!.length !== 1 ? "s" : ""}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
              {searchResults!.map((item, idx) => (
                <UniversalCard
                  key={(item.id ?? item._id ?? idx) as string}
                  {...item}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  const visible = pool.slice(0, displayed);
  const hasMore = pool.length > 0 && (!exhausted || displayed < pool.length);

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
            className="px-10 py-3 bg-[#0063FB] text-white rounded-xl font-semibold text-sm hover:bg-[#0052d4] disabled:opacity-60 transition-colors duration-200 shadow-sm"
          >
            {pending ? "Loading..." : "See More"}
          </button>
        </div>
      )}
    </div>
  );
}

function FeedSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="aspect-[4/3] rounded-xl bg-gray-100 animate-pulse"
        />
      ))}
    </div>
  );
}
