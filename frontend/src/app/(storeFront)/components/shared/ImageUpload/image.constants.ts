export const IMAGE_MAX_COUNT = 10;
export const IMAGE_MIN_COUNT = 2;
export const IMAGE_MAX_FILE_SIZE_MB = 15;
export const IMAGE_MAX_FILE_SIZE_BYTES = IMAGE_MAX_FILE_SIZE_MB * 1024 * 1024;
export const IMAGE_MAX_SAFE_CHARS = 4_000_000;
export const IMAGE_OUTPUT_FORMAT = "image/jpeg";
export const IMAGE_CANVAS_CONTEXT = "2d";
export const IMAGE_MIME_PREFIX = "image/";

export const IMAGE_COMPRESS_PASSES = [
  { maxPx: 1920, quality: 0.92 },
  { maxPx: 1440, quality: 0.88 },
  { maxPx: 1200, quality: 0.82 },
  { maxPx: 900, quality: 0.75 },
] as const;
