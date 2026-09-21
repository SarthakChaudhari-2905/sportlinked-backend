import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

import {
  create,
  publish,
  getById,
  getOrganizationEvents,
  update,
  remove,
  browse,
} from "../controllers/event.controller.js";

const router =
  express.Router();

// Browse/discover published events: /api/v1/events?sport=&type=&city=&status=
router.get(
  "/",
  asyncHandler(browse)
);

router.post(
  "/",
  authenticate,
  validate(createEventSchema),
  asyncHandler(create)
);

router.get(
  "/organization/:organizationId",
  authenticate,
  asyncHandler(getOrganizationEvents)
);

router.patch(
  "/:id",
  authenticate,
  validate(updateEventSchema),
  asyncHandler(update)
);

router.post(
  "/:id/publish",
  authenticate,
  asyncHandler(publish)
);

router.delete(
  "/:id",
  authenticate,
  asyncHandler(remove)
);

router.get(
  "/:id",
  asyncHandler(getById)
);

export default router;

