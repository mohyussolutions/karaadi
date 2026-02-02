"use client";

import { getGlobalSearchResults } from "@/actions/common/getGlobalSearchResults";
import { useState, useEffect } from "react";
import ItemsGrid from "../Cards/mainCard";
import SearchInput from "@/app/(storeFront)/components/shared/(search)/SearchInput";

export default function HomeContent({
  initialData,
  children,
}: {
  initialData: any;
  children: React.ReactNode;
}) {
  const [data, setData] = useState(initialData);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (!query.trim()) {
        setData(initialData);
        return;
      }

      const results = await getGlobalSearchResults(query);

      setData({
        boats: results.filter((i: any) => i.itemType === "boat"),
        cars: results.filter((i: any) => i.itemType === "car"),
        jobs: results.filter((i: any) => i.itemType === "job"),
        marketplace: results.filter((i: any) => i.itemType === "marketplace"),
        motorcycles: results.filter((i: any) => i.itemType === "motorcycle"),
        realEstate: results.filter((i: any) => i.itemType === "real-estate"),
        tractors: results.filter((i: any) => i.itemType === "traktor"),
      });
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [query, initialData]);

  return (
    <div className="space-y-8">
      <SearchInput onSearch={setQuery} />

      <div className="flex flex-col gap-8">{children}</div>

      <ItemsGrid
        items={[
          ...(Array.isArray(data?.boats)
            ? data.boats.map((item: any) => ({
                ...item,
                category: "boats",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.cars)
            ? data.cars.map((item: any) => ({
                ...item,
                category: "cars",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.jobs)
            ? data.jobs.map((item: any) => ({
                ...item,
                category: "jobs",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.marketplace)
            ? data.marketplace.map((item: any) => ({
                ...item,
                category: "marketplace",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.motorcycles)
            ? data.motorcycles.map((item: any) => ({
                ...item,
                category: "motorcycles",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.realEstate)
            ? data.realEstate.map((item: any) => ({
                ...item,
                category: "real-estate",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
          ...(Array.isArray(data?.tractors)
            ? data.tractors.map((item: any) => ({
                ...item,
                category: "tractors",
                price: Number(item?.price) || 0,
                images: Array.isArray(item?.images) ? item.images : [],
              }))
            : []),
        ]}
      />
    </div>
  );
}
