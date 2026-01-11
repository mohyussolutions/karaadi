import { useState } from "react";
import Image from "next/image";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";

interface VehicleImageGalleryProps {
  images: string[];
  title: string;
  onHeartClick: () => void;
}

export default function VehicleImageGallery({
  images,
  title,
  onHeartClick,
}: VehicleImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  const selectedImage = images[selectedImageIndex] || "";

  return (
    <div className="relative">
      <div
        className="w-full aspect-[2/2] relative bg-gray-50 rounded-lg overflow-hidden"
        style={{ height: "800px" }}
      >
        {selectedImage ? (
          <>
            <Image
              src={selectedImage}
              alt={title}
              fill
              className="object-cover cursor-zoom-in"
              priority
              quality={100}
              onClick={() => setShowFullImage(true)}
            />
            <ImageControls
              onHeartClick={onHeartClick}
              onZoomClick={() => setShowFullImage(true)}
            />
          </>
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200 text-gray-500">
            No image available
          </div>
        )}

        {images.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow z-10 hover:bg-black/40 transition-colors"
              aria-label="Previous image"
            >
              <IoIosArrowBack className="w-6 h-6 text-white" />
            </button>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow z-10 hover:bg-black/40 transition-colors"
              aria-label="Next image"
            >
              <IoIosArrowForward className="w-6 h-6 text-white" />
            </button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
            {images.map((thumb, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`min-w-[80px] h-16 border rounded-md overflow-hidden focus:outline-none transition ${
                  selectedImageIndex === i
                    ? "ring-2 ring-blue-500"
                    : "border-gray-200"
                }`}
              >
                <img
                  src={thumb}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {showFullImage && selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center cursor-zoom-out z-50"
          onClick={() => setShowFullImage(false)}
        >
          <Image
            src={selectedImage}
            alt={title}
            width={1000}
            height={1000}
            className="max-h-[90vh] object-contain"
          />
        </div>
      )}
    </div>
  );
}
