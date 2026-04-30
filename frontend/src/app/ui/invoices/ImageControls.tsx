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
  <div className="absolute right-3 top-3 z-30 flex gap-2">
    <button
      onClick={onHeartClick}
      aria-label="Save to favorites"
      className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all"
    >
      <AiOutlineHeart className="w-5 h-5 text-red-500" />
    </button>
    <button
      onClick={onZoomClick}
      aria-label="Zoom image"
      className="bg-white/90 backdrop-blur-sm p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all"
    >
      <AiOutlineZoomIn className="w-5 h-5 text-gray-700" />
    </button>
  </div>
);
