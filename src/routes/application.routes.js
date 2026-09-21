import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";
import validate from "../middleware/validate.middleware.js";

import {
  createApplicationSchema,
  updateApplicationStatusSchema,
} from "../validators/application.validator.js";

import {
  create,
  getMine,
  getById,
  getForEvent,
  updateStatus,
  withdraw,
} from "../controllers/application.controller.js";

const router = express.Router();

/*
 * Athlete submits application
 */
router.post(
  "/",
  authenticate,
  validate(createApplicationSchema),
  asyncHandler(create)
);

/*
 * Athlete's applications
 */
router.get(
  "/mine",
  authenticate,
  asyncHandler(getMine)
);

/*
 * Organization gets applications
 * for an event
 *
 * Optional:
 * ?status=SHORTLISTED
 */
router.get(
  "/event/:eventId",
  authenticate,
  asyncHandler(getForEvent)
);

/*
 * Get single application
 */
router.get(
  "/:id",
  authenticate,
  asyncHandler(getById)
);

/*
 * Organization updates status
 */
router.patch(
  "/:id/status",
  authenticate,
  validate(updateApplicationStatusSchema),
  asyncHandler(updateStatus)
);

/*
 * Athlete withdraws
 */
router.post(
  "/:id/withdraw",
  authenticate,
  asyncHandler(withdraw)
);

export default router;

