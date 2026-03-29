"use client";

import { GrLanguage } from "react-icons/gr";
import { LANGUAGES } from "@/actions/constant/languages";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

export default function Lang() {
  const {
    isOpen,
    containerRef,
    activeLanguage,
    toggleDropdown,
    changeLanguage,
  } = useLanguage();

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={toggleDropdown}
        className="flex items-center gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl bg-green-800 border border-green-900 text-white font-black text-[10px] sm:text-xs uppercase shadow-sm transition-all active:scale-95 hover:bg-green-700"
      >
        <GrLanguage className="text-sm sm:text-base text-white" />
        <span>{activeLanguage}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-36 sm:w-40 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => changeLanguage(lang.code)}
              className={`w-full px-4 sm:px-5 py-3 sm:py-4 text-left text-[10px] sm:text-[11px] font-black tracking-widest transition-colors border-b last:border-0 border-gray-50 text-black ${
                activeLanguage === lang.code.toUpperCase()
                  ? "bg-green-50 text-green-800"
                  : "hover:bg-gray-50"
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
