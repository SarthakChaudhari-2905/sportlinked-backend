import express from "express";
import Notification from "../models/Notification.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1
  });
  res.json(notifications);
});

router.post("/", auth, async (req, res) => {
  const note = await Notification.create({
    user: req.user._id,
    type: req.body.type || "info",
    message: req.body.message
  });
  res.status(201).json(note);
});

router.post("/:id/read", auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { read: true });
  res.json({ message: "Marked as read" });
});

export default router;

