"use client";

import Link from "next/link";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import useSWR from "swr";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import {
  AiOutlineCamera,
  AiOutlineHeart,
  AiOutlineZoomIn,
} from "react-icons/ai";
import Image from "next/image";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import Loading from "@/app/ui/loading/Loading";
import { useAuth } from "@/context/AuthContext";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { MessageSquare, Phone } from "lucide-react";
import dynamic from "next/dynamic";
const Recommendations = dynamic(() => import("@/app/(storeFront)/components/Recommendations/Recommendations"), { ssr: false });
import { trackItemView } from "@/actions/categories/RecommendationActions";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { VEHICLE_CONFIG } from "./VEHICLE_CONFIG";
import { useItemSavedCount } from "@/app/(storeFront)/components/hooks/usertotalsavedAfocrite";

import type { VehicleType, VehicleItem } from "@/app/utils/types/vehicle";

const ALL_TYPES: VehicleType[] = ["car", "motorcycle", "boat", "farmequipment"];

const API_BASE = BASE_API_URL;

import { resolveImageUrl } from "@/app/ui/invoices/slugify";
import ZoomedImageModal from "../zoomed/ZoomedImageModal";

const normalise = (data: any, resolvedType: VehicleType): VehicleItem => ({
  ...data,
  id:
    typeof data._id === "string"
      ? data._id
      : typeof data.id === "string"
        ? data.id
        : "",
  title: data.title ?? "",
  description: data.description ?? "",
  price: data.price ?? "",
  images: data.images ?? [],
  vehicleKind: resolvedType,
});

