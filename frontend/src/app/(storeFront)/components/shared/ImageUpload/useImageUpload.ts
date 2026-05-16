"use client";
import { useState } from "react";
import {
  IMAGE_MAX_COUNT,
  IMAGE_MIN_COUNT,
  IMAGE_MAX_FILE_SIZE_BYTES,
  IMAGE_MAX_SAFE_CHARS,
  IMAGE_COMPRESS_PASSES,
  IMAGE_OUTPUT_FORMAT,
  IMAGE_CANVAS_CONTEXT,
  IMAGE_MIME_PREFIX,
} from "./image.constants";

function drawToCanvas(img: HTMLImageElement, maxPx: number): HTMLCanvasElement {
  const longest = Math.max(img.width, img.height);
  const scale = longest > maxPx ? maxPx / longest : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * scale);
  canvas.height = Math.round(img.height * scale);
  const ctx = canvas.getContext(IMAGE_CANVAS_CONTEXT);
  if (ctx) ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
}

function compressImage(file: File): Promise<string> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    const fallback = () => {
      URL.revokeObjectURL(url);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
      };
      reader.readAsDataURL(file);
    };

    img.onload = () => {
      URL.revokeObjectURL(url);
      try {
        for (const { maxPx, quality } of IMAGE_COMPRESS_PASSES) {
          const canvas = drawToCanvas(img, maxPx);
          if (canvas.width === 0 || canvas.height === 0) break;
          const data = canvas.toDataURL(IMAGE_OUTPUT_FORMAT, quality);
          if (data.length <= IMAGE_MAX_SAFE_CHARS) {
            resolve(data);
            return;
          }
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

async function compressAll(files: File[]): Promise<string[]> {
  const results: string[] = [];
  for (const file of files) {
    results.push(await compressImage(file));
  }
  return results;
}

export function useImageUpload() {
  const [images, setImages] = useState<File[]>([]);

  function addImages(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter(
      (f) => f.type.startsWith(IMAGE_MIME_PREFIX) && f.size <= IMAGE_MAX_FILE_SIZE_BYTES,
    );
    setImages((prev) => [...prev, ...valid].slice(0, IMAGE_MAX_COUNT));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function toBase64(): Promise<string[]> {
    return compressAll(images);
  }

  function resetImages() {
    setImages([]);
  }

  const hasMinImages = images.length >= IMAGE_MIN_COUNT;

  return {
    images,
    addImages,
    removeImage,
    resetImages,
    toBase64,
    hasMinImages,
    IMAGE_MAX_COUNT,
    IMAGE_MIN_COUNT,
  };
}
