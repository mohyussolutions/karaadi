"use client";

import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { IoIosArrowForward, IoIosArrowBack } from "@/app/utils/icons";
import Image from "next/image";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import Loading from "@/app/ui/loading/Loading";
import { addToFavorite } from "@/actions/categories/favoriteAction";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { MessageSquare, Phone } from "lucide-react";
import Recommendations from "@/app/(storeFront)/components/Recommendations/Recommendations";
import { trackItemView } from "@/actions/categories/RecommendationActions";
import {
  FaBed,
  FaBath,
  FaRulerCombined,
  FaBuilding,
  FaLayerGroup,
  FaCouch,
  FaCar,
  FaWarehouse,
  FaSeedling,
  FaSwimmingPool,
  FaDumbbell,
  FaShieldAlt,
  FaBolt,
  FaTint,
  FaWind,
  FaTree,
  FaHome,
} from "react-icons/fa";
import { MdBalcony, MdElevator } from "react-icons/md";
import { AiOutlineHeart, AiOutlineZoomIn } from "react-icons/ai";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";
import { getRealEstateById } from "@/actions/categories/realEstateActions";
import ZoomedImageModal from "../../zoomed/ZoomedImageModal";

interface RealEstateItem {
  id: string;
  _id?: string;
  title: string;
  description: string;
  price: number | string;
  images: (string | File)[];
  mainCategory?: string;
  category?: string[];
  subcategory?: string[];
  propertyType?: string;
  region?: string;
  city?: string;
  address?: string;
  bedrooms?: number;
  bathrooms?: number;
  floor?: number;
  totalFloors?: number;
  squareFeet?: number;
  sizeSqm?: number;
  furnished?: boolean;
  parking?: boolean;
  hasGarage?: boolean;
  hasGarden?: boolean;
  amenities?: string[];
  user?: any;
  maGaday?: boolean;
  userId?: string;
}

const AMENITY_ICONS: Record<string, React.ReactNode> = {
  "Swimming Pool": <FaSwimmingPool size={14} />,
  Gym: <FaDumbbell size={14} />,
  Security: <FaShieldAlt size={14} />,
  Elevator: <MdElevator size={14} />,
  Generator: <FaBolt size={14} />,
  "Water Supply": <FaTint size={14} />,
  "Air Conditioning": <FaWind size={14} />,
  Garden: <FaTree size={14} />,
  Balcony: <MdBalcony size={14} />,
  Parking: <FaCar size={14} />,
};

const API_BASE = BASE_API_URL;
const resolveImageUrl = (url: any): string | null => {
  if (typeof url !== "string" || url.trim() === "") return null;
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("/") ||
    url.startsWith("blob:")
  )
    return url;
  return `${API_BASE}/${url}`;
};
const isValidImageUrl = (url: any): url is string =>
  resolveImageUrl(url) !== null;

