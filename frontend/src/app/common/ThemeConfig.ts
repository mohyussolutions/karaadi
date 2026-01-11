import { ColorPalette } from "../utils/types/ThemeConfig";

export const APP_COLOR_PALETTE: ColorPalette = {
  primary: "#4A90E2",
  secondary: "#FF5733",
  background: "#F8F9FA",
  text: "#212529",
  success: "#28A745",
  error: "#DC3545",
};

export function initializeTheme() {
  if (typeof window !== "undefined") {
    document.documentElement.style.setProperty(
      "--color-primary",
      APP_COLOR_PALETTE.primary
    );
  }
  document.documentElement.style.setProperty(
    "--color-secondary",
    APP_COLOR_PALETTE.secondary
  );
  document.documentElement.style.setProperty(
    "--color-background",
    APP_COLOR_PALETTE.background
  );
  document.documentElement.style.setProperty(
    "--color-text",
    APP_COLOR_PALETTE.text
  );
}
