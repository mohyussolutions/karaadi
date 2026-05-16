"use client";
import { useEffect, useRef } from "react";
import { MdCloudUpload, MdClose } from "react-icons/md";
import { IMAGE_MAX_COUNT, IMAGE_MIN_COUNT } from "./image.constants";

interface Props {
  images: File[];
  onAdd: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  label?: string;
}

export default function ImageUpload({ images, onAdd, onRemove, label = "Upload" }: Props) {
  const canAdd = images.length < IMAGE_MAX_COUNT;
  const belowMin = images.length < IMAGE_MIN_COUNT;

  const urlsRef = useRef<string[]>([]);

  useEffect(() => {
    urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
    urlsRef.current = images.map((f) => URL.createObjectURL(f));
    return () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u));
  }, [images]);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-4">
        {canAdd && (
          <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all group">
            <MdCloudUpload className="text-3xl text-gray-300 group-hover:text-blue-500 transition-colors" />
            <span className="text-[10px] font-black text-gray-400" suppressHydrationWarning>
              {label}
            </span>
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => onAdd(e.target.files)}
            />
          </label>
        )}

        {urlsRef.current.map((src, i) => (
          <div key={i} className="relative w-24 h-24 group">
            <img
              src={src}
              className="w-full h-full object-cover rounded-2xl shadow-md"
              alt="preview"
            />
            {i === 0 && (
              <span className="absolute bottom-1 left-1 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                Main
              </span>
            )}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-7 h-7 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            >
              <MdClose size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className={images.length > 0 ? "text-gray-400" : "text-gray-300"}>
          {images.length}/{IMAGE_MAX_COUNT}
        </span>
        {belowMin && images.length > 0 && (
          <span className="text-amber-500 font-semibold">
            Min {IMAGE_MIN_COUNT} images required
          </span>
        )}
        {belowMin && images.length === 0 && (
          <span className="text-gray-400">
            {IMAGE_MIN_COUNT}–{IMAGE_MAX_COUNT} images
          </span>
        )}
        {!belowMin && (
          <span className="text-emerald-500 font-semibold">✓</span>
        )}
      </div>
    </div>
  );
}
