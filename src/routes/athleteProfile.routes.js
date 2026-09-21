import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createAthleteProfileSchema,
  updateAthleteProfileSchema,
} from "../validators/athleteProfile.validator.js";

import {
  create,
  getMine,
  update,
  getPublic,
  search,
} from "../controllers/athleteProfile.controller.js";

const router =
  express.Router();

// ==========================================
// PROTECTED
// ==========================================

router.post(
  "/",
  authenticate,
  validate(
    createAthleteProfileSchema
  ),
  asyncHandler(create)
);

router.get(
  "/me",
  authenticate,
  asyncHandler(getMine)
);

router.patch(
  "/me",
  authenticate,
  validate(
    updateAthleteProfileSchema
  ),
  asyncHandler(update)
);

// ==========================================
// PUBLIC
// ==========================================

// Search/discover athletes: /api/v1/athletes?sport=&level=&city=
router.get(
  "/",
  authenticate,
  asyncHandler(search)
);

router.get(
  "/:userId",
  asyncHandler(getPublic)
);

export default router;

