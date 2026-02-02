"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import { useGetMarketplaceItemsQuery } from "@/app/(storeFront)/store/slices/marketplaceSlice";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { verifySession } from "@/actions/core/authAction";
import { API_ENDPOINTS } from "@/actions/constant/sockets";

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

  const { data: marketplaceItems = [], isLoading } =
    useGetMarketplaceItemsQuery();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const item: MarketplaceItem | undefined = marketplaceItems.find(
    (i) => i.id === id,
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const user = await verifySession();
        if (mounted) setCurrentUser(user);
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        if (mounted) setLoadingUser(false);
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
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const itemUser = getItemUser();
    if (!itemUser?.id || !item?.id) {
      alert("Cannot send message: Seller information is not available.");
      return;
    }

    if (item?.maGaday === true) {
      alert("Cannot send message: This item has been sold.");
      return;
    }

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
        if (result.chat?.id) {
          router.push(`/messages/${result.chat.id}`);
        }
      } else {
        router.push(`/messages?itemId=${item.id}&sellerId=${itemUser.id}`);
      }
    } catch {
      router.push(`/messages?itemId=${item.id}&sellerId=${itemUser.id}`);
    }
  };

  if (isLoading || loadingUser)
    return (
      <div className="p-8 text-center">
        <Loading />
      </div>
    );
  if (!item)
    return (
      <div className="p-8 text-center text-red-600 text-lg">
        Product not found
      </div>
    );

  const images = Array.isArray(item.images)
    ? item.images.filter(isValidImageUrl)
    : [];
  const selectedImage = images[selectedImageIndex] || "";

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
    if (item?.maGaday === true) {
      toast.warning("This item has been sold and cannot be saved as favorite.");
      return;
    }
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    try {
      const userData = await verifySession();
      if (!userData) {
        router.push("/login");
        return;
      }

      const descriptionText = Array.isArray(item?.description)
        ? item?.description.join(" ")
        : item?.description;

      const categoryString = Array.isArray(item?.category)
        ? item?.category[0]
        : item?.category || "Marketplace";

      await addToFavorite({
        title: item?.title,
        description: descriptionText || "No description provided",
        price: String(item?.price),
        image: item?.images?.[0] || "",
        itemId: item?.id,
        category: categoryString,
      });

      toast.success(`"${item?.title}" saved!`);
      setShowModal(false);
      setTimeout(() => router.push("/mine/favorites"), 1000);
    } catch (error: any) {
      toast.error("Failed to save favorite");
    }
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

  const renderMainImage = () => (
    <div className="relative w-full h-full">
      <Image
        src={selectedImage}
        alt={item.title}
        fill
        className={`object-cover cursor-pointer ${
          item.maGaday ? "opacity-70" : ""
        }`}
        priority
        quality={100}
        onClick={() => setShowFullImage(true)}
        sizes="(max-width: 768px) 100vw, 800px"
      />
    </div>
  );

  const itemUser = getItemUser();

  return (
    <div className="my-8">
      <div className="ml-2 font-mono text-blue-600 text-sm">
        <p>
          {item.region ?? ""}, {item.city}
        </p>
      </div>

      <div className="max-w-6xl mx-auto p-1 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative">
          <div
            className="w-full aspect-[2/2] relative bg-gray-50 rounded-lg overflow-hidden"
            style={{ height: "800px" }}
          >
            {selectedImage ? (
              <>
                {renderMainImage()}
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
            <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-hide py-2">
              {images.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`min-w-[80px] h-16 border rounded-md overflow-hidden focus:outline-none transition ${
                    selectedImageIndex === i
                      ? "ring-2 ring-blue-500"
                      : "border-gray-200"
                  } relative`}
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      fill
                      className={`object-cover ${
                        item.maGaday ? "opacity-60" : ""
                      }`}
                      loading="lazy"
                      sizes="80px"
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2">
          <GoBackBtn />
          <h1 className="text-2xl font-bold">{item.title}</h1>
          {item.maGaday === true && (
            <div className="sticky top-0 left-0 right-0 bg-yellow-500 text-gray-900 font-bold text-center py-3 z-30">
              <div className="flex items-center justify-center gap-2">
                <span className="text-lg">waa la gatay</span>
              </div>
            </div>
          )}
          {item.purpose && (
            <span className="text-green-700 font-semibold">{item.purpose}</span>
          )}
          {item.subCategory && <p className="capitalize">{item.subCategory}</p>}

          {itemUser ? (
            <div className="flex gap-4">
              <button
                onClick={handleSendMessage}
                disabled={item.maGaday === true}
                className={`font-semibold py-2 px-4 rounded ${
                  item.maGaday === true
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } text-white`}
              >
                {item.maGaday === true ? "Item Sold" : "Send Message"}
              </button>
            </div>
          ) : (
            <div className="text-red-500 bg-red-50 p-4 rounded border border-red-200">
              <p className="font-semibold">Seller Information Not Available</p>
              <p className="text-sm mt-1">
                This item doesn't have seller information. Cannot send message.
              </p>
            </div>
          )}

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
              {Array.isArray(item.description) ? (
                item.description.map((line, index) => (
                  <p key={index} className="mb-1">
                    • {line}
                  </p>
                ))
              ) : typeof item.description === "string" ? (
                item.description.split("\n").map((paragraph, index) => (
                  <p key={index} className={index === 0 ? "" : "mt-2"}>
                    {paragraph}
                  </p>
                ))
              ) : (
                <p>No description available.</p>
              )}
            </div>
          </div>

          {itemUser && (
            <UserCard
              user={itemUser}
              isLoggedIn={!!currentUser}
              itemId={item.id}
              itemTitle={item.title}
              itemName="Marketplace"
              maGaday={item.maGaday || false}
            />
          )}
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
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1,
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white/50 z-20"
            >
              <IoIosArrowBack className="w-8 h-8 text-white" />
            </button>

            <div className="relative w-full h-full">
              <Image
                src={images[selectedImageIndex]}
                alt={`Full view - ${item.title}`}
                fill
                className="object-contain"
                quality={100}
                sizes="90vw"
              />
            </div>
            <button
              onClick={() =>
                setSelectedImageIndex((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/30 rounded-full hover:bg-white/50 z-20"
            >
              <IoIosArrowForward className="w-8 h-8 text-white" />
            </button>
          </div>

          <button
            onClick={() => setShowFullImage(false)}
            className="absolute top-4 right-4 p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
          ></button>
        </div>
      )}
    </div>
  );
}
