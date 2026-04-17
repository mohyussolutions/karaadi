"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, useCallback } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { ImageControls } from "@/app/ui/invoices/ImageControls";
import { useAuth } from "@/context/AuthContext";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { getCarById } from "@/actions/categories/carActions";
import { getBoatById } from "@/actions/categories/boatActions";
import { getMotorcycleById } from "@/actions/categories/motorcycleActions";
import { getFarmEquipmentById } from "@/actions/categories/FarmequipmentAction";
import { MessageSquare, Phone } from "lucide-react";

export type VehicleType = "car" | "boat" | "motorcycle" | "farmequipment";

interface VehicleItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  images: string[];
  region?: string;
  city?: string;
  user?: any;
  userId?: string;
  maGaday?: boolean;
  make?: string;
  model?: string;
  year?: number | string;
  mileage?: number | string;
  fuelType?: string;
  transmission?: string;
  condition?: string;
  color?: string;
  boatType?: string;
  length?: number | string;
  hullMaterial?: string;
  engineHours?: number | string;
  engineCC?: number | string;
  bikeType?: string;
  equipmentType?: string;
  brand?: string;
  horsepower?: number | string;
  hoursUsed?: number | string;
}

const VEHICLE_CONFIG: Record<VehicleType, {
  label: string;
  itemModel: string;
  fetchFn: (id: string) => Promise<any>;
  fields: { key: keyof VehicleItem; label: string; format?: (v: any) => string }[];
}> = {
  car: {
    label: "Car",
    itemModel: "Car",
    fetchFn: getCarById,
    fields: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "mileage", label: "Mileage", format: (v) => `${Number(v).toLocaleString()} km` },
      { key: "fuelType", label: "Fuel Type" },
      { key: "transmission", label: "Transmission" },
      { key: "condition", label: "Condition" },
      { key: "color", label: "Color" },
    ],
  },
  boat: {
    label: "Boat",
    itemModel: "Boat",
    fetchFn: getBoatById,
    fields: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "boatType", label: "Boat Type" },
      { key: "length", label: "Length", format: (v) => `${v} ft` },
      { key: "hullMaterial", label: "Hull Material" },
      { key: "engineHours", label: "Engine Hours", format: (v) => `${Number(v).toLocaleString()} hrs` },
      { key: "condition", label: "Condition" },
    ],
  },
  motorcycle: {
    label: "Motorcycle",
    itemModel: "Motorcycle",
    fetchFn: getMotorcycleById,
    fields: [
      { key: "make", label: "Make" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "engineCC", label: "Engine", format: (v) => `${v} cc` },
      { key: "bikeType", label: "Type" },
      { key: "mileage", label: "Mileage", format: (v) => `${Number(v).toLocaleString()} km` },
      { key: "color", label: "Color" },
      { key: "condition", label: "Condition" },
    ],
  },
  farmequipment: {
    label: "Farm Equipment",
    itemModel: "FarmEquipment",
    fetchFn: getFarmEquipmentById,
    fields: [
      { key: "brand", label: "Brand" },
      { key: "model", label: "Model" },
      { key: "year", label: "Year" },
      { key: "equipmentType", label: "Equipment Type" },
      { key: "horsepower", label: "Horsepower", format: (v) => `${v} HP` },
      { key: "hoursUsed", label: "Hours Used", format: (v) => `${Number(v).toLocaleString()} hrs` },
      { key: "condition", label: "Condition" },
      { key: "color", label: "Color" },
    ],
  },
};

