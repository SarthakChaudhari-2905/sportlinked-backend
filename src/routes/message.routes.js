import express from "express";

import authenticate from "../middleware/auth.middleware.js";

import {
  createConversation,
  mine,
  messages,
  send,
  read,
} from "../controllers/message.controller.js";

const router =
  express.Router();

router.post(
  "/conversations",
  authenticate,
  createConversation
);

router.get(
  "/conversations",
  authenticate,
  mine
);

router.get(
  "/conversations/:id/messages",
  authenticate,
  messages
);

router.post(
  "/conversations/:id/messages",
  authenticate,
  send
);

router.patch(
  "/conversations/:id/read",
  authenticate,
  read
);

export default router;