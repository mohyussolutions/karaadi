"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "@/app/utils/icons";
import Image from "next/image";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { getRealEstateById } from "@/actions/categories/realEstateActions";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { ImageControls } from "@/app/ui/invoices/ImageControls";
import { useAuth } from "@/context/AuthContext";
import { MessageSquare, Phone } from "lucide-react";

interface RealEstateItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  images: (string | File)[];
  region?: string;
  city?: string;
  user?: any;
  bedrooms?: number;
  bathrooms?: number;
  squareFeet?: number;
  subCategory?: string;
  maGadayn?: boolean;
  userId?: string;
}

const isValidImageUrl = (url: any): url is string => {
  return (
    typeof url === "string" &&
    (url.startsWith("http") ||
      url.startsWith("/") ||
      url.startsWith("data:image") ||
      url.startsWith("blob:"))
  );
};

function RealEstateDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, loading: authLoading } = useAuth();

  const [realEstate, setRealEstate] = useState<RealEstateItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  useEffect(() => {
    async function init() {
      if (!id) return;
      try {
        const data = await getRealEstateById(id);
        if (data) {
          setRealEstate({
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
          });
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    }
    init();
  }, [id]);

  const itemUser = useMemo(() => {
    if (!realEstate) return null;
    const u = realEstate.user;
    if (u && typeof u === "object") {
      return {
        id: String(u._id || u.id || ""),
        username: u.username || u.name || "Seller",
        profileImage: u.profileImage || u.profile_image || null,
        phone: u.phone || u.phone_number || null,
      };
    }
    return {
      id: String(realEstate.userId || ""),
      username: "Seller",
      profileImage: null,
      phone: null,
    };
  }, [realEstate]);

  const isOwnItem =
    !!itemUser &&
    !!currentUser &&
    String(itemUser.id) === String(currentUser._id || currentUser.id);

  const handleSendMessage = () => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const finalReceiverId = itemUser?.id || realEstate?.userId;
    const finalItemId = realEstate?.id;
    if (!finalReceiverId || !finalItemId || realEstate?.maGadayn) return;
    setMessagingLoading(true);
    router.push(`/messages?sellerId=${finalReceiverId}&itemId=${finalItemId}&itemModel=RealEstate`);
  };

  const handleModalConfirm = async () => {
    if (!realEstate) return;
    const firstImage = realEstate.images[0];
    const imageToSend = typeof firstImage === "string" ? firstImage : "";
    try {
      const response: any = await addToFavorite({
        title: realEstate.title,
        description: realEstate.description,
        price: String(realEstate.price),
        image: imageToSend,
        itemId: realEstate.id,
        category: "RealEstate",
      });
      setShowModal(false);
      if (!response?.error) {
        router.push("/mine/favorites");
      }
    } catch {
      setShowModal(false);
    }
  };

  const images = useMemo(() => {
    return (realEstate?.images || [])
      .map((img) => (typeof img === "string" ? img : URL.createObjectURL(img)))
      .filter(isValidImageUrl);
  }, [realEstate?.images]);

  if (isLoading || authLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  if (!realEstate)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        Listing not found
      </div>
    );

  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();

  return (
    <div className="my-12 px-6 min-h-screen pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto mb-6 font-mono text-blue-600 text-sm">
        <p>
          {realEstate.region}, {realEstate.city}
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-6">
          <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[500px] md:h-[700px]">
            {images[selectedImageIndex] && (
              <>
                <Image
                  src={images[selectedImageIndex]}
                  alt={realEstate.title}
                  fill
                  className={`object-cover cursor-pointer ${realEstate.maGadayn ? "opacity-70" : ""}`}
                  priority
                />
                <ImageControls
                  onHeartClick={() =>
                    currentUser ? setShowModal(true) : router.push("/login")
                  }
                  onZoomClick={() => {}}
                />
              </>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? images.length - 1 : prev - 1,
                    )
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                >
                  <IoIosArrowBack className="w-6 h-6 text-white" />
                </button>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) =>
                      prev === images.length - 1 ? 0 : prev + 1,
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
            {images.map((src, i) => (
              <button
                key={i}
                onClick={() => setSelectedImageIndex(i)}
                className={`min-w-[100px] h-24 border-2 rounded-xl overflow-hidden relative transition-all ${selectedImageIndex === i ? "border-blue-500 scale-105" : "opacity-70"}`}
              >
                <Image
                  src={src}
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
          <div className="space-y-3">
            <GoBackBtn />
            <h1 className="text-4xl font-extrabold text-gray-900 leading-tight">
              {realEstate.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(realEstate.price).toLocaleString()}
            </p>
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
                disabled={realEstate.maGadayn || messagingLoading}
                className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${
                  realEstate.maGadayn
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : messagingLoading
                    ? "bg-blue-400 text-white cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
                }`}
              >
                <MessageSquare size={17} />
                {realEstate.maGadayn
                  ? "Item sold"
                  : messagingLoading
                  ? "Opening…"
                  : "Send Message"}
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

          {realEstate.maGadayn && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              waa la gatay
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold uppercase mb-4 border-b pb-2">
              Property Details
            </h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-lg">
              {realEstate.bedrooms && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Bedrooms
                  </span>
                  <span className="font-bold">{realEstate.bedrooms}</span>
                </div>
              )}
              {realEstate.bathrooms && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Bathrooms
                  </span>
                  <span className="font-bold">{realEstate.bathrooms}</span>
                </div>
              )}
              {realEstate.squareFeet && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Square Feet
                  </span>
                  <span className="font-bold">
                    {realEstate.squareFeet.toLocaleString()} sq ft
                  </span>
                </div>
              )}
              {realEstate.subCategory && (
                <div>
                  <span className="text-gray-400 font-bold uppercase text-xs block">
                    Type
                  </span>
                  <span className="font-bold uppercase">
                    {realEstate.subCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
              Description
            </h2>
            <div className="text-gray-700 leading-relaxed">
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

          <div className="mt-8 p-6 border-2 border-gray-200 shadow-sm bg-white">
            <Link
              href={`/components/Report/${realEstate.id}`}
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
              ${Number(realEstate.price).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 truncate">{realEstate.title}</p>
          </div>
          {itemUser?.phone && (
            <button
              onClick={() => setShowPhone((p) => !p)}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-all active:scale-[0.97] flex-shrink-0"
            >
              <Phone size={15} />
              <span className="text-xs">{showPhone ? itemUser.phone : "Phone"}</span>
            </button>
          )}
          <button
            onClick={handleSendMessage}
            disabled={realEstate.maGadayn || messagingLoading}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${
              realEstate.maGadayn
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : messagingLoading
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
            }`}
          >
            <MessageSquare size={16} />
            {realEstate.maGadayn ? "Sold" : messagingLoading ? "Opening…" : "Message Seller"}
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

export default RealEstateDetails;
