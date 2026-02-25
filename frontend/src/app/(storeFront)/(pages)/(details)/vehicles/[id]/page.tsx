"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";

import { ImageControls } from "@/app/(storeFront)/components/hooks/useRenderImageControls";
import UserCard from "@/app/(storeFront)/components/Cards/UserProfileCard";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { verifySession } from "@/actions/core/authAction";
import { getCarById } from "@/actions/categories/carActions";
import { getBoatById } from "@/actions/categories/boatActions";
import { getMotorcycleById } from "@/actions/categories/motorcycleActions";
import { getTraktorById } from "@/actions/categories/FarmequipmentAction";
import { API_ENDPOINTS } from "@/actions/constant/sockets";

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

  const [item, setItem] = useState<VehicleItem | null>(null);
  const [category, setCategory] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!id) return;
      try {
        let vehicle = null;
        let vehicleCategory = "";
        vehicle = await getCarById(id);
        if (vehicle) vehicleCategory = "Car";
        if (!vehicle) {
          vehicle = await getBoatById(id);
          if (vehicle) vehicleCategory = "Boat";
        }
        if (!vehicle) {
          vehicle = await getTraktorById(id);
          if (vehicle) vehicleCategory = "Tractor";
        }
        if (!vehicle) {
          vehicle = await getMotorcycleById(id);
          if (vehicle) vehicleCategory = "Motorcycle";
        }
        const user = await verifySession();
        if (mounted) {
          setCurrentUser(user ?? null);
          if (vehicle) {
            setItem(vehicle);
            setCategory(vehicleCategory);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleSendMessage = async () => {
    if (!currentUser) return router.push("/login");
    const sellerId =
      typeof item?.user === "object" ? item.user?._id : item?.user;
    if (!sellerId || !item?._id || item?.maGaday) return;

    try {
      const response = await fetch(API_ENDPOINTS.CHATS.CREATE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: currentUser._id,
          receiverId: sellerId,
          itemId: item._id,
          itemModel: category,
        }),
      });
      if (response.ok) {
        const result = await response.json();
        if (result.chat?.id) router.push(`/messages/${result.chat.id}`);
      } else {
        router.push(`/messages?itemId=${item._id}&sellerId=${sellerId}`);
      }
    } catch {
      router.push(`/messages?itemId=${item._id}&sellerId=${sellerId}`);
    }
  };

  const handleHeartClick = () => {
    if (!currentUser) return router.push("/login");
    if (item?.maGaday) return toast.warning("Alaabtan waa la gatay");
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
        category: category,
      });

      if (response?.message === "You have already saved this item") {
        toast.info("Alaabtan mar horre ayaad kaydisay!");
      } else {
        toast.success(`"${item.title}" waa la kaydiyay!`);
        setTimeout(() => router.push("/mine/favorites"), 1200);
      }
      setShowModal(false);
    } catch {
      toast.error("Wuu ku fashilmay kaydinta");
    }
  };

  if (isLoading) return <div className="min-h-screen bg-white" />;
  if (!item)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Product Not Found
      </div>
    );

  const images = Array.isArray(item.images) ? item.images.filter(Boolean) : [];
  const selectedImage = images[selectedImageIndex] || "";

  return (
    <div className="my-12 px-6 min-h-screen">
      <div className="max-w-7xl mx-auto mb-6 font-mono text-blue-600 text-sm h-5">
        <p>
          {item.region}, {item.city}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[700px]">
            {selectedImage && (
              <>
                <Image
                  src={selectedImage}
                  alt={item.title}
                  fill
                  className={`object-cover cursor-pointer ${item.maGaday ? "opacity-70" : ""}`}
                  priority
                />
                <ImageControls
                  onHeartClick={handleHeartClick}
                  onZoomClick={() => {}}
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
                onClick={() => setSelectedImageIndex(i)}
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all ${selectedImageIndex === i ? "border-blue-500 scale-105" : "border-transparent opacity-70 hover:opacity-100"}`}
              >
                <Image
                  src={thumb}
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
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight uppercase">
              {item.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(item.price).toLocaleString()}
            </p>
          </div>

          {item.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm">
              <span className="text-xl uppercase tracking-widest">
                waa la gatay
              </span>
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold uppercase mb-4 border-b pb-2">
              Technical Specs
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
              {(item.brand || item.make) && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Make
                  </span>
                  <span className="font-bold">{item.brand || item.make}</span>
                </div>
              )}
              {(item.vehicleModel ||
                item.modelName ||
                item.boatModel ||
                item.traktortModel) && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Model
                  </span>
                  <span className="font-bold">
                    {item.vehicleModel ||
                      item.modelName ||
                      item.boatModel ||
                      item.traktortModel}
                  </span>
                </div>
              )}
              {item.year && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Year
                  </span>
                  <span className="font-bold">{item.year}</span>
                </div>
              )}
              {item.mileage !== undefined && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Mileage
                  </span>
                  <span className="font-bold">
                    {item.mileage.toLocaleString()} KM
                  </span>
                </div>
              )}
              {item.fuelType && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Fuel
                  </span>
                  <span className="font-bold uppercase">{item.fuelType}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <UserCard
              user={{
                id:
                  typeof item.user === "object"
                    ? item.user?._id
                    : item.user || "",
                username:
                  typeof item.user === "object"
                    ? item.user?.username
                    : "Seller",
                profileImage:
                  typeof item.user === "object"
                    ? item.user?.profileImage
                    : null,
                phone: typeof item.user === "object" ? item.user?.phone : null,
              }}
              isLoggedIn={Boolean(currentUser)}
              itemId={item._id}
              itemTitle={item.title}
              itemName={category}
              onSendMessage={handleSendMessage}
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed text-base">
              <p className="whitespace-pre-line">
                {typeof item.description === "string"
                  ? isExpanded
                    ? item.description
                    : `${item.description.slice(0, 250)}...`
                  : item.description.join(" ")}
              </p>
              {typeof item.description === "string" &&
                item.description.length > 250 && (
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
              href={`/components/Report/${item._id}`}
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
