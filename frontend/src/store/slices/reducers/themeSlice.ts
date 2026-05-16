import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

export type ThemeMode = "light" | "dark";

interface ThemeState {
  mode: ThemeMode;
}

const THEME_KEY = "dashboard-theme";

const getInitialTheme = (): ThemeMode => {
  if (typeof window === "undefined") return "light";
  const saved = Cookies.get(THEME_KEY);
  if (saved === "light" || saved === "dark") return saved;
  return "light";
};

const themeSlice = createSlice({
  name: "theme",
  initialState: (): ThemeState => ({ mode: getInitialTheme() }),
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
      Cookies.set(THEME_KEY, state.mode, { expires: 365 });
    },
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      Cookies.set(THEME_KEY, action.payload, { expires: 365 });
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
