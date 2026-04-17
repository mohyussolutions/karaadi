import { useState, useEffect, useCallback } from "react";

import { AdImageData } from "@/app/utils/types/ads";

export function useImageSlider(images: AdImageData[], intervalMs = 500) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1,
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [images.length, intervalMs]);

  const showPrevImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  }, [images.length]);

  const showNextImage = useCallback(() => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1,
    );
  }, [images.length]);

  return { currentImageIndex, showPrevImage, showNextImage };
}
