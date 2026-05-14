"use client";

import { useTotalFavritCount } from "./useTotalFavritCount";

interface FavoriteBadgeProps {
  itemId: string | undefined;
}

export default function FavoriteBadge({ itemId }: FavoriteBadgeProps) {
  const { count, ready } = useTotalFavritCount(itemId);

  if (!ready || count <= 0) return null;

  return (
    <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-white text-gray-800 text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm border border-gray-200">
      {count > 99 ? "99+" : count}
    </span>
  );
}
