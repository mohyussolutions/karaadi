"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
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

export default function ProductDetails() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<{ item: any; user: any }>({
    item: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let mounted = true;
    const loadPageData = async () => {
      try {
        const [fetchedItem, sessionUser] = await Promise.all([
          getMarketplaceItemById(id),
          verifySession(),
        ]);

        if (mounted) {
          setData({
            item: fetchedItem
              ? { ...fetchedItem, id: fetchedItem._id || fetchedItem._id }
              : null,
            user: sessionUser,
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Load failed", error);
        if (mounted) setLoading(false);
      }
    };

    loadPageData();
    return () => {
      mounted = false;
    };
  }, [id]);

  const images = useMemo(() => {
    const rawImages = data.item?.images;
    return Array.isArray(rawImages)
      ? rawImages.filter(
          (url) =>
            typeof url === "string" &&
            (url.startsWith("http") ||
              url.startsWith("/") ||
              url.startsWith("data:image")),
        )
      : [];
  }, [data.item?.images]);

  const itemUser = useMemo(() => {
    if (!data.item) return null;
    const rawUser = data.item.user;
    if (typeof rawUser === "object" && rawUser !== null) {
      return {
        id: rawUser.id || rawUser._id || data.item.userId,
        username: rawUser.username || null,
        profileImage: rawUser.profileImage || null,
        phone: rawUser.phone || null,
      };
    }
    return { id: rawUser || data.item.userId };
  }, [data.item]);

  const handleSendMessage = async () => {
    if (!data.user) return router.push("/login");
    const receiverId = itemUser?.id || data.item?.userId;
    if (!receiverId || !data.item?.id || data.item?.maGaday) return;

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: data.user._id,
          receiverId,
          itemId: data.item.id,
          itemModel: "Marketplace",
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const chatId = result.chat?.id || result.id;
        if (chatId) return router.push(`/messages/${chatId}`);
      }
      router.push(`/messages?itemId=${data.item.id}&sellerId=${receiverId}`);
    } catch {
      router.push(`/messages?itemId=${data.item?.id}&sellerId=${receiverId}`);
    }
  };

  const handleModalConfirm = async () => {
    try {
      if (!data.user) return router.push("/login");

      const descriptionText = Array.isArray(data.item?.description)
        ? data.item.description.join(" ")
        : data.item?.description || "";

      const categoryString = Array.isArray(data.item?.category)
        ? data.item.category[0]
        : data.item?.category || "Marketplace";

      const response: any = await addToFavorite({
        title: data.item?.title || "",
        description: descriptionText,
        price: String(data.item?.price),
        image: images[0] || "",
        itemId: data.item?.id || "",
        category: categoryString,
      });

      if (response?.message === "You have already saved this item") {
        toast.info("Alaabtan mar horre ayaad kaydisay!");
      } else {
        toast.success(`"${data.item?.title}" waa la kaydiyay!`);
        setTimeout(() => router.push("/mine/favorites"), 1200);
      }
      setShowModal(false);
    } catch {
      toast.error("Wuu ku fashilmay kaydinta");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!data.item)
    return <div className="text-center py-20">Alaabta lama helin.</div>;

  return (
    <div className="my-12 px-6 min-h-screen max-w-7xl mx-auto">
      <div className="mb-6 font-mono text-blue-600 text-sm h-5">
        <p>
          {data.item.region}, {data.item.city}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[600px] md:h-[700px]">
            {images[selectedImageIndex] && (
              <Image
                src={images[selectedImageIndex]}
                alt={data.item.title}
                fill
                className={`object-cover transition-opacity duration-300 ${data.item.maGaday ? "opacity-70" : "opacity-100"}`}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            )}

            <ImageControls
              onHeartClick={() =>
                data.user ? setShowModal(true) : router.push("/login")
              }
              onZoomClick={() => {}}
            />

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((p) =>
                      p === 0 ? images.length - 1 : p - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                >
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((p) =>
                      p === images.length - 1 ? 0 : p + 1,
                    )
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
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
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all flex-shrink-0 ${
                  selectedImageIndex === i
                    ? "border-blue-500 scale-105"
                    : "border-transparent opacity-70"
                }`}
              >
                <Image src={thumb} alt="" fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <GoBackBtn />
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {data.item.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(data.item.price).toLocaleString()}
            </p>
          </div>

          {data.item.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[100px]">
            {itemUser && (
              <UserCard
                user={itemUser}
                isLoggedIn={!!data.user}
                itemId={data.item.id}
                itemTitle={data.item.title}
                itemName="Marketplace"
                maGaday={data.item.maGaday}
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
                  ? data.item.description
                  : `${data.item.description?.slice(0, 250)}${data.item.description?.length > 250 ? "..." : ""}`}
              </p>
              {data.item.description?.length > 250 && (
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
              href={`/components/Report/${data.item.id}`}
              className="flex items-center justify-center gap-2 text-red-600 text-xs font-black uppercase tracking-[0.15em] hover:text-red-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path
                  fillRule="evenodd"
                  d="M3 2.25a.75.75 0 0 1 .75.75v.54l1.838-.46a2.25 2.25 0 0 1 2.725 1.89l.062.526a4.5 4.5 0 0 0 5.45 3.78l.114-.029a2.25 2.25 0 0 1 2.726 1.89l.199 1.684a1.5 1.5 0 0 1-1.49 1.673l-1.13.03a4.5 4.5 0 0 1-4.85-3.592l-.314-1.664a2.25 2.25 0 0 0-2.425-1.796l-3.336.326A.75.75 0 0 1 3 11.25V3a.75.75 0 0 1 .75-.75Zm.75 15.5a.75.75 0 0 1 .75-.75H5.25a.75.75 0 0 1 0 1.5H4.5a.75.75 0 0 1-.75-.75Z"
                  clipRule="evenodd"
                />
              </svg>
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