function RealEstateDetails() {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams<{ id: string }>();
  const { user: currentUser, loading: authLoading } = useAuth();
  const { t } = useTranslation();

  const [realEstate, setRealEstate] = useState<RealEstateItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [messagingLoading, setMessagingLoading] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [showPhone, setShowPhone] = useState(false);
  const [avatarError, setAvatarError] = useState(false);

  const handleZoomOpen = useCallback(() => setIsZoomed(true), []);
  const handleZoomClose = useCallback(() => setIsZoomed(false), []);

  const handleHeartClick = useCallback(() => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    setShowModal(true);
  }, [currentUser, router, pathname]);

  useEffect(() => {
    router.prefetch("/messages");
  }, [router]);

  useEffect(() => {
    async function init() {
      if (!id) return;
      try {
        const data = await getRealEstateById(id);
        if (data) {
          const resolvedId =
            typeof data._id === "string"
              ? data._id
              : typeof data.id === "string"
                ? data.id
                : "";
          setRealEstate({
            ...data,
            id: resolvedId,
            title: data.title ?? "",
            description: data.description ?? "",
            price: data.price ?? "",
            images: data.images ?? [],
          });
          if (resolvedId) {
            const cat =
              data.mainCategory ?? (data.category as any)?.[0] ?? "real-estate";
            trackItemView(resolvedId, cat, currentUser?.id ?? null);
          }
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

  const sellerId = itemUser?.id || "";
  const buyerId = String(currentUser?._id || currentUser?.id || "");
  const isOwnItem = !!sellerId && !!buyerId && sellerId === buyerId;

  const handleSendMessage = () => {
    if (!currentUser) {
      router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const finalReceiverId = itemUser?.id || realEstate?.userId;
    const finalItemId = realEstate?.id;
    if (!finalReceiverId || !finalItemId || realEstate?.maGaday) return;
    setMessagingLoading(true);
    router.push(
      `/messages?sellerId=${finalReceiverId}&itemId=${finalItemId}&itemModel=RealEstate`,
    );
  };

  const handlePrevImage = () =>
    setSelectedImageIndex((p) => (p === 0 ? images.length - 1 : p - 1));
  const handleNextImage = () =>
    setSelectedImageIndex((p) => (p === images.length - 1 ? 0 : p + 1));

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
      if (!response?.error) router.push("/mine/favorites");
    } catch {
      setShowModal(false);
    }
  };

  const images = useMemo(
    () =>
      (realEstate?.images || [])
        .map((img) =>
          typeof img === "string" ? img : URL.createObjectURL(img),
        )
        .map((url) => resolveImageUrl(url))
        .filter((url): url is string => url !== null),
    [realEstate?.images],
  );

  if (isLoading || authLoading)
    return (
      <div className="min-h-screen flex justify-center items-center">
        <Loading />
      </div>
    );
  if (!realEstate)
    return (
      <div className="p-8 text-center text-red-600 font-bold">
        {t("realEstateDetail.listingNotFound")}
      </div>
    );

  const sellerInitial = (itemUser?.username || "S").charAt(0).toUpperCase();
  const categoryKey = realEstate.category?.[0] ?? "";
  const subcategoryRaw = realEstate.subcategory?.[0] ?? "";

  const translateCategory = (key: string) =>
    t(`createRealEstate.categories.${key}`, { defaultValue: key });

  const translateSubcategory = (raw: string) => {
    if (!raw) return "";
    if (raw.startsWith("subcategories."))
      return t(raw, { defaultValue: raw.split(".").pop() });
    const fromNested = t(
      `subcategories.realEstateNested.${categoryKey}.${raw}`,
      { defaultValue: "" },
    );
    if (fromNested) return fromNested;
    return raw;
  };

  const category = translateCategory(categoryKey);
  const subcategory = translateSubcategory(subcategoryRaw);
  const hasFeatures =
    realEstate.furnished ||
    realEstate.parking ||
    realEstate.hasGarage ||
    realEstate.hasGarden;
  const amenities = realEstate.amenities ?? [];

  return (
    <div className="my-12 px-4 md:px-6 min-h-screen pb-24 md:pb-0">
      <div className="max-w-7xl mx-auto mb-5 font-mono text-sm flex items-center gap-1 flex-wrap text-gray-400">
        {category && (
          <span className="text-blue-600 font-bold">{category}</span>
        )}
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        <div className="space-y-4 min-w-0">
          <div className="relative">
            <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[400px] md:h-[560px]">
              {images[selectedImageIndex] ? (
                <button
                  type="button"
                  onClick={handleZoomOpen}
                  className="w-full h-full absolute inset-0 cursor-zoom-in group"
                  style={{ background: "none", border: 0, padding: 0 }}
                  aria-label="Open fullscreen image viewer"
                >
                  <Image
                    src={images[selectedImageIndex]}
                    alt={realEstate.title}
                    fill
                    className={`object-cover transition-opacity duration-300 group-hover:opacity-90 ${realEstate.maGaday ? "opacity-70" : "opacity-100"}`}
                    priority
                  />
                  <span className="absolute right-3 top-3 z-50 flex gap-2">
                    <span role="button" tabIndex={0} onClick={(e) => { e.stopPropagation(); handleHeartClick(); }} aria-label="Save to favorites" className="bg-white/90 p-2.5 rounded-full shadow-md hover:bg-white hover:scale-110 active:scale-95 transition-all cursor-pointer">
                      <AiOutlineHeart className="w-5 h-5 text-red-500" />
                  </span>
                    <span className="bg-white/90 p-2.5 rounded-full shadow-md text-gray-700">
                      <AiOutlineZoomIn className="w-5 h-5" />
                    </span>
                  </span>
                </button>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <FaHome size={64} />
                </div>
              )}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                  >
                    <IoIosArrowBack className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full z-10 hover:bg-black/60 transition-colors"
                  >
                    <IoIosArrowForward className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`min-w-[90px] h-20 border-2 rounded-xl overflow-hidden relative transition-all flex-shrink-0 ${
                    selectedImageIndex === i
                      ? "border-blue-500 scale-105"
                      : "border-gray-100 opacity-70"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="90px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-7">
          <div className="space-y-2">
            <GoBackBtn />
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {realEstate.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              ${Number(realEstate.price).toLocaleString()}
            </p>
            {realEstate.address && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                📍 {realEstate.address}
                {realEstate.city ? `, ${realEstate.city}` : ""}
                {realEstate.region ? ` — ${realEstate.region}` : ""}
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
                  <span className="text-white font-bold text-lg">
                    {sellerInitial}
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-tight">
                  {itemUser?.username || "Seller"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {t("realEstateDetail.activeSeller")}
                </p>
              </div>
            </div>

            <button
              onClick={handleSendMessage}
              disabled={isOwnItem || realEstate.maGaday || messagingLoading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm transition-all active:scale-[0.99] ${
                isOwnItem || realEstate.maGaday
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : messagingLoading
                    ? "bg-blue-400 text-white cursor-wait"
                    : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100"
              }`}
            >
              <MessageSquare size={17} />
              {realEstate.maGaday
                ? t("realEstateDetail.itemSold")
                : messagingLoading
                  ? t("realEstateDetail.opening")
                  : t("realEstateDetail.sendMessage")}
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
                  {t("realEstateDetail.showPhone")}
                </button>
              )
            )}
          </div>

          {realEstate.maGaday && (
            <div className="bg-yellow-400 text-gray-900 font-black text-center py-4 rounded-xl shadow-sm uppercase tracking-widest">
              {t("realEstateDetail.waaLaGatay")}
            </div>
          )}

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 border-b pb-3">
              {t("realEstateDetail.propertyDetails")}
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              {realEstate.propertyType && (
                <div className="flex items-start gap-2">
                  <FaBuilding
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                    size={15}
                  />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {t("realEstateDetail.propertyTypeLabel")}
                    </span>
                    <span className="font-bold text-gray-800 capitalize">
                      {t(
                        `createRealEstate.propertyTypes.${realEstate.propertyType}`,
                        { defaultValue: realEstate.propertyType },
                      )}
                    </span>
                  </div>
                </div>
              )}

              {category && (
                <div className="flex items-start gap-2">
                  <FaHome
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                    size={15}
                  />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {t("realEstateDetail.categoryLabel")}
                    </span>
                    <span className="font-bold text-gray-800 capitalize">
                      {category}
                    </span>
                  </div>
                </div>
              )}

              {subcategory && (
                <div className="flex items-start gap-2">
                  <FaHome
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                    size={15}
                  />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {t("realEstateDetail.subcategoryLabel")}
                    </span>
                    <span className="font-bold text-gray-800 capitalize">
                      {subcategory}
                    </span>
                  </div>
                </div>
              )}

              {(realEstate.sizeSqm || realEstate.squareFeet) && (
                <div className="flex items-start gap-2">
                  <FaRulerCombined
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                    size={15}
                  />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {t("realEstateDetail.sizeSqmLabel")}
                    </span>
                    <span className="font-bold text-gray-800">
                      {realEstate.sizeSqm ?? realEstate.squareFeet}{" "}
                      {t("realEstateDetail.sqm")}
                    </span>
                  </div>
                </div>
              )}

              {realEstate.bedrooms !== undefined &&
                realEstate.bedrooms !== null && (
                  <div className="flex items-start gap-2">
                    <FaBed
                      className="text-blue-400 mt-0.5 flex-shrink-0"
                      size={15}
                    />
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase block">
                        {t("realEstateDetail.bedroomsLabel")}
                      </span>
                      <span className="font-bold text-gray-800">
                        {realEstate.bedrooms}
                      </span>
                    </div>
                  </div>
                )}

              {realEstate.bathrooms !== undefined &&
                realEstate.bathrooms !== null && (
                  <div className="flex items-start gap-2">
                    <FaBath
                      className="text-blue-400 mt-0.5 flex-shrink-0"
                      size={15}
                    />
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase block">
                        {t("realEstateDetail.bathroomsLabel")}
                      </span>
                      <span className="font-bold text-gray-800">
                        {realEstate.bathrooms}
                      </span>
                    </div>
                  </div>
                )}

              {realEstate.floor !== undefined && realEstate.floor !== null && (
                <div className="flex items-start gap-2">
                  <FaLayerGroup
                    className="text-blue-400 mt-0.5 flex-shrink-0"
                    size={15}
                  />
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase block">
                      {t("realEstateDetail.floorLabel")}
                    </span>
                    <span className="font-bold text-gray-800">
                      {realEstate.floor}
                      {realEstate.totalFloors
                        ? ` / ${realEstate.totalFloors}`
                        : ""}
                    </span>
                  </div>
                </div>
              )}

              {!realEstate.floor &&
                realEstate.totalFloors !== undefined &&
                realEstate.totalFloors !== null && (
                  <div className="flex items-start gap-2">
                    <FaLayerGroup
                      className="text-blue-400 mt-0.5 flex-shrink-0"
                      size={15}
                    />
                    <div>
                      <span className="text-[10px] font-black text-gray-400 uppercase block">
                        {t("realEstateDetail.totalFloorsLabel")}
                      </span>
                      <span className="font-bold text-gray-800">
                        {realEstate.totalFloors}
                      </span>
                    </div>
                  </div>
                )}
            </div>
          </div>

          {hasFeatures && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-3">
                {t("realEstateDetail.featuresLabel")}
              </h3>
              <div className="flex flex-wrap gap-3">
                {realEstate.furnished && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                    <FaCouch size={12} />
                    {t("realEstateDetail.furnished")}
                  </span>
                )}
                {realEstate.parking && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                    <FaCar size={12} />
                    {t("realEstateDetail.parking")}
                  </span>
                )}
                {realEstate.hasGarage && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                    <FaWarehouse size={12} />
                    {t("realEstateDetail.garage")}
                  </span>
                )}
                {realEstate.hasGarden && (
                  <span className="flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-bold border border-blue-100">
                    <FaSeedling size={12} />
                    {t("realEstateDetail.garden")}
                  </span>
                )}
              </div>
            </div>
          )}

          {amenities.length > 0 && (
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-4 border-b pb-3">
                {t("realEstateDetail.amenitiesLabel")}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {amenities.map((a) => (
                  <span
                    key={a}
                    className="flex items-center gap-2 bg-white border border-gray-100 px-3 py-2 rounded-xl text-xs font-bold text-gray-700"
                  >
                    <span className="text-blue-500">
                      {AMENITY_ICONS[a] ?? "✓"}
                    </span>
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <h2 className="text-lg font-black text-gray-700 uppercase tracking-wider border-b pb-2">
              {t("realEstateDetail.descriptionLabel")}
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm">
              <p className="whitespace-pre-line">
                {isExpanded
                  ? realEstate.description
                  : `${realEstate.description?.slice(0, 300)}${realEstate.description?.length > 300 ? "..." : ""}`}
              </p>
              {realEstate.description?.length > 300 && (
                <button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className="text-blue-600 font-bold mt-2 hover:underline text-sm"
                >
                  {isExpanded
                    ? t("realEstateDetail.showLess")
                    : t("realEstateDetail.readMore")}
                </button>
              )}
            </div>
          </div>

          <div className="mt-4 p-5 border border-gray-200 rounded-xl bg-white">
            <Link
              href={`/components/Report/${realEstate.id}`}
              className="text-red-500 text-xs font-bold uppercase tracking-widest"
            >
              {t("realEstateDetail.reportItem")}
            </Link>
          </div>
        </div>
      </div>
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-xl font-extrabold text-blue-700 truncate">
            ${Number(realEstate.price).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 truncate">{realEstate.title}</p>
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
          disabled={isOwnItem || realEstate.maGaday || messagingLoading}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-all active:scale-[0.97] flex-shrink-0 ${
            isOwnItem || realEstate.maGaday
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : messagingLoading
                ? "bg-blue-400 text-white cursor-wait"
                : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
          }`}
        >
          <MessageSquare size={16} />
          {realEstate.maGaday
            ? t("realEstateDetail.sold")
            : messagingLoading
              ? t("realEstateDetail.opening")
              : t("realEstateDetail.sendMessage")}
        </button>
      </div>
      {showModal && (
        <SaveFavoriteModel
          onConfirm={handleModalConfirm}
          onCancel={() => setShowModal(false)}
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
          title={realEstate.title}
        />
      )}
      <Recommendations
        userId={currentUser?.id}
        excludeId={realEstate?.id}
        category={
          realEstate?.mainCategory ?? realEstate?.category?.[0] ?? undefined
        }
        limit={4}
      />
    </div>
  );
}

export default RealEstateDetails;
