import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import {
  adminOnly,
} from "../middleware/role.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  submitVerificationSchema,
  reviewVerificationSchema,
} from "../validators/verification.validator.js";

import {
  submit,
  getMine,
  getPending,
  review,
} from "../controllers/verification.controller.js";

const router =
  express.Router();

// ==========================================
// USER ROUTES
// ==========================================

router.post(
  "/",
  authenticate,
  validate(
    submitVerificationSchema
  ),
  asyncHandler(submit)
);

router.get(
  "/mine",
  authenticate,
  asyncHandler(getMine)
);

// ==========================================
// ADMIN ROUTES
// ==========================================

router.get(
  "/pending",
  authenticate,
  adminOnly,
  asyncHandler(getPending)
);

router.patch(
  "/:id/review",
  authenticate,
  adminOnly,
  validate(
    reviewVerificationSchema
  ),
  asyncHandler(review)
);

export default router;

