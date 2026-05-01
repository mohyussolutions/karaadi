"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/store/slices/hooks/hooks";

export default function ThemeApplier() {
  const mode = useAppSelector((s) => s.theme.mode);

  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [mode]);

  return null;
}
