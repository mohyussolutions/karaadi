"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import { toast } from "react-toastify";

import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";

import { verifySession } from "@/actions/core/authAction";
import { getRealEstateById } from "@/actions/categories/realEstateActions";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { API_ENDPOINTS } from "@/actions/constant/sockets";

interface RealEstateItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  images: (string | File)[];
  region?: string;
  city?: string;
  user?:
    | {
        id: string;
        _id?: string;
        username: string;
        profileImage?: string;
        phone?: string;
      }
    | string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  subCategory?: string;
  maGadayn?: boolean;
  userId?: string;
}

const isValidImageUrl = (url: string | null | undefined): url is string => {
  return (
    typeof url === "string" &&
    url.length > 0 &&
    (url.startsWith("http") ||
      url.startsWith("/") ||
      url.startsWith("data:image"))
  );
};

function RealEstateDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [realEstate, setRealEstate] = useState<RealEstateItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [data, user] = await Promise.all([
          getRealEstateById(id),
          verifySession(),
        ]);

        if (mounted) {
          if (data) {
            setRealEstate({
              ...data,
              id: data._id || data.id,
            });
          }
          setCurrentUser(user);
        }
      } catch (error) {
        console.error("Initialization failed", error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const getItemUser = () => {
    if (!realEstate) return null;

    if (typeof realEstate.user === "object" && realEstate.user !== null) {
      return {
        id: realEstate.user._id || realEstate.user.id || "",
        username: realEstate.user.username || "Seller",
        profileImage: realEstate.user.profileImage || null,
        phone: realEstate.user.phone || null,
      };
    }

    return {
      id: realEstate.userId || realEstate.user || "",
      username: "Seller",
      profileImage: null,
      phone: null,
    };
  };

  const handleSendMessage = async () => {
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const itemUser = getItemUser();
    const finalReceiverId = itemUser?.id || realEstate?.userId;
    const finalItemId = realEstate?.id;

    if (!finalReceiverId || !finalItemId || realEstate?.maGadayn) {
      if (realEstate?.maGadayn) {
        toast.warning("This property has been sold");
      }
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: finalReceiverId,
          itemId: finalItemId,
          itemModel: "RealEstate",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const chatId = result.chat?.id || result.id;
        if (chatId) {
          router.push(`/messages/${chatId}`);
          return;
        }
      }
      router.push(
        `/messages?itemId=${finalItemId}&sellerId=${finalReceiverId}`,
      );
    } catch {
      router.push(
        `/messages?itemId=${finalItemId}&sellerId=${finalReceiverId}`,
      );
    }
  };

  const getThumbSrc = (thumb: string | File): string => {
    if (typeof thumb === "string") {
      if (isValidImageUrl(thumb)) return thumb;
      return "/placeholder.png";
    }
    try {
      return URL.createObjectURL(thumb);
    } catch {
      return "/placeholder.png";
    }
  };

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
    if (realEstate?.maGadayn) return toast.warning("Alaabtan waa la gatay");
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (!realEstate) return;
    try {
      const response: any = await addToFavorite({
        title: realEstate.title,
        description: realEstate.description,
        price: String(realEstate.price),
        image:
          typeof realEstate.images[0] === "string" &&
          isValidImageUrl(realEstate.images[0] as string)
            ? (realEstate.images[0] as string)
            : "",
        itemId: realEstate.id,
        category: "RealEstate",
      });

      if (response?.message === "You have already saved this item") {
        toast.info("Alaabtan mar horre ayaad kaydisay!");
      } else {
        toast.success(`"${realEstate.title}" waa la kaydiyay!`);
        setTimeout(() => router.push("/mine/favorites"), 1200);
      }
      setShowModal(false);
    } catch {
      toast.error("Wuu ku fashilmay kaydinta");
    }
  };

  const images = useMemo(() => {
    if (!realEstate?.images) return [];
    return realEstate.images.filter((img) => {
      if (typeof img === "string") return isValidImageUrl(img);
      return true;
    });
  }, [realEstate]);

  const selectedImage = images[selectedImageIndex]
    ? getThumbSrc(images[selectedImageIndex])
    : "";
  const itemUser = getItemUser();

  const showPreviousImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  };

  const showNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );
  };

  if (isLoading) return <div className="min-h-screen bg-white" />;

  if (!realEstate) {
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Listing not found
      </div>
    );
  }

  return (
    <div className="my-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto mb-6 font-mono text-blue-600 text-sm h-5">
        <p>
          {realEstate.region ?? ""}, {realEstate.city}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[700px]">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt={realEstate.title}
                  fill
                  className={`object-cover cursor-pointer ${realEstate.maGadayn ? "opacity-70" : ""}`}
                  priority
                  onClick={() => setShowFullImage(true)}
                />
                <ImageControls
                  onHeartClick={handleHeartClick}
                  onZoomClick={() => setShowFullImage(true)}
                />
              </>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={showPreviousImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                >
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={showNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                >
                  <IoIosArrowForward className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
            {images.map((thumb, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedImageIndex(i)}
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all ${
                  selectedImageIndex === i
                    ? "border-blue-500 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={getThumbSrc(thumb)}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8 pr-4">
          <div className="space-y-4">
            <GoBackBtn />
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {realEstate.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(realEstate.price).toLocaleString()}
            </p>
          </div>

          {realEstate.maGadayn && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm">
              <span className="text-xl uppercase tracking-widest">
                waa la gatay
              </span>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold uppercase mb-4 border-b pb-2">
              Property Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
              {realEstate.bedrooms && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Bedrooms
                  </span>
                  <span className="font-bold">{realEstate.bedrooms}</span>
                </div>
              )}
              {realEstate.bathrooms && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Bathrooms
                  </span>
                  <span className="font-bold">{realEstate.bathrooms}</span>
                </div>
              )}
              {realEstate.squareFeet && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Square Feet
                  </span>
                  <span className="font-bold">
                    {realEstate.squareFeet.toLocaleString()} sq ft
                  </span>
                </div>
              )}
              {realEstate.subCategory && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Property Type
                  </span>
                  <span className="font-bold uppercase">
                    {realEstate.subCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[100px]">
            {itemUser && (
              <UserCard
                user={itemUser}
                isLoggedIn={!!currentUser}
                itemId={realEstate.id}
                itemTitle={realEstate.title}
                itemName="RealEstate"
                maGaday={realEstate.maGadayn || false}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-base">
              <p className="whitespace-pre-line">
                {isExpanded
                  ? realEstate.description
                  : `${realEstate.description?.slice(0, 300)}${realEstate.description?.length > 300 ? "..." : ""}`}
              </p>
              {realEstate.description?.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 font-bold mt-2 hover:underline"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 p-6 border-2 border-gray-200 shadow-sm bg-white hover:border-red-200 transition-all duration-300">
            <Link
              href={`/components/Report/${realEstate.id}`}
              className="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-700 transition-colors"
            >
              Report this item
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <SaveFavoriteModel
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
          backgroundImage={typeof images[0] === "string" ? images[0] : ""}
        />
      )}
    </div>
  );
}

export default RealEstateDetails;
