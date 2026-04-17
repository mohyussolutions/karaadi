import React from "react";
import UniversalCard from "@/app/(storeFront)/components/Cards/categoriesCards/UniversalCard";
import { FeedItem } from "@/app/utils/types/feed";

type CategoryFetcher = () => Promise<FeedItem[] | null>;

export default async function CategoryBlock({
  title,
  fetcher,
  limit = 6,
}: {
  title: string;
  fetcher: CategoryFetcher;
  limit?: number;
}) {
  let items: FeedItem[] | null = null;
  try {
    items = await fetcher();
  } catch (_err: unknown) {
    items = null;
  }

  if (!items || items.length === 0) {
    return null;
  }

  const toShow = items.slice(0, limit) as FeedItem[];

  return (
    <section className="py-6">
      <h2 className="text-lg font-bold mb-3">{title}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {toShow.map((it: FeedItem, idx: number) => (
          <UniversalCard
            key={String(it._id ?? it.id ?? idx)}
            id={it._id ?? it.id}
            title={it.title}
            description={it.description as string | undefined}
            images={it.images}
            price={it.price}
            city={it.city}
            category={
              Array.isArray(it.category)
                ? (it.category as string[])[0]
                : (it.category as string | undefined)
            }
            subcategory={it.subcategory}
            maGaday={!!it.maGaday}
            isBasic30={it.isBasic30}
            isStandard60={it.isStandard60}
            isPremium90={it.isPremium90}
            type={it.type}
          />
        ))}
      </div>
    </section>
  );
}
