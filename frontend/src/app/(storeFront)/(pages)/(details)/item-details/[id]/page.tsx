"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useMemo, useCallback } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { ImageControls } from "@/app/ui/invoices/ImageControls";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import { getMarketplaceItemById } from "@/actions/categories/marketplaceActions";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Phone } from "lucide-react";
import Recommendations from "@/app/(storeFront)/components/Recommendations/Recommendations";
import { trackItemView } from "@/actions/categories/RecommendationActions";

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

export default function ProductDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  const [item, setItem] = useState<ItemData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    router.prefetch("/messages");
  }, [router]);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    let mounted = true;
    getMarketplaceItemById(id)
      .then((data) => {
        if (mounted) {
          const resolved = data ? { ...data, id: data._id || data.id } : null;
          setItem(resolved);
          if (resolved) {
            const cat = Array.isArray(resolved.category) ? resolved.category[0] : resolved.category ?? "marketplace";
            trackItemView(resolved.id!, cat, user?.id ?? null);
          }
        }
      })
      .catch(() => { if (mounted) setItem(null); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [id]);

  const images = useMemo(() => {
    const raw = item?.images;
    return Array.isArray(raw)
      ? raw.filter((u) => typeof u === "string" && (u.startsWith("http") || u.startsWith("/") || u.startsWith("data:image")))
      : [];
  }, [item?.images]);

  const itemUser = useMemo(() => {
    if (!item) return null;
    const u = item.user;
    if (u && typeof u === "object") {
      return { id: u.id || u._id || item.userId, username: u.username || null, profileImage: u.profileImage || null, phone: u.phone || null };
    }
    return { id: u || item.userId, username: null, profileImage: null, phone: null };
  }, [item]);

  const isOwnItem = !!itemUser && !!user && String(itemUser.id) === String(user._id || user.id);

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
    if (!user) { router.push("/login"); return; }
    try {
      const desc = Array.isArray(item?.description) ? item.description.join(" ") : item?.description || "";
      const cat = Array.isArray(item?.category) ? item.category[0] : item?.category || "Marketplace";
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start animate-pulse">
            <div className="space-y-6">
              <div className="w-full bg-gray-200 rounded-2xl h-[600px] md:h-[700px]" />
              <div className="flex gap-3 py-2">
                {[0, 1, 2, 3].map((i) => <div key={i} className="min-w-[100px] h-24 bg-gray-200 rounded-xl" />)}
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
    return <div className="text-center py-20 text-red-600 font-bold">Item not found.</div>;
  }

  const currentImage = images[selectedImageIndex];
  const description = item.description || "";
  const shouldTruncate = description.length > 250;
  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();

  return (
    <div className="my-12 px-6 min-h-screen max-w-7xl mx-auto pb-24 md:pb-0">
      <div className="mb-6 font-mono text-sm flex items-center gap-1 flex-wrap text-gray-400">
        <span className="text-blue-600 font-bold capitalize">
          {Array.isArray(item?.category) ? item.category[0] : item?.category ?? "Marketplace"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[600px] md:h-[700px]">
            {currentImage && (
              <Image
                src={currentImage}
                alt={item.title || "Product image"}
                fill
                className={`object-cover transition-opacity duration-300 ${item.maGaday ? "opacity-70" : "opacity-100"}`}
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                placeholder="blur"
                blurDataURL="/placeholder.png"
              />
            )}
            <ImageControls
              onHeartClick={() => user ? setShowModal(true) : router.push("/login")}
              onZoomClick={() => {}}
            />
            {images.length > 1 && (
              <>
                <button onClick={handlePrevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10" aria-label="Previous image">
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button onClick={handleNextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10" aria-label="Next image">
                  <IoIosArrowForward className="w-6 h-6 text-white" />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-2 scrollbar-hide">
              {images.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all flex-shrink-0 ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-transparent opacity-70"}`}
                  aria-label={`Thumbnail ${i + 1}`}
                >
                  <Image src={thumb} alt="" fill className="object-cover" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="space-y-3">
            <GoBackBtn />
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{item.title}</h1>
            <p className="text-3xl font-bold text-blue-700">${Number(item.price).toLocaleString()}</p>
          </div>

          {!isOwnItem && (
            <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                  {itemUser?.profileImage && !avatarError ? (
                    <img src={itemUser.profileImage} alt={itemUser.username || "Seller"} className="w-full h-full object-cover" onError={() => setAvatarError(true)} />
                  ) : (
                    <span className="text-white font-bold text-lg leading-none">{sellerInitial}</span>
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-base leading-tight">{itemUser?.username || "Seller"}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Active seller</p>
                </div>
              </div>

              <button
                onClick={handleSendMessage}
                disabled={item.maGaday || messagingLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${item.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"}`}
              >
                <MessageSquare size={17} />
                {item.maGaday ? "Item sold" : messagingLoading ? "Opening…" : "Send Message"}
              </button>

              {itemUser?.phone && (
                <button
                  onClick={() => setShowPhone((p) => !p)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.99]"
                >
                  <Phone size={15} />
                  {showPhone ? itemUser.phone : "Show phone number"}
                </button>
              )}
            </div>
          )}

          {item.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Description</h2>
            <div className="text-gray-700 leading-relaxed text-base">
              <p className="whitespace-pre-line">
                {isExpanded || !shouldTruncate ? description : `${description.slice(0, 250)}...`}
              </p>
              {shouldTruncate && (
                <button onClick={() => setIsExpanded((p) => !p)} className="text-blue-600 font-bold mt-2 hover:underline">
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 p-6 border-2 border-gray-200 shadow-sm bg-white hover:border-red-200 transition-all duration-300">
            <Link href={`/components/Report/${item.id || item._id}`} className="flex items-center justify-center gap-2 text-red-600 text-xs font-black uppercase tracking-[0.15em] hover:text-red-800">
              Report this item
            </Link>
          </div>
        </div>
      </div>

      {!isOwnItem && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-blue-700 truncate">${Number(item.price).toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{item.title}</p>
          </div>
          {itemUser?.phone && (
            <button onClick={() => setShowPhone((p) => !p)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.97] flex-shrink-0">
              <Phone size={15} />
              <span className="text-xs">{showPhone ? itemUser.phone : "Phone"}</span>
            </button>
          )}
          <button
            onClick={handleSendMessage}
            disabled={item.maGaday || messagingLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${item.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"}`}
          >
            <MessageSquare size={16} />
            {item.maGaday ? "Sold" : messagingLoading ? "Opening…" : "Message Seller"}
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

      <Recommendations
        userId={user?.id}
        excludeId={item?.id}
        category={Array.isArray(item?.category) ? item.category[0] : item?.category ?? undefined}
        limit={4}
      />
    </div>
  );
}
