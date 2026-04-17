"use client";

import React from "react";
import { AiOutlineHeart, AiOutlineZoomIn } from "react-icons/ai";

export const ImageControls = ({
  onHeartClick,
  onZoomClick,
}: {
  onHeartClick: () => void;
  onZoomClick?: () => void;
}) => (
  <div className="absolute right-4 top-4 z-20 flex gap-2">
    <button
      onClick={onHeartClick}
      aria-label="save"
      className="bg-white/80 p-2 rounded-full shadow hover:bg-white"
    >
      <AiOutlineHeart className="w-5 h-5 text-red-500" />
    </button>
    <button
      onClick={() => onZoomClick?.()}
      aria-label="zoom"
      className="bg-white/80 p-2 rounded-full shadow hover:bg-white"
    >
      <AiOutlineZoomIn className="w-5 h-5 text-gray-700" />
    </button>
  </div>
);
