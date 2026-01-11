import React from "react";
import Image from "next/image";

interface SaveFavoriteModelProps {
  onConfirm: () => void;
  onCancel: () => void;
  backgroundImage: string;
}

function SaveFavoriteModel({
  onConfirm,
  onCancel,
  backgroundImage,
}: SaveFavoriteModelProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt="Background"
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-8 flex flex-col items-center text-center z-10">
        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold">Save to Favorites?</h3>
        <p className="mb-6 text-gray-500 text-sm">
          Add this item to your list for quick access later.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={onConfirm}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold"
          >
            Confirm & Save
          </button>
          <button
            onClick={onCancel}
            className="w-full bg-gray-100 text-gray-600 py-3 rounded-xl font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveFavoriteModel;
