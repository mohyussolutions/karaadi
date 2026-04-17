"use client";

import { GrLanguage } from "@/app/utils/icons";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { LANGUAGES } from "@/actions/common/languages";
import { useTranslation } from "react-i18next";

export default function Lang() {
  const { isOpen, setIsOpen, containerRef, language, setLanguage } =
    useLanguage();
  const { i18n } = useTranslation();
  const displayLang = i18n.language?.toUpperCase() || language?.toUpperCase();
  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-[#06069C] text-white font-black text-[10px] sm:text-xs uppercase transition-all active:scale-95"
      >
        <GrLanguage className="text-sm sm:text-base text-white shrink-0" />
        <span className="hidden sm:inline">
          {displayLang}
        </span>
      </button>
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 sm:w-40 bg-white rounded-2xl shadow-2xl border border-[#E8E8E8] z-50 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-[11px] font-black tracking-widest transition-colors border-b last:border-0 border-[#E8E8E8] text-black ${
                language === lang.code
                  ? "bg-[#F4F4F4] text-[#06069C]"
                  : "hover:bg-[#F4F4F4]"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
