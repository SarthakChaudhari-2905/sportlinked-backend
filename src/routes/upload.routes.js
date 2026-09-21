import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middleware/auth.middleware.js";
import uploadMiddleware from "../middleware/upload.middleware.js";

import { upload } from "../controllers/upload.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  uploadMiddleware.single("file"),
  asyncHandler(upload)
);

export default router;

