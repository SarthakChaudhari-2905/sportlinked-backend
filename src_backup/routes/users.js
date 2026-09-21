import express from "express";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

router.post("/:id/connect", auth, async (req, res) => {
  const target = await User.findById(req.params.id);
  if (!target) return res.status(404).json({ message: "User not found" });
  if (!target.connections.includes(req.user._id)) target.connections.push(req.user._id);
  if (!req.user.connections.includes(target._id)) req.user.connections.push(target._id);
  await target.save();
  await req.user.save();
  res.json({ message: "Connection added" });
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;

