"use client";
import { useState } from "react";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 15;
const MAX_SAFE_CHARS = 1_500_000;

const PASSES = [
  { maxPx: 1200, quality: 0.82 },
  { maxPx: 900, quality: 0.72 },
  { maxPx: 700, quality: 0.65 },
];

function drawToCanvas(img: HTMLImageElement, maxPx: number): HTMLCanvasElement {
  const longest = Math.max(img.width, img.height);
  const scale = longest > maxPx ? maxPx / longest : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    const fallback = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    };

    img.onload = () => {
      try {
        URL.revokeObjectURL(url);
        for (const { maxPx, quality } of PASSES) {
          const canvas = drawToCanvas(img, maxPx);
          if (canvas.width === 0 || canvas.height === 0) break;
          const data = canvas.toDataURL("image/jpeg", quality);
          if (data.length <= MAX_SAFE_CHARS) { resolve(data); return; }
        }
        fallback();
      } catch {
        fallback();
      }
    };
    img.onerror = fallback;
    img.src = url;
  });
}

export function useImageUpload() {
  const [images, setImages] = useState<File[]>([]);

  function addImages(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith("image/") && f.size <= MAX_FILE_SIZE_MB * 1024 * 1024,
    );
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function toBase64(): Promise<string[]> {
    return Promise.all(images.map(compressImage));
  }

  function resetImages() {
    setImages([]);
  }

  return { images, addImages, removeImage, resetImages, toBase64, MAX_IMAGES };
}
