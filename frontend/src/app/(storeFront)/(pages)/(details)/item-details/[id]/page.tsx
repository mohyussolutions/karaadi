"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import useSWR from "swr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import { AiOutlineHeart, AiOutlineZoomIn } from "react-icons/ai";
import Image from "next/image";
import Link from "next/link";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import { BASE_API_URL as API } from "@/actions/constant/BASE_API_URL";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Phone, ChevronRight, Home } from "lucide-react";
import Recommendations from "@/app/(storeFront)/components/Recommendations/Recommendations";
import { trackItemView } from "@/actions/categories/RecommendationActions";
import ZoomedImageModal from "../../zoomed/ZoomedImageModal";
import { SEGMENT_LABEL_KEYS } from "../../historyPath/pathSegmentsDisplay";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

interface ItemData {
  _id?: string;
  id?: string;
  title?: string;
  description?: string;
  price?: number;
  images?: string[];
  category?: string | string[];
  region?: string;
  city?: string;
  userId?: string;
  user?: any;
  maGaday?: boolean;
}

const CATEGORY_SEGMENT: Record<string, string> = {
  antiques: "antiques",
  electronics: "electronics",
  animalAndSupplies: "animal-and-supplies",
  sportsAndOutdoors: "sports-and-outdoors",
  furniture: "furniture",
  fashion: "fashion",
};

const CATEGORY_HREF: Record<string, string> = {
  antiques: "/marketplace/antiques-and-art",
  electronics: "/marketplace/electronics",
  animalAndSupplies: "/marketplace/animal-and-supplies",
  sportsAndOutdoors: "/marketplace/sports-and-outdoors",
  furniture: "/marketplace/furniture-and-interior",
  fashion: "/marketplace/fashion-and-accessories",
};

