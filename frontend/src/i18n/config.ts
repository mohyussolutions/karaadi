import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import so from "./locales/so.json";

const i18nInstance = i18n.use(LanguageDetector).use(initReactI18next);

i18nInstance.init({
  resources: {
    en: { translation: en },
    so: { translation: so },
  },

  lng: "en",
  fallbackLng: "en",
  supportedLngs: ["en", "so"],
  debug: false,
  detection: {
    order: ["cookie", "localStorage", "navigator"],
    lookupCookie: "NEXT_LOCALE",
    caches: ["cookie"],
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18nInstance;
