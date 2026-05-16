import path from "path";
import express, { Request, Response } from "express";
import multer from "multer";
import fs from "fs";
import {
  IMAGE_MAX_COUNT,
  IMAGE_MAX_FILE_SIZE_BYTES,
  IMAGE_ALLOWED_MIME,
  IMAGE_ALLOWED_EXT,
} from "src/config/constants/image.constants.ts";

function ensureDir(dirPath: string) {
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination(_req, _file, cb) {
    const dir = process.env.NODE_ENV === "production" ? "" : "imagesStore/";
    if (dir) ensureDir(dir);
    cb(null, dir || ".");
  },
  filename(_req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

function fileFilter(_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) {
  const extOk = IMAGE_ALLOWED_EXT.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = IMAGE_ALLOWED_MIME.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP formats are allowed."));
  }
}

export const createUpload = () =>
  multer({
    storage,
    fileFilter,
    limits: { fileSize: IMAGE_MAX_FILE_SIZE_BYTES, files: IMAGE_MAX_COUNT },
  });

const uploadRouter = express.Router();
const upload = createUpload();

uploadRouter.post("/", (req: Request, res: Response) => {
  upload.single("image")(req, res, (err: unknown) => {
    if (err) {
      return res.status(400).json({
        error: "File upload failed.",
        message: err instanceof Error ? err.message : String(err),
      });
    }
    if (!req.file) return res.status(400).json({ error: "No file provided." });
    res.status(200).json({
      message: "File uploaded successfully.",
      file: { filename: req.file.filename, path: req.file.path, mimetype: req.file.mimetype },
    });
  });
});

export default uploadRouter;
