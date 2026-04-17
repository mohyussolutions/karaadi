"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import i18n from "i18next";
import { RootState } from "@/store/store";

export default function LanguageSync() {
  const language = useSelector(
    (state: RootState) => state.language.currentLanguage,
  );

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }

    if (typeof document !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  return null;
}
