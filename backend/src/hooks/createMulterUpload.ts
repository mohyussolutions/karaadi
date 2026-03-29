import multer from "multer";

export function createMulterUpload(options = {}) {
  return multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 },
    ...options,
  });
}
