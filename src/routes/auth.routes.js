import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
} from "../controllers/auth.controller.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = express.Router();

// ==========================================
// PUBLIC AUTH ROUTES
// ==========================================

router.post(
  "/register",
  validate(registerSchema),
  asyncHandler(register)
);

router.post(
  "/login",
  validate(loginSchema),
  asyncHandler(login)
);

router.post(
  "/refresh",
  asyncHandler(refresh)
);

router.post(
  "/logout",
  asyncHandler(logout)
);

// ==========================================
// PROTECTED AUTH ROUTES
// ==========================================

router.get(
  "/me",
  authenticate,
  asyncHandler(getCurrentUser)
);

export default router;

