import express from "express";
import authenticate from "../middleware/auth.middleware.js";

import {
  request,
  mine,
  suggestions,
  accept,
  reject,
  remove,
} from "../controllers/connection.controller.js";

const router = express.Router();

router.get(
  "/",
  authenticate,
  mine
);

router.get(
  "/suggestions",
  authenticate,
  suggestions
);

router.post(
  "/:userId",
  authenticate,
  request
);

router.patch(
  "/:id/accept",
  authenticate,
  accept
);

router.patch(
  "/:id/reject",
  authenticate,
  reject
);

router.delete(
  "/:id",
  authenticate,
  remove
);

export default router;