export default function ProductDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { language } = useLanguage();
  const id = params?.id as string;

  const { data: rawItem, isLoading: loading } = useSWR<ItemData>(
    id ? `${API}/api/items/${id}` : null,
    (url: string) => fetch(url).then((r) => { if (!r.ok) throw new Error(); return r.json(); }),
    { revalidateOnFocus: false, dedupingInterval: 30_000 },
  );
  const item = useMemo(
    () => (rawItem ? { ...rawItem, id: (rawItem as any)._id || rawItem.id } : null),
    [rawItem],
  );

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    router.prefetch("/messages");
  }, [router]);

  useEffect(() => {
    if (!item?.id) return;
    const cat = Array.isArray(item.category)
      ? item.category[0]
      : (item.category ?? "marketplace");
    trackItemView(item.id, cat, user?.id ?? null);
  }, [item?.id]);

  const images = useMemo(() => {
    const raw = item?.images;
    if (!Array.isArray(raw)) return [];
    return raw
      .filter((u) => typeof u === "string" && u.trim() !== "")
      .map((u) => {
        if (
          u.startsWith("http://") ||
          u.startsWith("https://") ||
          u.startsWith("data:") ||
          u.startsWith("/")
        )
          return u;
        return `${API}/${u}`;
      });
  }, [item?.images]);

  const itemUser = useMemo(() => {
    if (!item) return null;
    const u = item.user;
    if (u && typeof u === "object") {
      return {
        id: u.id || u._id || item.userId,
        username: u.username || null,
        profileImage: u.profileImage || null,
        phone: u.phone || null,
      };
    }
    return {
      id: u || item.userId,
      username: null,
      profileImage: null,
      phone: null,
    };
  }, [item]);

  const isOwnItem =
    !!itemUser && !!user && String(itemUser.id) === String(user._id || user.id);

  const handleSendMessage = useCallback(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const receiverId = itemUser?.id || item?.userId;
    const itemId = item?.id || item?._id;
    if (!receiverId || !itemId || item?.maGaday) return;
    setMessagingLoading(true);
    router.push(`/messages?sellerId=${receiverId}&itemId=${itemId}`);
  }, [user, itemUser, item, router, pathname]);

  const handleModalConfirm = useCallback(async () => {
    if (!user) {
      router.push("/login");
      return;
    }
    try {
      const desc = Array.isArray(item?.description)
        ? item.description.join(" ")
        : item?.description || "";
      const cat = Array.isArray(item?.category)
        ? item.category[0]
        : item?.category || "Marketplace";
      const response: any = await addToFavorite({
        title: item?.title || "",
        description: desc,
        price: String(item?.price || ""),
        image: images[0] || "",
        itemId: item?.id || item?._id || "",
        category: cat,
      });
      setShowModal(false);
      if (!response?.error) router.push("/mine/favorites");
    } catch {
      setShowModal(false);
    }
  }, [user, item, images, router]);

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  }, [images.length]);

  const handleZoomOpen = useCallback(() => setIsZoomed(true), []);
  const handleZoomClose = useCallback(() => setIsZoomed(false), []);

  const handleHeartClick = useCallback(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowModal(true);
  }, [user, router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-pulse">
            <div className="space-y-4">
              <div className="w-full bg-gray-200 rounded-2xl h-[400px] md:h-[560px]" />
              <div className="flex gap-3 py-2">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="min-w-[100px] h-24 bg-gray-200 rounded-xl"
                  />
                ))}
              </div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="w-24 h-8 bg-gray-200 rounded" />
                <div className="w-2/3 h-10 bg-gray-200 rounded" />
                <div className="w-1/3 h-8 bg-gray-200 rounded" />
              </div>
              <div className="bg-gray-100 rounded-2xl h-36" />
              <div className="space-y-4">
                <div className="w-32 h-6 bg-gray-200 rounded" />
                <div className="h-20 bg-gray-100 rounded" />
              </div>
              <div className="h-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="text-center py-20 text-red-600 font-bold">
        Item not found.
      </div>
    );
  }

  const currentImage = images[selectedImageIndex];
  const description = item.description || "";
  const shouldTruncate = description.length > 300;
  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();

  return (
    <div className="my-12 px-4 md:px-6 min-h-screen max-w-7xl mx-auto pb-24 md:pb-0">
      <nav aria-label="Breadcrumb" className="mb-6 overflow-x-auto scrollbar-hide">
        <ol className="flex flex-nowrap items-center gap-1 text-sm whitespace-nowrap">
          {(() => {
            const rawCat = Array.isArray(item?.category) ? item.category[0] : (item?.category ?? "");
            const seg = CATEGORY_SEGMENT[rawCat] ?? rawCat.toLowerCase();
            const entry = SEGMENT_LABEL_KEYS[seg];
            const catLabel = entry ? (language === "so" ? entry.so : entry.en) : rawCat;
            const catHref = CATEGORY_HREF[rawCat] ?? "/marketplace";
            return (
              <>
                <li>
                  <button
                    type="button"
                    onClick={() => router.push("/")}
                    className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium px-1 py-1 rounded hover:bg-blue-50 transition-colors touch-manipulation select-none min-h-[44px] sm:min-h-0"
                  >
                    <Home className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>{language === "so" ? "Hoyga" : "Home"}</span>
                  </button>
                </li>
                <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                <li>
                  <button
                    type="button"
                    onClick={() => router.push(catHref)}
                    className="text-blue-600 hover:text-blue-800 font-medium px-1 py-1 rounded hover:bg-blue-50 transition-colors touch-manipulation select-none min-h-[44px] sm:min-h-0"
                  >
                    {catLabel}
                  </button>
                </li>
                {item?.title && (
                  <>
                    <li aria-hidden="true"><ChevronRight className="w-3.5 h-3.5 text-gray-400" /></li>
                    <li>
                      <span className="text-gray-500 font-medium px-1 truncate max-w-[160px] sm:max-w-xs inline-block align-middle">
                        {item.title}
                      </span>
                    </li>
                  </>
                )}
              </>
            );
          })()}
        </ol>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start min-w-0">
        <div className="space-y-4 min-w-0">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[400px] md:h-[560px]">
            {currentImage ? (
              <button
                type="button"
                onClick={handleZoomOpen}
                className="w-full h-full absolute inset-0 cursor-zoom-in group"
                style={{ background: "none", border: 0, padding: 0 }}
                aria-label="Open fullscreen image viewer"
              >
                <Image
                  src={currentImage}
                  alt={item.title || "Product image"}
                  fill
                  className={`object-cover transition-opacity duration-300 group-hover:opacity-90 ${item.maGaday ? "opacity-70" : "opacity-100"}`}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <span className="absolute right-3 top-3 z-50 flex gap-2">
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleHeartClick();
                    }}
                    aria-label="Save to favorites"
                    className="bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    <AiOutlineHeart className="w-5 h-5 text-red-500" />
                  </span>
                  <span className="bg-white/90 p-2.5 rounded-full shadow-md text-gray-700">
                    <AiOutlineZoomIn className="w-5 h-5" />
                  </span>
                </span>
              </button>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-200 text-6xl">
                📦
              </div>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                  aria-label="Previous image"
                >
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                  aria-label="Next image"
                >
                  <IoIosArrowForward className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
              {images.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`min-w-[90px] h-20 border-2 rounded-xl overflow-hidden relative transition-all flex-shrink-0 ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-gray-100 opacity-70"}`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <Image
                    src={thumb}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="90px"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-7 min-w-0 overflow-hidden">
          <div className="space-y-2">
            <GoBackBtn />
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {item.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(item.price).toLocaleString()}
            </p>
            {(item.city || item.region) && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                📍{item.city ? ` ${item.city}` : ""}
                {item.region ? ` — ${item.region}` : ""}
              </p>
            )}
          </div>

          {!isOwnItem && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {itemUser?.profileImage && !avatarError ? (
                    <img
                      src={itemUser.profileImage}
                      alt={itemUser.username || "Seller"}
                      className="w-full h-full object-cover"
                      onError={() => setAvatarError(true)}
                    />
                  ) : (
                    <span className="text-white font-bold text-lg leading-none">
                      {sellerInitial}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-tight">
                    {itemUser?.username || "Seller"}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Active seller</p>
                </div>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={item.maGaday || messagingLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${item.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"}`}
              >
                <MessageSquare size={17} />
                {item.maGaday
                  ? "Item sold"
                  : messagingLoading
                    ? "Opening…"
                    : "Send Message"}
              </button>

              {itemUser?.phone && (
                showPhone ? (
                  <a
                    href={`tel:${itemUser.phone}`}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-green-200 text-green-700 bg-green-50 hover:bg-green-100 transition-all active:scale-[0.99]"
                  >
                    <Phone size={15} />
                    {itemUser.phone}
                  </a>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.99]"
                  >
                    <Phone size={15} />
                    Show phone number
                  </button>
                )
              )}
            </div>
          )}

          {item.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-black text-gray-700 uppercase tracking-wider border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm min-w-0">
              <p
                className="whitespace-pre-line break-words"
                style={{ overflowWrap: "anywhere" }}
              >
                {isExpanded || !shouldTruncate
                  ? description
                  : `${description.slice(0, 300)}...`}
              </p>
              {shouldTruncate && (
                <button
                  onClick={() => setIsExpanded((p) => !p)}
                  className="text-blue-600 font-bold mt-2 hover:underline text-sm"
                >
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 p-5 border border-gray-200 rounded-xl bg-white">
            <Link
              href={`/components/Report/${item.id || item._id}`}
              className="text-red-500 text-xs font-bold uppercase tracking-widest"
            >
              Report this item
            </Link>
          </div>
        </div>
      </div>

      {!isOwnItem && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-blue-700 truncate">
              ${Number(item.price).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 truncate">{item.title}</p>
          </div>
          {itemUser?.phone && (
            showPhone ? (
              <a
                href={`tel:${itemUser.phone}`}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-green-200 text-green-700 bg-green-50 font-bold text-sm hover:bg-green-100 transition-all active:scale-[0.97] flex-shrink-0"
              >
                <Phone size={15} />
                <span className="text-xs">{itemUser.phone}</span>
              </a>
            ) : (
              <button
                onClick={() => setShowPhone(true)}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.97] flex-shrink-0"
              >
                <Phone size={15} />
                <span className="text-xs">Phone</span>
              </button>
            )
          )}
          <button
            onClick={handleSendMessage}
            disabled={item.maGaday || messagingLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${item.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"}`}
          >
            <MessageSquare size={16} />
            {item.maGaday
              ? "Sold"
              : messagingLoading
                ? "Opening…"
                : "Message Seller"}
          </button>
        </div>
      )}

      {showModal && (
        <SaveFavoriteModel
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
          backgroundImage={images[0]}
        />
      )}

      {isZoomed && images[selectedImageIndex] && (
        <ZoomedImageModal
          images={images}
          selectedIndex={selectedImageIndex}
          onClose={handleZoomClose}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          setSelectedIndex={setSelectedImageIndex}
          title={item.title || ""}
        />
      )}

      <Recommendations
        userId={user?.id}
        excludeId={item?.id}
        category={
          Array.isArray(item?.category)
            ? item.category[0]
            : (item?.category ?? undefined)
        }
        limit={4}
      />
    </div>
  );
}
