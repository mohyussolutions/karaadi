"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import { getMarketplaceItemById } from "@/actions/categories/marketplaceActions";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import { API_ENDPOINTS } from "@/actions/constant/sockets";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { verifySession } from "@/actions/core/authAction";

type MarketplaceUser =
  | {
      id: string;
      username?: string | null;
      profileImage?: string | null;
      phone?: string | null;
    }
  | string
  | null;

export type MarketplaceItem = {
  id: string;
  title: string;
  description: string[] | string;
  price: string | number;
  images: string[];
  region: string;
  city: string;
  purpose?: string;
  category?: string;
  subCategory?: string;
  user: MarketplaceUser;
  userId?: string;
  maGaday?: boolean;
};

const isValidImageUrl = (url: string | null | undefined): url is string => {
  return (
    typeof url === "string" &&
    url.length > 0 &&
    (url.startsWith("http") ||
      url.startsWith("/") ||
      url.startsWith("data:image"))
  );
};

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);
  const [item, setItem] = useState<MarketplaceItem | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const fetchedItem = await getMarketplaceItemById(id);
        if (mounted && fetchedItem) {
          setItem({
            ...fetchedItem,
            id: (fetchedItem as any)._id || fetchedItem._id,
          });
        }
      } catch (error) {
        console.error("Fetch failed", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await verifySession();
        if (mounted) setCurrentUser(user);
      } catch (error) {
        console.error("Session check failed", error);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const getItemUser = () => {
    if (!item) return null;
    const rawUser = item.user;
    const userId =
      item.userId ||
      (typeof rawUser === "object" && rawUser !== null
        ? rawUser.id
        : typeof rawUser === "string"
          ? rawUser
          : null);
    if (!userId) return null;
    const userObject =
      typeof rawUser === "object" && rawUser !== null ? rawUser : null;
    if (!userObject) return null;
    return {
      id: userId,
      username: userObject.username ?? null,
      profileImage: userObject.profileImage ?? null,
      phone: userObject.phone ?? null,
    };
  };

  const handleSendMessage = async () => {
    if (!currentUser) return router.push("/login");
    const itemUser = getItemUser();
    if (!itemUser?.id || !item?.id || item?.maGaday === true) return;

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: itemUser.id,
          itemId: item.id,
          itemModel: "Marketplace",
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.chat?.id) router.push(`/messages/${result.chat.id}`);
      } else {
        router.push(`/messages?itemId=${item.id}&sellerId=${itemUser.id}`);
      }
    } catch {
      router.push(`/messages?itemId=${item.id}&sellerId=${itemUser.id}`);
    }
  };

  const images = Array.isArray(item?.images)
    ? item.images.filter(isValidImageUrl)
    : [];
  const selectedImage = images[selectedImageIndex] || "";
  const itemUser = getItemUser();

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
    if (item?.maGaday === true) return toast.warning("Item sold");
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    try {
      const userData: any = await verifySession();
      if (!userData) {
        router.push("/login");
        return;
      }
      const descriptionText = Array.isArray(item?.description)
        ? item?.description.join(" ")
        : item?.description || "";
      const categoryString = Array.isArray(item?.category)
        ? item?.category[0]
        : item?.category || "Marketplace";

      const response: any = await addToFavorite({
        title: item?.title || "",
        description: descriptionText,
        price: String(item?.price),
        image: item?.images?.[0] || "",
        itemId: item?.id || "",
        category: categoryString,
      });

      if (response?.message === "You have already saved this item") {
        toast.info("Alaabtan mar horre ayaad kaydisay!");
      } else {
        toast.success(`"${item?.title}" waa la kaydiyay!`);
        setTimeout(() => router.push("/mine/favorites"), 1200);
      }
      setShowModal(false);
    } catch {
      toast.error("Wuu ku fashilmay kaydinta");
    }
  };

  const showPreviousImage = () =>
    setSelectedImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1,
    );
  const showNextImage = () =>
    setSelectedImageIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1,
    );

  return (
    <div className="my-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto mb-6 font-mono text-blue-600 text-sm h-5">
        <p>{item ? `${item.region ?? ""}, ${item.city}` : ""}</p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start transition-opacity duration-300">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[700px]">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt={item?.title || ""}
                  fill
                  className={`object-cover cursor-pointer ${item?.maGaday ? "opacity-70" : ""}`}
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
                onClick={() => setSelectedImageIndex(i)}
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image src={thumb} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8 pr-4">
          <div className="space-y-4">
            <GoBackBtn />
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {item?.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              {item ? `$${Number(item.price).toLocaleString()}` : ""}
            </p>
          </div>

          {item?.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm">
              <span className="text-xl uppercase tracking-widest">
                waa la gatay
              </span>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[100px]">
            {itemUser && (
              <UserCard
                user={itemUser}
                isLoggedIn={!!currentUser}
                itemId={item?.id || ""}
                itemTitle={item?.title || ""}
                itemName="Marketplace"
                maGaday={item?.maGaday || false}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-base">
              {item && typeof item.description === "string" ? (
                <div>
                  <p className="whitespace-pre-line">
                    {isExpanded
                      ? item.description
                      : `${item.description.slice(0, 250)}${item.description.length > 250 ? "..." : ""}`}
                  </p>
                  {item.description.length > 250 && (
                    <button
                      onClick={() => setIsExpanded(!isExpanded)}
                      className="text-blue-600 font-bold mt-2 hover:underline focus:outline-none"
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </button>
                  )}
                </div>
              ) : null}
            </div>
          </div>

          <div className="pt-8 mt-8 border-t border-gray-100">
            <Link
              href={`/components/Report/${item?.id}`}
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
          backgroundImage={images[0]}
        />
      )}
    </div>
  );
}
