"use client"

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { FaFacebook, FaCheckCircle } from "react-icons/fa"

interface Props {
  itemId: string
  itemTitle: string
  onDone: () => void
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.73a8.26 8.26 0 0 0 4.84 1.55V6.83a4.85 4.85 0 0 1-1.07-.14z" />
    </svg>
  )
}

export default function SocialShareModal({ itemId, itemTitle, onDone }: Props) {
  const { t } = useTranslation()
  const [tiktok, setTiktok] = useState(false)
  const [facebook, setFacebook] = useState(false)
  const [posting, setPosting] = useState(false)
  const [queued, setQueued] = useState(false)

  const noneSelected = !tiktok && !facebook

  const handlePost = async () => {
    if (noneSelected) { onDone(); return }
    setPosting(true)
    try {
      await fetch("/api/social/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ itemId, itemTitle, platforms: { tiktok, facebook } }),
      })
    } catch {}
    setQueued(true)
    setTimeout(onDone, 1800)
  }

  if (queued) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] px-4">
        <div className="bg-white rounded-3xl p-10 max-w-sm w-full shadow-2xl text-center">
          <FaCheckCircle className="mx-auto text-green-500 mb-3" size={48} />
          <p className="font-black text-xl text-green-600">{t("social.queued", "Queued for posting!")}</p>
          <p className="text-sm text-gray-500 mt-1">
            {t("social.queuedDesc", "Your listing will be shared on our accounts shortly.")}
          </p>
        </div>
      </div>
    )
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
            {t("social.subtitle", "Want us to post it on our official social accounts for free?")}
          </p>
          <p className="text-xs text-blue-500 mt-1 font-medium">
            {t("social.selectBoth", "You can select both")}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <button
            type="button"
            onClick={() => setTiktok((v) => !v)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all ${
              tiktok
                ? "border-black bg-black text-white"
                : "border-gray-200 text-gray-700 hover:border-gray-400"
            }`}
          >
            <TikTokIcon />
            <span>{t("social.postTiktok", "Post to TikTok")}</span>
            {tiktok && <FaCheckCircle className="ml-auto" size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setFacebook((v) => !v)}
            className={`w-full flex items-center gap-3 p-4 rounded-2xl border-2 font-bold transition-all ${
              facebook
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-gray-200 text-gray-700 hover:border-blue-300"
            }`}
          >
            <FaFacebook size={20} />
            <span>{t("social.postFacebook", "Post to Facebook")}</span>
            {facebook && <FaCheckCircle className="ml-auto" size={18} />}
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
            disabled={posting}
            className="flex-1 py-3 bg-[#0063fb] text-white rounded-2xl font-black hover:bg-blue-700 disabled:opacity-60 transition"
          >
            {posting
              ? t("social.posting", "Posting…")
              : noneSelected
                ? t("common.continue", "Continue")
                : t("social.post", "Post!")}
          </button>
        </div>
      </div>
    </div>
  )
}
