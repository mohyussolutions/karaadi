"use client";

import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import LinksStyleCard from "../../Cards/containerCards/linksstyleCard";

interface SubCategory {
  labelKey?: string;
  title?: string;
  icon?: React.ReactNode;
}

interface CommonSubCategoryLinksProps {
  items: SubCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onScroll: (direction: "left" | "right") => void;
  scrollRef: React.RefObject<HTMLDivElement | null>;
  t: any;
}

export const CommonSubCategoryLinks = ({
  items,
  selectedId,
  onSelect,
  onScroll,
  scrollRef,
  t,
}: CommonSubCategoryLinksProps) => {
  if (!items?.length) return null;

  return (
    <div className="relative py-1">
      <div className="flex relative items-center">
        <button
          onClick={() => onScroll("left")}
          className="absolute left-0 z-10 bg-white/90 shadow-sm p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-90"
        >
          <FaChevronLeft size={12} className="text-gray-600" />
        </button>

        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-2 scrollbar-hide px-10 py-1 w-full justify-start md:justify-center items-center scroll-smooth"
        >
          {items.map((item, idx) => {
            const id = item.labelKey ?? String(idx);
            const isActive = selectedId === id;

            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className="flex-shrink-0 outline-none"
              >
                <LinksStyleCard
                  title={t(item.labelKey ?? id, {
                    defaultValue: item.title || id,
                  })}
                  icon={item.icon}
                  isActive={isActive}
                  size="sm"
                />
              </button>
            );
          })}
        </div>

        <button
          onClick={() => onScroll("right")}
          className="absolute right-0 z-10 bg-white/90 shadow-sm p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition-all active:scale-90"
        >
          <FaChevronRight size={12} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};
