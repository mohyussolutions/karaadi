export const IMAGE_MAX_COUNT = 10;
export const IMAGE_MIN_COUNT = 2;
export const IMAGE_MAX_FILE_SIZE_MB = 15;
export const IMAGE_MAX_SAFE_CHARS = 1_500_000;

export const IMAGE_COMPRESS_PASSES = [
  { maxPx: 1200, quality: 0.82 },
  { maxPx: 900, quality: 0.72 },
  { maxPx: 700, quality: 0.65 },
] as const;