const isValidImageUrl = (url: any): url is string =>
  typeof url === "string" && (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:image") || url.startsWith("blob:"));

export default function VehicleDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const { type, id } = useParams<{ type: string; id: string }>();
  const { user } = useAuth();

  const [vehicle, setVehicle] = useState<VehicleItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const vehicleType = (type?.toLowerCase() as VehicleType) || "car";
  const config = VEHICLE_CONFIG[vehicleType] ?? VEHICLE_CONFIG.car;

  useEffect(() => {
    if (!id) { setIsLoading(false); return; }
    let mounted = true;
    config.fetchFn(id)
      .then((data) => {
        if (mounted && data) {
          setVehicle({
            ...data,
            id: typeof data._id === "string" ? data._id : typeof data.id === "string" ? data.id : "",
            title: data.title ?? "",
            description: data.description ?? "",
            price: data.price ?? "",
            images: data.images ?? [],
          });
        }
      })
      .catch(() => {})
      .finally(() => { if (mounted) setIsLoading(false); });
    return () => { mounted = false; };
  }, [id, vehicleType]);

  const images = useMemo(() => (vehicle?.images ?? []).filter(isValidImageUrl), [vehicle?.images]);

  const itemUser = useMemo(() => {
    if (!vehicle) return null;
    const u = vehicle.user;
    if (u && typeof u === "object") {
      return { id: String(u._id || u.id || ""), username: u.username || u.name || "Seller", profileImage: u.profileImage || null, phone: u.phone || null };
    }
    return { id: String(vehicle.userId || ""), username: "Seller", profileImage: null, phone: null };
  }, [vehicle]);

  const isOwnItem = !!itemUser && !!user && String(itemUser.id) === String(user._id || user.id);

  const handleSendMessage = useCallback(() => {
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const receiverId = itemUser?.id || vehicle?.userId;
    const itemId = vehicle?.id;
    if (!receiverId || !itemId || vehicle?.maGaday) return;
    setMessagingLoading(true);
    router.push(`/messages?sellerId=${receiverId}&itemId=${itemId}&itemModel=${config.itemModel}`);
  }, [user, itemUser, vehicle, router, pathname, config.itemModel]);

  const handleModalConfirm = useCallback(async () => {
    if (!user) { router.push("/login"); return; }
    if (!vehicle) return;
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

  const handlePrevImage = useCallback(() => {
    setSelectedImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  }, [images.length]);

  const handleNextImage = useCallback(() => {
    setSelectedImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));
  }, [images.length]);

  if (isLoading) {
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
              <div className="bg-gray-100 rounded-2xl h-40" />
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

  if (!vehicle) {
    return <div className="p-8 text-center text-red-600 font-bold">{config.label} listing not found.</div>;
  }

  const currentImage = images[selectedImageIndex];
  const description = vehicle.description || "";
  const shouldTruncate = description.length > 300;
  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();

  return (
    <div className="my-12 px-6 min-h-screen max-w-7xl mx-auto pb-24 md:pb-0">
      <div className="mb-6 font-mono text-blue-600 text-sm h-5">
        <p>{vehicle.region}, {vehicle.city}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[600px] md:h-[700px]">
            {currentImage && (
              <Image
                src={currentImage}
                alt={vehicle.title || "Vehicle image"}
                fill
                className={`object-cover transition-opacity duration-300 ${vehicle.maGaday ? "opacity-70" : "opacity-100"}`}
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
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">{vehicle.title}</h1>
            <p className="text-3xl font-bold text-blue-700">${Number(vehicle.price).toLocaleString()}</p>
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
                disabled={vehicle.maGaday || messagingLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${vehicle.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"}`}
              >
                <MessageSquare size={17} />
                {vehicle.maGaday ? "Item sold" : messagingLoading ? "Opening…" : "Send Message"}
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

          {vehicle.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold uppercase mb-4 border-b pb-2">{config.label} Details</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
              {config.fields.map(({ key, label, format }) => {
                const value = vehicle[key];
                if (value === undefined || value === null || value === "") return null;
                return (
                  <div key={key}>
                    <span className="text-gray-400 font-bold uppercase text-xs block">{label}</span>
                    <span className="font-bold capitalize">{format ? format(value) : String(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">Description</h2>
            <div className="text-gray-700 leading-relaxed text-base">
              <p className="whitespace-pre-line">
                {isExpanded || !shouldTruncate ? description : `${description.slice(0, 300)}...`}
              </p>
              {shouldTruncate && (
                <button onClick={() => setIsExpanded((p) => !p)} className="text-blue-600 font-bold mt-2 hover:underline">
                  {isExpanded ? "Show Less" : "Read More"}
                </button>
              )}
            </div>
          </div>

          <div className="mt-8 p-6 border-2 border-gray-200 shadow-sm bg-white hover:border-red-200 transition-all duration-300">
            <Link href={`/components/Report/${vehicle.id}`} className="flex items-center justify-center gap-2 text-red-600 text-xs font-black uppercase tracking-[0.15em] hover:text-red-800">
              Report this item
            </Link>
          </div>
        </div>
      </div>

      {vehicle && !isOwnItem && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
          <div className="flex-1 min-w-0">
            <p className="text-xl font-extrabold text-blue-700 truncate">${Number(vehicle.price).toLocaleString()}</p>
            <p className="text-xs text-gray-500 truncate">{vehicle.title}</p>
          </div>
          {itemUser?.phone && (
            <button onClick={() => setShowPhone((p) => !p)} className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.97] flex-shrink-0">
              <Phone size={15} />
              <span className="text-xs">{showPhone ? itemUser.phone : "Phone"}</span>
            </button>
          )}
          <button
            onClick={handleSendMessage}
            disabled={vehicle.maGaday || messagingLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${vehicle.maGaday ? "bg-gray-100 text-gray-400 cursor-not-allowed" : messagingLoading ? "bg-blue-400 text-white cursor-wait" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"}`}
          >
            <MessageSquare size={16} />
            {vehicle.maGaday ? "Sold" : messagingLoading ? "Opening…" : "Message Seller"}
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
    </div>
  );
}
