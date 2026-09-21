import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const sign = (user) =>
  jwt.sign({ id: user._id }, process.env.JWT_SECRET || "devsecret", {
    expiresIn: "7d"
  });

router.post("/signup", async (req, res) => {
  const { name, email, password, sport, position } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ message: "Name, email, password required" });
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already registered" });
  const user = await User.create({ name, email, password, sport, position });
  const token = sign(user);
  res.json({ token, user });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });
  const match = await user.comparePassword(password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });
  const token = sign(user);
  res.json({ token, user });
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email required" });
  // In production we'd email a reset token; here we acknowledge the request.
  res.json({ message: "If the account exists, a reset link has been sent." });
});

router.get("/me", auth, async (req, res) => {
  res.json(req.user);
});

export default router;

