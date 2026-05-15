"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import useSWR from "swr";
import { useTranslation } from "react-i18next";
import { useRouter, useParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FaBuilding,
  FaBriefcase,
  FaPaperPlane,
  FaMapMarkerAlt,
  IoIosArrowBack,
  IoIosArrowForward,
} from "@/app/utils/icons";
import { getJobById, formatSalary, type Job as BaseJob } from "@/actions/categories/jobActions";

type Job = BaseJob & { employmentType?: string; userId?: string };
import { addToFavorite } from "@/actions/categories/favoriteAction";
import GoBackBtn from "@/app/(storeFront)/components/shared/buttons/goBackBtn";
import SaveFavoriteModel from "@/app/(storeFront)/components/shared/modals/Modal";
import { ImageControls } from "@/app/ui/invoices/ImageControls";
import dynamic from "next/dynamic";
const Recommendations = dynamic(() => import("@/app/(storeFront)/components/Recommendations/Recommendations"), { ssr: false });
import { useAuth } from "@/context/AuthContext";
import { BASE_API_URL } from "@/actions/constant/BASE_API_URL";

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

interface Props {
  initialData?: Job | null;
}

export default function JobDetailsContent({ initialData }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const id = params?.id as string;

  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: jobData, isLoading: loading } = useSWR(
    id ? `job-${id}` : null,
    () => getJobById(id),
    {
      fallbackData: initialData ?? undefined,
      revalidateOnFocus: false,
      revalidateIfStale: false,
      dedupingInterval: 60_000,
    },
  );
  const job = (jobData as Job) ?? null;
  const [formattedSalary, setFormattedSalary] = useState<string>("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem("userEmail") || "";
    setUserEmail(email);
  }, []);

  useEffect(() => {
    if (!job?.salary) return;
    formatSalary(job.salary).then(setFormattedSalary).catch(() => {});
  }, [job?.salary]);

  const images = useMemo(() => {
    const rawImages: string[] = [];
    if (job?.companyLogo) rawImages.push(job.companyLogo);
    if (job?.images?.length) rawImages.push(...job.images);
    return rawImages
      .map((u) => resolveImageUrl(u))
      .filter((u): u is string => u !== null);
  }, [job]);

  const handleApplyClick = useCallback(() => {
    const email = userEmail || localStorage.getItem("userEmail") || "";
    const baseUrl = `/jobs/application/${id}`;
    const url = email ? `${baseUrl}?email=${encodeURIComponent(email)}` : baseUrl;
    router.push(url);
  }, [userEmail, id, router]);

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

  const handleModalConfirm = useCallback(async () => {
    if (!job) return;
    try {
      const response: any = await addToFavorite({
        title: job.title,
        description: job.description,
        price: job.salary ? String(job.salary) : "0",
        image: images[0] || "",
        itemId: job._id || job.id || "",
        category: "Jobs",
      });
      setShowModal(false);
      if (!response?.error) router.push("/mine/favorites");
    } catch {
      setShowModal(false);
    }
  }, [job, images, router]);

  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto" />
          <p className="mt-4 text-gray-600 font-medium">{t("jobsPage.loading")}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-gray-100 text-center">
          <FaBriefcase className="mx-auto text-gray-300 mb-4" size={48} />
          <p className="text-gray-600 mb-6">{t("jobsPage.backLabel") || "Job not found"}</p>
          <button
            onClick={() => router.push("/jobs")}
            className="text-blue-600 hover:text-blue-800 font-bold underline"
          >
            {t("jobsPage.backToAll")}
          </button>
        </div>
      </div>
    );
  }

  const jobId = job._id || job.id || "";
  const currentImage = images[selectedImageIndex] ?? null;
  const description = job.description || "";
  const shouldTruncate = description.length > 300;

  const poster: any = job.user;
  const posterName =
    poster && typeof poster === "object"
      ? poster.username || poster.name || "Employer"
      : "Employer";
  const posterAvatar =
    poster && typeof poster === "object" ? poster.profileImage || null : null;
  const posterInitial = posterName.charAt(0).toUpperCase();
  const locationLabel =
    [job.city, job.region].filter(Boolean).join(", ") || job.location || "";

  return (
    <div className="my-12 px-4 md:px-6 min-h-screen max-w-7xl mx-auto pb-24 md:pb-0">
      <div className="mb-5 font-mono text-sm flex items-center gap-1 flex-wrap text-gray-400">
        <span className="text-blue-600 font-bold capitalize">Jobs</span>
        {job.company && (
          <>
            <span>/</span>
            <span className="capitalize">{job.company}</span>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start min-w-0">
        <div className="space-y-4 min-w-0">
          <div className="relative">
            <div className="w-full relative bg-gray-100 rounded-2xl overflow-hidden shadow-sm h-[400px] md:h-[560px]">
              {currentImage ? (
                <Image
                  src={currentImage}
                  alt={job.company || job.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                  <FaBuilding size={80} className="text-blue-200" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                    aria-label="Previous image"
                  >
                    <IoIosArrowBack className="w-5 h-5 text-white" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 p-3 rounded-full hover:bg-black/60 transition z-10"
                    aria-label="Next image"
                  >
                    <IoIosArrowForward className="w-5 h-5 text-white" />
                  </button>
                </>
              )}
            </div>
            <ImageControls
              onHeartClick={handleHeartClick}
              onZoomClick={handleZoomOpen}
            />
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto py-1 scrollbar-hide">
              {images.map((thumb, i) => (
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
          <div
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={handleZoomClose}
          >
            <div
              className="relative w-full max-w-5xl max-h-[90vh] m-4 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="text-white/70 text-sm font-medium">
                  {selectedImageIndex + 1} / {images.length}
                </span>
                <button
                  onClick={handleZoomClose}
                  className="text-white bg-white/10 hover:bg-white/25 rounded-full p-2 transition-all"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="relative flex-1 min-h-0 h-[75vh]">
                <Image
                  src={images[selectedImageIndex]}
                  alt={job.title}
                  fill
                  className="object-contain"
                  priority
                />
                {images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-all"
                      aria-label="Previous"
                    >
                      <IoIosArrowBack className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white rounded-full p-3 transition-all"
                      aria-label="Next"
                    >
                      <IoIosArrowForward className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-2 justify-center mt-3 overflow-x-auto pb-1">
                  {images.map((thumb, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`relative w-14 h-10 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${i === selectedImageIndex ? "border-white" : "border-white/20 opacity-50"}`}
                    >
                      <Image src={thumb} alt="" fill className="object-cover" sizes="56px" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="space-y-7 min-w-0 overflow-hidden">
          <div className="space-y-2">
            <GoBackBtn />
            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">
              {job.title}
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              {formattedSalary || "Negotiable"}
            </p>
            {locationLabel && (
              <p className="text-sm text-gray-500 flex items-center gap-1">
                <FaMapMarkerAlt className="text-gray-400 flex-shrink-0" size={13} />
                {locationLabel}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center overflow-hidden flex-shrink-0">
                {posterAvatar && !avatarError ? (
                  <img
                    src={posterAvatar}
                    alt={posterName}
                    className="w-full h-full object-cover"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="text-white font-bold text-lg leading-none">
                    {posterInitial}
                  </span>
                )}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-tight">
                  {posterName}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {job.company || "Company"}
                </p>
              </div>
            </div>

            <button
              onClick={handleApplyClick}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-100 transition-all active:scale-[0.99]"
            >
              <FaPaperPlane size={15} />
              Apply for this position
            </button>
          </div>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-5 border-b pb-3">
              Job Details
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {job.company && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Company</span>
                  <span className="font-bold text-gray-800">{job.company}</span>
                </div>
              )}
              {(job.employmentType || job.type) && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Job Type</span>
                  <span className="font-bold text-gray-800 capitalize">
                    {job.employmentType || job.type}
                  </span>
                </div>
              )}
              {(formattedSalary || job.salary) && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Salary</span>
                  <span className="font-bold text-gray-800">
                    {formattedSalary || "Negotiable"}
                  </span>
                </div>
              )}
              {locationLabel && (
                <div>
                  <span className="text-[10px] font-black text-gray-400 uppercase block">Location</span>
                  <span className="font-bold text-gray-800">{locationLabel}</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-black text-gray-700 uppercase tracking-wider border-b pb-2">
              {t("jobsPage.jobDescription") || "Description"}
            </h2>
            <div className="text-sm text-gray-700 leading-relaxed break-words">
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
              href={`/components/Report/${jobId}`}
              className="text-red-500 text-xs font-bold uppercase tracking-widest"
            >
              Report this listing
            </Link>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-lg">
        <div className="flex-1 min-w-0">
          <p className="text-xl font-extrabold text-blue-700 truncate">
            {formattedSalary || "Negotiable"}
          </p>
          <p className="text-xs text-gray-500 truncate">{job.title}</p>
        </div>
        <button
          onClick={handleApplyClick}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 transition-all active:scale-[0.97] flex-shrink-0"
        >
          <FaPaperPlane size={15} />
          Apply
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
        excludeId={jobId}
        category="jobs"
        limit={4}
      />
    </div>
  );
}
