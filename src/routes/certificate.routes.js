import express from "express";

import asyncHandler from "../utils/asyncHandler.js";

import authenticate from "../middleware/auth.middleware.js";

import validate from "../middleware/validate.middleware.js";

import {
  createCertificateSchema,
  updateCertificateSchema,
} from "../validators/certificate.validator.js";

import {
  create,
  getMine,
  getPublic,
  update,
  remove,
} from "../controllers/certificate.controller.js";

const router = express.Router();

router.post(
  "/",
  authenticate,
  validate(createCertificateSchema),
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
  validate(updateCertificateSchema),
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

