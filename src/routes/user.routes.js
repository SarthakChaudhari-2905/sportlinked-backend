import express from "express";

import asyncHandler from "../utils/asyncHandler.js";
import authenticate from "../middleware/auth.middleware.js";

import { updateMe } from "../controllers/user.controller.js";

const router = express.Router();

router.patch(
  "/me",
  authenticate,
  asyncHandler(updateMe)
);

export default router;

