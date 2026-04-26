import { z } from "zod";

export const LIMITS = {
  TITLE: 200,
  DESCRIPTION: 5000,
  SHORT: 100,
  URL: 2000,
  PRICE_MAX: 100_000_000,
  IMAGE_BYTES: 2_097_152,
  IMAGES_COUNT: 10,
} as const;

const STRIP_TAGS = /<[^>]*>/g;
const NULL_BYTES = /\0/g;
const SCRIPT_LIKE = /javascript:|vbscript:|data:text|on\w+\s*=/gi;

export function strip(value: string): string {
  return value
    .replace(NULL_BYTES, "")
    .replace(STRIP_TAGS, "")
    .replace(SCRIPT_LIKE, "")
    .trim();
}

export const title = z
  .string()
  .min(2, "Title must be at least 2 characters")
  .max(LIMITS.TITLE, `Title must be at most ${LIMITS.TITLE} characters`)
  .transform(strip);

export const description = z
  .string()
  .min(5, "Description must be at least 5 characters")
  .max(LIMITS.DESCRIPTION, `Description must be at most ${LIMITS.DESCRIPTION} characters`)
  .transform(strip);

export const shortStr = (label = "Field") =>
  z
    .string()
    .min(1, `${label} is required`)
    .max(LIMITS.SHORT, `${label} must be at most ${LIMITS.SHORT} characters`)
    .transform(strip);

export const optShortStr = () =>
  z
    .string()
    .max(LIMITS.SHORT)
    .transform(strip)
    .optional();

export const price = (min = 0) =>
  z
    .number()
    .min(min, "Price must be non-negative")
    .max(LIMITS.PRICE_MAX, "Price exceeds the allowed maximum");

export const safeImage = z
  .string()
  .max(LIMITS.IMAGE_BYTES, "Image exceeds 2 MB limit")
  .refine(
    (v) =>
      v.startsWith("data:image/jpeg") ||
      v.startsWith("data:image/png") ||
      v.startsWith("data:image/webp") ||
      v.startsWith("data:image/gif") ||
      /^https?:\/\//.test(v),
    "Invalid image format — only JPEG, PNG, WebP, GIF or HTTPS URLs are allowed",
  );

export const images = z.array(safeImage).max(LIMITS.IMAGES_COUNT, "Maximum 10 images allowed");
