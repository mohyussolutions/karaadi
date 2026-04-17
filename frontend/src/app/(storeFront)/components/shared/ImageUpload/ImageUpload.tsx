"use client";
import { MdCloudUpload, MdClose } from "react-icons/md";

interface Props {
  images: File[];
  onAdd: (files: FileList | null) => void;
  onRemove: (index: number) => void;
  maxImages?: number;
  label?: string;
}

export default function ImageUpload({
  images,
  onAdd,
  onRemove,
  maxImages = 10,
  label = "Upload",
}: Props) {
  const canAdd = images.length < maxImages;

  return (
    <div className="flex flex-wrap gap-4">
      {canAdd && (
        <label className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:border-blue-400 transition-all group">
          <MdCloudUpload className="text-3xl text-gray-300 group-hover:text-blue-500 transition-colors" />
          <span className="text-[10px] font-black text-gray-400">{label}</span>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => onAdd(e.target.files)}
          />
        </label>
      )}

      {images.map((img, i) => (
        <div key={i} className="relative w-24 h-24 group">
          <img
            src={URL.createObjectURL(img)}
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

      {images.length > 0 && (
        <p className="w-full text-xs text-gray-400 mt-1">
          {images.length}/{maxImages} images
        </p>
      )}
    </div>
  );
}
