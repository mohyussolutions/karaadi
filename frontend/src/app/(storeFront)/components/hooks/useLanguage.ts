"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const handleClick = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const changeLanguage = (code: string) => {
    const lowerCode = code.toLowerCase();
    i18n.changeLanguage(lowerCode);
    document.cookie = `NEXT_LOCALE=${lowerCode}; path=/; max-age=31536000`;
    localStorage.setItem("i18nextLng", lowerCode);
    setIsOpen(false);
  };

  const activeLanguage = mounted
    ? (i18n.language || "en").substring(0, 2).toUpperCase()
    : "EN";

  return {
    isOpen,
    containerRef,
    activeLanguage,
    toggleDropdown,
    changeLanguage,
  };
};
