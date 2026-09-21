import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from "../validators/organization.validator.js";

import {
  create,
  getById,
  getMine,
  update,
  addOrganizationMember,
  search,
} from "../controllers/organization.controller.js";

const router =
  express.Router();

// Search/discover organizations: /api/v1/organizations?type=&sport=&city=
router.get(
  "/",
  asyncHandler(search)
);

router.post(
  "/",
  authenticate,
  validate(createOrganizationSchema),
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
  validate(updateOrganizationSchema),
  asyncHandler(update)
);

router.post(
  "/:id/members",
  authenticate,
  asyncHandler(addOrganizationMember)
);

router.get(
  "/:id",
  asyncHandler(getById)
);

export default router;

