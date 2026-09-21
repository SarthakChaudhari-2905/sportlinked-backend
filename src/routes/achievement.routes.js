import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createAchievementSchema,
  updateAchievementSchema,
} from "../validators/achievement.validator.js";

import {
  create,
  getMine,
  getPublic,
  update,
  remove,
} from "../controllers/achievement.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createAchievementSchema),
  asyncHandler(create)
);

router.get(
  "/mine",
  authenticate,
  asyncHandler(getMine)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateAchievementSchema),
  asyncHandler(update)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(remove)
);

router.get(
  "/public/:userId",
  asyncHandler(getPublic)
);

export default router;

