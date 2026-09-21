import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createAthleteVideoSchema,
  updateAthleteVideoSchema,
} from "../validators/athleteVideo.validator.js";

import {
  create,
  getMine,
  getPublic,
  update,
  remove,
  view,
} from "../controllers/athleteVideo.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createAthleteVideoSchema),
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
  validate(updateAthleteVideoSchema),
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

router.post(
  "/:id/view",
  asyncHandler(view)
);

export default router;

