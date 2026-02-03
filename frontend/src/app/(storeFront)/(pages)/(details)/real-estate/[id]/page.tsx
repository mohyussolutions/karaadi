"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import { useGetRealEstateItemByIdQuery } from "@/app/(storeFront)/store/slices/realtStateSlice";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { verifySession } from "@/actions/core/authAction";

export type Item = {
  id: string;
  title: string;
  price: number;
  city: string;
  images?: (string | File)[];
  make?: string;
  model?: string;
  year?: number;
  mileage?: number;
  description?: string | string[];
};
function RealEstateDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [currentUser, setCurrentUser] = useState<any>(null);

  const {
    data: realEstate,
    isLoading,
    error,
  } = useGetRealEstateItemByIdQuery(id, { skip: !id });

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [mainImageError, setMainImageError] = useState(false);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await verifySession();
        if (mounted) {
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Session check failed", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  }

  if (error || !realEstate) {
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        Real Estate item not found
      </div>
    );
  }

  const images = Array.isArray(realEstate.images)
    ? realEstate.images.filter(Boolean)
    : [];
  const selectedImage = images[selectedImageIndex] || "";
  const isRemoteSelected =
    typeof selectedImage === "string" &&
    (selectedImage.startsWith("http://") ||
      selectedImage.startsWith("https://"));

  const handleHeartClick = () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setShowModal(true);
  };
  const handleModalConfirm = () => {
    setShowModal(false);
    router.push("/mine/favorites");
  };
  const handleModalCancel = () => setShowModal(false);

  const showPreviousImage = () =>
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  const showNextImage = () =>
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );

  return (
    <>
      <div className="my-8">
        <div className="ml-2 font-mono text-blue-600 text-sm">
          <p>
            {realEstate.region ?? ""}, {realEstate.city}
          </p>
        </div>

        <div className="max-w-6xl mx-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* IMAGE SECTION */}
          <div className="relative">
            <div
              className="w-full aspect-[2/2] relative bg-gray-50 rounded-lg overflow-hidden"
              style={{ height: "800px" }}
            >
              {selectedImage ? (
                <>
                  <Image
                    src={
                      mainImageError
                        ? "/images/job-placeholder.png"
                        : selectedImage
                    }
                    alt={realEstate.title}
                    fill
                    className="object-cover cursor-zoom-in"
                    priority
                    quality={100}
                    unoptimized={isRemoteSelected}
                    onError={() => setMainImageError(true)}
                    onClick={() => setShowFullImage(true)}
                  />
                  <ImageControls
                    onHeartClick={handleHeartClick}
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
                    onClick={showPreviousImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow z-10 hover:bg-black/40 transition-colors"
                  >
                    <IoIosArrowBack className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={showNextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 p-2 rounded-full shadow z-10 hover:bg-black/40 transition-colors"
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
          </div>

          {/* DETAILS SECTION */}
          <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
            <GoBackBtn />
            <h1 className="text-2xl font-bold">{realEstate.title}</h1>

            <div className="text-xl font-bold text-blue-700">
              {typeof realEstate.price === "number"
                ? realEstate.price.toLocaleString()
                : realEstate.price}{" "}
              $
            </div>

            <div className="flex gap-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded">
                Contact Seller
              </button>
            </div>

            <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
              <p className="mb-2 font-semibold">
                Safe transaction with Fiks Ferdig
              </p>
              <p>
                The item is shipped to you, and you have 24 hours to inspect it
                before the money is transferred to the seller.
              </p>
              <Link href="#" className="text-blue-500 underline">
                Read more
              </Link>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-1">Description</h2>
              <div className="text-gray-600">
                {typeof realEstate.description === "string"
                  ? realEstate.description
                  : "No description available."}
              </div>
            </div>

            <UserCard
              user={{
                id: realEstate?.user?.id ?? "unknown-id",
                username: realEstate?.user?.username ?? "Unknown Seller",
                profileImage: realEstate?.user?.profileImage || "/user.jpg",
                phone: realEstate?.user?.phone ?? null,
              }}
              isLoggedIn={false}
              itemId={""}
              itemName={""}
            />
          </div>
        </div>

        {showModal && (
          <SaveFavoriteModel
            onConfirm={handleModalConfirm}
            onCancel={handleModalCancel}
            backgroundImage={images[0]}
          />
        )}

        {showFullImage && images.length > 0 && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="relative w-full h-full max-w-[90vw] max-h-[90vh] flex items-center">
              <button
                onClick={showPreviousImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white/50 z-20"
              >
                <IoIosArrowBack className="w-8 h-8 text-white" />
              </button>

              <div className="relative flex-1 h-full">
                <Image
                  src={images[selectedImageIndex]}
                  alt={`Full view - ${realEstate.title}`}
                  fill
                  className="object-contain"
                  quality={100}
                  unoptimized={
                    typeof images[selectedImageIndex] === "string" &&
                    (images[selectedImageIndex].startsWith("http://") ||
                      images[selectedImageIndex].startsWith("https://"))
                  }
                />
              </div>

              <button
                onClick={showNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white/50 z-20"
              >
                <IoIosArrowForward className="w-8 h-8 text-white" />
              </button>
            </div>

            <button
              onClick={() => setShowFullImage(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default RealEstateDetails;
