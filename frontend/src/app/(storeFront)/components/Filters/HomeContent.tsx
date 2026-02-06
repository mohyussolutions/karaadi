"use client";

import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { useState, useEffect, useMemo } from "react";
import ItemsGrid from "../Cards/mainCard";
import SearchInput from "../shared/(search)/SearchInput";

const CATEGORY_CONFIG = [
  { key: "boats", type: "boat" },
  { key: "cars", type: "car" },
  { key: "jobs", type: "job" },
  { key: "marketplace", type: "marketplace" },
  { key: "motorcycles", type: "motorcycle" },
  { key: "realEstate", type: "real-estate" },
  { key: "tractors", type: "traktor" },
];

interface HomeContentProps {
  initialData: Record<string, any[] | null>;
  children: React.ReactNode;
}

export default function HomeContent({
  initialData,
  children,
}: HomeContentProps) {
  const [data, setData] = useState<Record<string, any[] | null>>(initialData);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setData(initialData);
        return;
      }

      const results = await getGlobalSearchResults(query);

      const filteredData: Record<string, any[]> = {};
      CATEGORY_CONFIG.forEach((cat) => {
        filteredData[cat.key] = results.filter(
          (i: any) => i.itemType === cat.type,
        );
      });

      setData(filteredData);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, initialData]);

  const allItems = useMemo(() => {
    return CATEGORY_CONFIG.flatMap((cat) => {
      const items = data[cat.key];
      if (!Array.isArray(items)) return [];

      return items.map((item: any) => {
        const rawDesc = Array.isArray(item?.description)
          ? item.description.join(" ")
          : item?.description || "";

        return {
          ...item,
          category: cat.key,
          price: Number(item?.price) || 0,
          images: Array.isArray(item?.images) ? item.images : [],
          description:
            rawDesc.length > 100 ? `${rawDesc.substring(0, 100)}...` : rawDesc,
        };
      });
    });
  }, [data]);

  return (
    <div className="space-y-8">
      <SearchInput onSearch={setQuery} />

      <div className="flex flex-col gap-8">{children}</div>

      <ItemsGrid items={allItems} />
    </div>
  );
}
