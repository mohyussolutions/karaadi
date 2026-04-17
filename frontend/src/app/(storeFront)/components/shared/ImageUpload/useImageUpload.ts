"use client";
import { useState } from "react";

const MAX_IMAGES = 10;
const MAX_FILE_SIZE_MB = 15;

export function useImageUpload() {
  const [images, setImages] = useState<File[]>([]);

  function addImages(files: FileList | null) {
    if (!files) return;
    const valid = Array.from(files).filter((f) => {
      if (!f.type.startsWith("image/")) return false;
      if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    setImages((prev) => [...prev, ...valid].slice(0, MAX_IMAGES));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function toBase64(): Promise<string[]> {
    return Promise.all(
      images.map(
        (img) =>
          new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(img);
          }),
      ),
    );
  }

  return { images, addImages, removeImage, toBase64, MAX_IMAGES };
}
