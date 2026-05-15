"use client";

import { useEffect } from "react";

export default function StoreFrontThemeReset() {
  useEffect(() => {
    document.documentElement.classList.remove("dark");
    document.body.style.backgroundColor = "#FEFDFD";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return null;
}
