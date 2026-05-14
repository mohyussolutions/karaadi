import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en";
import so from "./locales/so";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    so: { translation: so },
  },
  lng: "so",
  fallbackLng: "so",
  supportedLngs: ["en", "so"],
  debug: false,
  saveMissing: false,
  initImmediate: false,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
