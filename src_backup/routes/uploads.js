import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { auth } from "../middleware/auth.js";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = process.env.UPLOAD_DIR
  ? path.isAbsolute(process.env.UPLOAD_DIR)
    ? process.env.UPLOAD_DIR
    : path.join(__dirname, "..", "..", process.env.UPLOAD_DIR)
  : path.join(__dirname, "..", "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (_req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post("/", auth, upload.single("media"), (req, res) => {
  const url = `${process.env.API_URL || "http://localhost:5000"}/uploads/${req.file.filename}`;
  res.status(201).json({ url });
});

export default router;

