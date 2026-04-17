"use client";

import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import {
  setLanguage,
  toggleLanguage,
} from "@/store/slices/reducers/languageSlice";
import type { LanguageCode } from "@/app/utils/types/language.types";

export const useLanguage = () => {
  const dispatch = useDispatch();
  const language = useSelector(
    (state: RootState) => state.language.currentLanguage,
  );
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (code: string) => {
    if (code === "en" || code === "so") {
      dispatch(setLanguage(code as LanguageCode));
    }
  };

  const handleToggle = () => {
    dispatch(toggleLanguage());
  };

  return {
    language,
    activeLanguage: language,
    setLanguage: changeLanguage,
    toggleLanguage: handleToggle,
    isOpen,
    setIsOpen,
    containerRef,
  };
};
