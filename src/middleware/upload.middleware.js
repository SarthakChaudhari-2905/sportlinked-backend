import fs from "fs";
import path from "path";
import crypto from "crypto";
import multer from "multer";
import env from "../config/env.js";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

const ALLOWED_FOLDERS = [
  "avatars",
  "organizations",
  "events",
  "certificates",
  "videos",
  "general",
];

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
  "video/mp4",
  "video/quicktime",
  "video/webm",
];

const resolveFolder = (req) => {
  const requested = (req.body?.folder || "general").toLowerCase();
  return ALLOWED_FOLDERS.includes(requested) ? requested : "general";
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = resolveFolder(req);
    const dest = path.join(UPLOAD_ROOT, folder);

    fs.mkdirSync(dest, { recursive: true });

    cb(null, dest);
  },

  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const unique = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
    cb(null, unique);
  },
});

const fileFilter = (req, file, cb) => {
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    const error = new Error(
      `File type "${file.mimetype}" is not allowed`
    );
    error.statusCode = 400;
    return cb(error);
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: env.maxFileSizeMb * 1024 * 1024,
  },
});

export { UPLOAD_ROOT };
export default upload;

