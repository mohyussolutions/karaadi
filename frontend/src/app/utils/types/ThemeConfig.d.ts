export type ColorKey =
  | "primary"
  | "secondary"
  | "background"
  | "text"
  | "success"
  | "error";
export type ColorValue = string;

export interface ColorPalette {
  primary: ColorValue;
  secondary: ColorValue;
  background: ColorValue;
  text: ColorValue;
  success: ColorValue;
  error: ColorValue;
  [key: string]: ColorValue;
}
