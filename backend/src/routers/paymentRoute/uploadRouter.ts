import path from "path";
import express, { Request, Response } from "express";
import multer, { StorageEngine } from "multer";
import fs from "fs";

const ensureDirectoryExists = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const storage: StorageEngine = multer.diskStorage({
  destination(req, file, cb) {
    const dir = process.env.NODE_ENV === "production" ? "" : "imagesStore/";
    if (dir) {
      ensureDirectoryExists(dir);
    }
    cb(null, dir || ".");
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function fileFilter(req: Request, file: Express.Multer.File, cb: Function) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, and WEBP formats are allowed."), false);
  }
}

export const createUpload = () => {
  return multer({ storage, fileFilter });
};

const uploadRouter = express.Router();
const upload = createUpload();
const uploadSingleImage = upload.single("image");

uploadRouter.post("/", (req: Request, res: Response) => {
  uploadSingleImage(req, res, (err: unknown) => {
    if (err) {
      return res.status(400).json({
        error: "File upload failed.",
        message: err instanceof Error ? err.message : err,
      });
    }
    if (!req.file) {
      return res.status(400).json({ error: "No file provided." });
    }
    res.status(200).json({
      message: "File uploaded successfully.",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        mimetype: req.file.mimetype,
      },
    });
  });
});

export default uploadRouter;
