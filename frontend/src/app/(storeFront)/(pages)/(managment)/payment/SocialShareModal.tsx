"use client";

import { postToTikTok } from "@/actions/categories/socialPostAction";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaFacebook, FaTiktok, FaCheckCircle } from "react-icons/fa";

interface Props {
  itemId: string;
  itemTitle: string;
  itemDescription?: string;
  itemPrice: string | number;
  itemImageUrl?: string;
  itemCategory?: string;
  listingUrl: string;
  onDone: () => void;
}

export default function SocialShareModal({
  itemId,
  itemTitle,
  itemDescription = "",
  itemPrice,
  itemImageUrl,
  itemCategory,
  listingUrl,
  onDone,
}: Props) {
  const { t } = useTranslation();
  const [tiktok, setTiktok] = useState(false);
  const [queued, setQueued] = useState(false);

  const handlePost = () => {
    if (!tiktok) {
      onDone();
      return;
    }

    setQueued(true);

    const payload = {
      title: itemTitle,
      description: itemDescription,
      price: itemPrice,
      imageUrl: itemImageUrl,
      listingUrl: listingUrl,
      category: itemCategory,
    };

    postToTikTok(payload);
    onDone();
  };

  if (queued) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center">
          <FaCheckCircle className="mx-auto text-green-500 mb-3" size={48} />
          <p className="font-black text-xl text-green-600">
            {t("social.queued", "Posted!")}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "social.queuedDesc",
              "Your listing has been shared on our accounts.",
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-6">
          <p className="text-4xl mb-3">🚀</p>
          <h2 className="text-xl font-black text-gray-900">
            {t("social.title", "Boost your listing!")}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {t(
              "social.subtitle",
              "Share on our official social accounts for free?",
            )}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-blue-100 bg-blue-50 text-blue-700">
            <FaFacebook size={20} className="text-blue-600" />
            <span className="font-bold flex-1">
              {t("social.facebookAuto", "Posted to Facebook automatically")}
            </span>
            <FaCheckCircle className="text-blue-500" size={18} />
          </div>

          <button
            type="button"
            onClick={() => setTiktok((v) => !v)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all ${
              tiktok
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            <FaTiktok size={20} />
            <span>{t("social.postTiktok", "Post to TikTok")}</span>
            {tiktok && <FaCheckCircle className="ml-auto" size={18} />}
          </button>
        </div>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onDone}
            className="flex-1 py-3 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition"
          >
            {t("common.skip", "Skip")}
          </button>
          <button
            type="button"
            onClick={handlePost}
            className="flex-1 py-3 bg-[#0063fb] text-white rounded-2xl font-black hover:bg-blue-700 transition"
          >
            {tiktok
              ? t("social.post", "Post!")
              : t("common.continue", "Continue")}
          </button>
        </div>
      </div>
    </div>
  );
}
