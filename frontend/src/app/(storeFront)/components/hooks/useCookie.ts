"use client";

import { useState, useEffect } from "react";

export function useCookie(name: string): string | null {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const getCookie = (cookieName: string) => {
      const match = document.cookie.match(
        new RegExp("(^| )" + cookieName + "=([^;]+)"),
      );
      return match ? decodeURIComponent(match[2]) : null;
    };
    setValue(getCookie(name));
  }, [name]);

  return value;
}
