"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowForward, IoIosArrowBack } from "@/app/utils/icons";
import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import Loading from "@/app/ui/loading/Loading";
import UserCard from "@/app/(storeFront)/components/Cards/NormalCards/UserProfileCard";
import { ImageControls } from "@/app/ui/invoices/ImageControls";

import { addToFavorite } from "@/actions/categories/favoriteAction";
import { getCarById } from "@/actions/categories/carActions";
import { getBoatById } from "@/actions/categories/boatActions";
import { getMotorcycleById } from "@/actions/categories/motorcycleActions";
import { getFarmEquipmentById } from "@/actions/categories/FarmequipmentAction";
import { API_ENDPOINTS } from "@/actions/constant/sockets";
import { useAuth } from "@/context/AuthContext";

interface VehicleItem {
  _id: string;
  title: string;
  description: string | string[];
  price: number | string;
  images: string[];
  region?: string;
  city?: string;
  brand?: string;
  make?: string;
  year?: number | string;
  mileage?: number;
  hours?: number;
  fuelType?: string;
  vehicleModel?: string;
  modelName?: string;
  boatModel?: string;
  traktortModel?: string;
  maGaday?: boolean;
  user?: any;
}

export default function VehicleDetails() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [item, setItem] = useState<VehicleItem | null>(null);
  const [category, setCategory] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      if (!id) return;
      try {
        const [car, boat, tractor, motorcycle] = await Promise.all([
          getCarById(id),
          getBoatById(id),
          getFarmEquipmentById(id),
          getMotorcycleById(id),
        ]);
        if (!isMounted) return;
        if (car) { setItem(car as any); setCategory("Car"); }
        else if (boat) { setItem(boat as any); setCategory("Boat"); }
        else if (tractor) { setItem(tractor as any); setCategory("Tractor"); }
        else if (motorcycle) { setItem(motorcycle as any); setCategory("Motorcycle"); }
      } catch {
      } finally {
        if (isMounted) setDataLoading(false);
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  const images = useMemo(
    () => (Array.isArray(item?.images) ? item.images.filter(Boolean) : []),
    [item],
  );

  const selectedImage = images[selectedImageIndex] || "";

  const handleSendMessage = async () => {
    if (!currentUser) return router.push("/login");
    if (item?.maGaday) return;
    const sellerId = typeof item?.user === "object" ? item.user?._id : item?.user;
    if (!sellerId || !item?._id) return;
    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ senderId: currentUser._id, receiverId: sellerId, itemId: item._id, itemModel: category }),
      });
      const result = await response.json();
      if (response.ok && result.chat?.id) {
        router.push(`/messages/${result.chat.id}`);
      } else {
        router.push(`/messages?itemId=${item._id}&sellerId=${sellerId}&itemModel=${category}`);
      }
    } catch {
      router.push(`/messages?itemId=${item._id}&sellerId=${sellerId}&itemModel=${category}`);
    }
  };

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
    if (item?.maGaday) return;
    setShowModal(true);
  };

  const handleModalConfirm = async () => {
    if (!item) return;
    try {
      const descriptionText = Array.isArray(item.description)
        ? item.description.join(" ")
        : item.description || "";
      const response: any = await addToFavorite({
        title: item.title,
        description: descriptionText,
        price: String(item.price),
        image: item.images?.[0] || "",
        itemId: item._id,
        category,
      });
      setShowModal(false);
      if (!response?.error) router.push("/mine/favorites");
    } catch {
      setShowModal(false);
    }
  };

  if (dataLoading || authLoading)
    return <div className="h-screen flex items-center justify-center"><Loading /></div>;

  if (!item)
    return <div className="p-20 text-center font-black text-red-500 uppercase tracking-tighter">Product Not Found</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 min-h-screen pb-24 md:pb-12">
      <div className="mb-6 flex items-center justify-between">
        <GoBackBtn />
        <div className="font-bold text-blue-600 text-sm uppercase tracking-widest bg-blue-50 px-4 py-2 rounded-full">
          {item.region} • {item.city}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="space-y-6">
          <div className="relative aspect-[4/5] md:aspect-square bg-gray-50 rounded-3xl overflow-hidden shadow-sm border border-gray-100 flex items-center justify-center">
            {selectedImage && (
              <>
                <div
                  className="absolute inset-0 opacity-10 blur-2xl scale-125"
                  style={{ backgroundImage: `url(${selectedImage})`, backgroundSize: "cover" }}
                />
                <Image
                  src={selectedImage}
                  alt={item.title}
                  fill
                  className={`object-contain p-6 z-10 transition-opacity duration-300 ${item.maGaday ? "opacity-50 grayscale" : "opacity-100"}`}
                  priority
                />
                <ImageControls onHeartClick={handleHeartClick} onZoomClick={() => {}} />
                {item.maGaday && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
                    <span className="bg-yellow-400 text-black font-black px-8 py-3 rounded-full text-xl uppercase shadow-2xl rotate-[-5deg]">
                      Waa la gatay
                    </span>
                  </div>
                )}
              </>
            )}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((p) => p === 0 ? images.length - 1 : p - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full z-20 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <IoIosArrowBack size={20} />
                </button>
                <button
                  onClick={() => setSelectedImageIndex((p) => p === images.length - 1 ? 0 : p + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 p-4 rounded-full z-20 shadow-lg hover:bg-blue-600 hover:text-white transition-all"
                >
                  <IoIosArrowForward size={20} />
                </button>
              </>
            )}
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
            {images.map((thumb, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`relative min-w-[100px] h-24 rounded-2xl overflow-hidden border-4 transition-all ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-transparent opacity-60 hover:opacity-100"}`}
              >
                <Image src={thumb} alt="thumb" fill className="object-cover" sizes="100px" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight uppercase tracking-tight">
              {item.title}
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-blue-600">
                ${Number(item.price).toLocaleString()}
              </span>
              <span className="text-gray-400 font-bold uppercase text-xs">Cash/Total</span>
            </div>
          </div>

          <div className="hidden md:block">
            <UserCard
              user={{
                id: typeof item.user === "object" ? item.user?._id : item.user || "",
                username: typeof item.user === "object" ? item.user?.username : "Verified Seller",
                profileImage: typeof item.user === "object" ? item.user?.profileImage : null,
                phone: typeof item.user === "object" ? item.user?.phone : null,
              }}
              isLoggedIn={Boolean(currentUser)}
              itemId={item._id}
              itemTitle={item.title}
              itemName={category}
              maGaday={item.maGaday}
              onSendMessage={handleSendMessage}
            />
          </div>

          <div className="bg-gray-50/50 p-6 sm:p-8 rounded-3xl border border-gray-100">
            <h3 className="text-sm font-black uppercase text-gray-400 tracking-[0.2em] mb-6">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-2 gap-6 sm:gap-8">
              {(item.brand || item.make) && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Make</span>
                  <span className="font-bold text-gray-800">{item.brand || item.make}</span>
                </div>
              )}
              {(item.vehicleModel || item.modelName || item.boatModel || item.traktortModel) && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Model</span>
                  <span className="font-bold text-gray-800">{item.vehicleModel || item.modelName || item.boatModel || item.traktortModel}</span>
                </div>
              )}
              {item.year && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Year</span>
                  <span className="font-bold text-gray-800">{item.year}</span>
                </div>
              )}
              {item.mileage !== undefined && (
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Mileage</span>
                  <span className="font-bold text-gray-800">{item.mileage.toLocaleString()} KM</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-black text-gray-900 uppercase">Product Description</h2>
            <div className="text-gray-600 leading-relaxed font-medium">
              <p className="whitespace-pre-line">
                {typeof item.description === "string"
                  ? isExpanded
                    ? item.description
                    : `${item.description.slice(0, 300)}${item.description.length > 300 ? "..." : ""}`
                  : item.description.join(" ")}
              </p>
              {typeof item.description === "string" && item.description.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 font-black mt-3 hover:text-blue-800 uppercase text-xs tracking-tighter"
                >
                  {isExpanded ? "Show Less [-]" : "Read Full Story [+]"}
                </button>
              )}
            </div>
          </div>

          <div className="pt-8 border-t border-gray-100 flex justify-between items-center">
            <Link
              href={`/components/Report/${item._id}`}
              className="text-gray-400 text-[10px] font-bold uppercase tracking-widest hover:text-red-500 transition-colors"
            >
              Report this listing
            </Link>
            <span className="text-[10px] font-bold text-gray-300 uppercase italic">ID: {item._id}</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 px-4 py-3 flex gap-3 shadow-lg">
        <button
          onClick={handleSendMessage}
          disabled={item.maGaday}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all active:scale-[0.98] ${
            item.maGaday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
          }`}
        >
          <MessageSquare size={17} />
          {item.maGaday ? "Item sold" : "Send message"}
        </button>
        {typeof item.user === "object" && item.user?.phone && !item.maGaday && (
          <a
            href={`tel:${item.user.phone}`}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all active:scale-[0.98]"
          >
            {item.user.phone}
          </a>
        )}
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
