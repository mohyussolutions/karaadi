import React from "react";

export const usehandleHorizontalScroll = (
  ref: React.RefObject<HTMLDivElement | null>,
) => {
  const scroll = (direction: "left" | "right") => {
    if (ref.current) {
      const { scrollLeft, clientWidth } = ref.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;

      ref.current.scrollTo({
        left: scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return { scroll };
};
