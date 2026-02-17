"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  title: string;
  description: string;
  price: number | string;
  images: (string | File)[];
  region?: string;
  city?: string;
  user?:
    | {
        id: string;
        username: string;
        profileImage?: string;
        phone?: string;
      }
    | string;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  subCategory?: string;
}

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
            setRealEstate({ ...data, id: data._id || data.id });
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

  const getThumbSrc = (thumb: string | File): string => {
    if (typeof thumb === "string") return thumb;
    try {
      return URL.createObjectURL(thumb);
    } catch {
      return "/placeholder.png";
    }
  };

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
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
          typeof realEstate.images[0] === "string" ? realEstate.images[0] : "",
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

  const handleSendMessage = async () => {
    if (!currentUser || !realEstate) return router.push("/login");
    const sellerId =
      typeof realEstate.user === "object"
        ? realEstate.user?.id
        : realEstate.user;
    if (!sellerId) return;

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: sellerId,
          itemId: realEstate.id,
          itemModel: "RealEstate",
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.chat?.id) router.push(`/messages/${result.chat.id}`);
      } else {
        router.push(`/messages?itemId=${realEstate.id}&sellerId=${sellerId}`);
      }
    } catch {
      router.push(`/messages?itemId=${realEstate.id}&sellerId=${sellerId}`);
    }
  };

  if (isLoading) return <div className="min-h-screen bg-white" />;
  if (!realEstate)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Listing not found
      </div>
    );

  const images = realEstate.images || [];
  const selectedImage = images[selectedImageIndex]
    ? getThumbSrc(images[selectedImageIndex])
    : "";

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
                  className="object-cover cursor-pointer"
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
                  onClick={() =>
                    setSelectedImageIndex((p) =>
                      p === 0 ? images.length - 1 : p - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                >
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((p) =>
                      p === images.length - 1 ? 0 : p + 1,
                    )
                  }
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
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
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

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[100px]">
            <UserCard
              user={{
                id:
                  typeof realEstate.user === "object"
                    ? realEstate.user?.id
                    : realEstate.user || "unknown",
                username:
                  typeof realEstate.user === "object"
                    ? realEstate.user?.username
                    : "Unknown Seller",
                profileImage:
                  typeof realEstate.user === "object"
                    ? realEstate.user?.profileImage
                    : "/user.jpg",
                phone:
                  typeof realEstate.user === "object"
                    ? realEstate.user?.phone
                    : null,
              }}
              isLoggedIn={!!currentUser}
              itemId={realEstate.id}
              itemTitle={realEstate.title}
              itemName="RealEstate"
              onSendMessage={handleSendMessage}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-base">
              <p className="whitespace-pre-line">
                {isExpanded
                  ? realEstate.description
                  : `${realEstate.description?.slice(0, 300)}...`}
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

          <div className="pt-8 mt-8 border-t border-gray-100">
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
        />
      )}
    </div>
  );
}

export default RealEstateDetails;
