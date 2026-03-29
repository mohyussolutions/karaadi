"use client";

import { useEffect } from "react";
import i18n from "i18next";
import { initReactI18next, I18nextProvider } from "react-i18next";
import en from "@/i18n/locales/en.json";
import so from "@/i18n/locales/so.json";

if (typeof window !== "undefined" && !i18n.isInitialized) {
  const initialLocale = (() => {
    try {
      const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
      if (match?.[1]) return match[1];
    } catch {}
    return (navigator.language && navigator.language.substring(0, 2)) || "en";
  })();

  try {
    i18n.use(initReactI18next).init({
      resources: {
        en: { translation: en },
        so: { translation: so },
      },
      lng: initialLocale,
      fallbackLng: "en",
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
      initImmediate: false,
    });
  } catch (e) {}
}

export default function ClientI18nProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!i18n.isInitialized && typeof window !== "undefined") {
      try {
        const initialLocale = (() => {
          try {
            const match = document.cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
            if (match?.[1]) return match[1];
          } catch {}
          return (
            (navigator.language && navigator.language.substring(0, 2)) || "en"
          );
        })();

        i18n.use(initReactI18next).init({
          resources: { en: { translation: en }, so: { translation: so } },
          lng: initialLocale,
          fallbackLng: "en",
          interpolation: { escapeValue: false },
          react: { useSuspense: false },
          initImmediate: false,
        });
      } catch (e) {}
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