export function VehicleDetailsContent({
  forceType,
}: { forceType?: VehicleType } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const searchParams = useSearchParams();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const typeHint = forceType || (searchParams.get("type") as VehicleType) || null;

  const { data: swrResult, isLoading } = useSWR(
    id ? `vehicle-${typeHint ?? "any"}-${id}` : null,
    async () => {
      if (typeHint) {
        const order: VehicleType[] = [typeHint, ...ALL_TYPES.filter((t) => t !== typeHint)];
        for (const t of order) {
          try {
            const data = await VEHICLE_CONFIG[t].fetchFn(id);
            if (data) return { data: normalise(data, t), type: t };
          } catch { continue; }
        }
        return null;
      }
      try {
        const { data, t } = await Promise.any(
          ALL_TYPES.map(async (t) => {
            const data = await VEHICLE_CONFIG[t].fetchFn(id);
            if (!data) throw new Error("not found");
            return { data, t };
          }),
        );
        return { data: normalise(data, t), type: t };
      } catch { return null; }
    },
    { revalidateOnFocus: false, revalidateIfStale: false, dedupingInterval: 60_000 },
  );

  const vehicle = swrResult?.data ?? null;
  const vehicleType: VehicleType = swrResult?.type ?? (typeHint || "car") as VehicleType;

  useEffect(() => {
    router.prefetch("/messages");
  }, [router]);

  useEffect(() => {
    if (vehicle && id) {
      const cat = vehicle.mainCategory ?? vehicle.category?.[0] ?? vehicleType;
      trackItemView(id, cat, user?.id ?? user?._id ?? null);
    }
  }, [vehicle, id, vehicleType, user]);

  const config = VEHICLE_CONFIG[vehicleType];
  const { count: savedCount, ready: savedReady } = useItemSavedCount(vehicle?.id);
  const images = useMemo(
    () =>
      (vehicle?.images ?? [])
        .map((u) => resolveImageUrl(u))
        .filter((u): u is string => u !== null),
    [vehicle?.images],
  );

  const itemUser = useMemo(() => {
    if (!vehicle) return null;
    const u = vehicle.user;
    if (u && typeof u === "object") {
      return {
        id: String(u._id || u.id || ""),
        username: u.username || u.name || "Seller",
        profileImage: u.profileImage || null,
        phone: u.phone || null,
      };
    }
    return {
      id: String(vehicle.userId || ""),
      username: "Seller",
      profileImage: null,
      phone: null,
    };
  }, [vehicle]);

  const sellerId = itemUser?.id || "";
  const buyerId = String(user?._id || user?.id || "");
  const isOwnItem = !!sellerId && !!buyerId && sellerId === buyerId;

  const handleSendMessage = useCallback(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const receiverId = itemUser?.id || vehicle?.userId;
    const itemId = vehicle?.id;
    if (!receiverId || !itemId || vehicle?.maGaday) return;
    setMessagingLoading(true);
    router.push(
      `/messages?sellerId=${receiverId}&itemId=${itemId}&itemModel=${config.itemModel}`,
    );
  }, [user, itemUser, vehicle, router, pathname, config.itemModel]);

  const handleModalConfirm = useCallback(async () => {
    if (!user || !vehicle) return;
    try {
      const response: any = await addToFavorite({
        title: vehicle.title,
        description: vehicle.description,
        price: String(vehicle.price),
        image: images[0] || "",
        itemId: vehicle.id,
        category: config.itemModel,
      });
      setShowModal(false);
      if (!response?.error) router.push("/mine/favorites");
    } catch {
      setShowModal(false);
    }
  }, [user, vehicle, images, router, config.itemModel]);

  const handlePrevImage = useCallback(
    () => setSelectedImageIndex((p) => (p === 0 ? images.length - 1 : p - 1)),
    [images.length],
  );
  const handleNextImage = useCallback(
    () => setSelectedImageIndex((p) => (p === images.length - 1 ? 0 : p + 1)),
    [images.length],
  );
  const handleZoomOpen = useCallback(() => setIsZoomed(true), []);
  const handleZoomClose = useCallback(() => setIsZoomed(false), []);
  const handleHeartClick = useCallback(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowModal(true);
  }, [user, router, pathname]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading />
      </div>
    );

  if (!vehicle)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Listing not found.
      </div>
    );

  const currentImage = images[selectedImageIndex];
  const description = vehicle.description || "";
  const shouldTruncate = description.length > 300;
  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();
  const category = vehicle.category?.[0] ?? "";

  return (
    <div className="my-12 px-4 md:px-6 min-h-screen max-w-7xl mx-auto pb-24 md:pb-0">
      <div className="mb-5 font-mono text-sm flex items-center gap-1 flex-wrap text-gray-400">
        <span className="text-blue-600 font-bold capitalize">
          {config.label}
        </span>
        {category && (
          <>
            <span>/</span>
            <span className="capitalize">{category}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 min-w-0">
          <div className="relative">
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
                    alt={vehicle.title}
                    fill
                    className={`object-cover transition-opacity duration-300 group-hover:opacity-90 ${vehicle.maGaday ? "opacity-70" : "opacity-100"}`}
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
                      className="relative bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <AiOutlineHeart className="w-5 h-5 text-red-500" />
                      {savedReady && savedCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none shadow-sm">
                          {savedCount > 99 ? "99+" : savedCount}
                        </span>
                      )}
                    </span>
                    <span className="bg-white/90 p-2.5 rounded-full shadow-md text-gray-700">
                      <AiOutlineZoomIn className="w-5 h-5" />
                    </span>
                  </span>
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-200 text-6xl">
                  <AiOutlineCamera />
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                  >
                    <IoIosArrowBack className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                  >
                    <IoIosArrowForward className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
              {images.map((thumb, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`min-w-[90px] h-20 border-2 rounded-xl overflow-hidden relative transition-all flex-shrink-0 ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-gray-100 opacity-70"}`}
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

        {isZoomed && images[selectedImageIndex] && (
          <ZoomedImageModal
            images={images}
            selectedIndex={selectedImageIndex}
            onClose={handleZoomClose}
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            setSelectedIndex={setSelectedImageIndex}
            title={vehicle.title}
          />
        )}

        <div className="space-y-7">
          <div className="space-y-2">
            <GoBackBtn />
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {vehicle.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              $
              {typeof vehicle.price === "number"
                ? vehicle.price.toLocaleString("en-US")
                : Number(vehicle.price).toLocaleString("en-US")}
            </p>
            {(vehicle.region || vehicle.city) && (
              <p className="text-sm text-gray-500">
                📍 {vehicle.region}
                {vehicle.city ? `, ${vehicle.city}` : ""}
              </p>
            )}
          </div>

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
              disabled={isOwnItem || !!vehicle.maGaday || messagingLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${isOwnItem || vehicle.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"}`}
            >
              <MessageSquare size={17} />
              {vehicle.maGaday
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

          {vehicle.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 border-b pb-3">
              {config.label} Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {config.fields.map(({ key, label, format }) => {
                const value = vehicle[key as keyof typeof vehicle];
                if (value === undefined || value === null || value === "")
                  return null;
                return (
                  <div key={key}>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {label}
                    </span>
                    <span className="font-bold text-gray-800 capitalize">
                      {format ? format(value) : String(value)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-black text-gray-700 uppercase tracking-wider border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm">
              <p className="whitespace-pre-line">
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

          <div className="p-5 border border-gray-200 rounded-xl bg-white">
            <Link
              href={`/components/Report/${vehicle.id}`}
              className="text-red-500 text-xs font-bold uppercase tracking-widest"
            >
              Report this item
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-xl font-extrabold text-blue-700 truncate">
            $
            {typeof vehicle.price === "number"
              ? vehicle.price.toLocaleString("en-US")
              : Number(vehicle.price).toLocaleString("en-US")}
          </p>
          <p className="text-xs text-gray-500 truncate">{vehicle.title}</p>
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
          disabled={isOwnItem || !!vehicle.maGaday || messagingLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${isOwnItem || vehicle.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"}`}
        >
          <MessageSquare size={16} />
          {vehicle.maGaday
            ? "Sold"
            : messagingLoading
              ? "Opening…"
              : "Message Seller"}
        </button>
      </div>

      {showModal && (
        <SaveFavoriteModel
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
        />
      )}

      <Recommendations
        userId={user?.id ?? user?._id}
        excludeId={vehicle?.id}
        category={
          vehicle?.mainCategory ?? vehicle?.category?.[0] ?? vehicleType
        }
        limit={4}
      />
    </div>
  );
}
