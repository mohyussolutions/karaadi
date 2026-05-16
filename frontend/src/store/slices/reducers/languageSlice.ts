import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import type {
  LanguageCode,
  LanguageState,
} from "@/app/utils/types/language.types";

export type { LanguageState };

const COOKIE_NAME = "app_lang";
const COOKIE_EXPIRY = 365;

const getSavedLanguage = (): LanguageCode => {
  if (typeof window === "undefined") return "so";
  const saved = Cookies.get(COOKIE_NAME);
  if (saved === "en" || saved === "so") return saved;
  return "so";
};

const initialState: LanguageState = {
  currentLanguage: getSavedLanguage(),
};

export const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.currentLanguage = action.payload;
      if (typeof window !== "undefined") {
        Cookies.set(COOKIE_NAME, action.payload, { expires: COOKIE_EXPIRY });
      }
    },
    toggleLanguage: (state) => {
      const newLang = state.currentLanguage === "en" ? "so" : "en";
      state.currentLanguage = newLang;
      if (typeof window !== "undefined") {
        Cookies.set(COOKIE_NAME, newLang, { expires: COOKIE_EXPIRY });
        localStorage.setItem(COOKIE_NAME, newLang);
      }
    },
    hydrateLanguage: (state, action: PayloadAction<LanguageCode>) => {
      state.currentLanguage = action.payload;
    },
  },
});

export const { setLanguage, toggleLanguage, hydrateLanguage } =
  languageSlice.actions;
export default languageSlice.reducer;
