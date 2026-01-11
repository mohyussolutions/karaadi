"use client";

import { AiOutlineHeart, AiOutlineZoomIn } from "react-icons/ai";

interface ImageControlsProps {
  onHeartClick: () => void;
  onZoomClick: () => void;
}

export function ImageControls({
  onHeartClick,
  onZoomClick,
}: ImageControlsProps) {
  return (
    <div className="absolute top-2 right-2 flex gap-2 z-10">
      <button
        onClick={onHeartClick}
        className="p-2 bg-white/90 rounded-full shadow hover:bg-green-100 transition-colors"
        aria-label="Save to favorites"
      >
        <AiOutlineHeart className="text-gray-700 w-5 h-5" />
      </button>
      <button
        onClick={onZoomClick}
        className="p-2 bg-white/90 rounded-full shadow hover:bg-blue-100 transition-colors"
        aria-label="Zoom image"
      >
        <AiOutlineZoomIn className="text-gray-700 w-5 h-5" />
      </button>
    </div>
  );
}
