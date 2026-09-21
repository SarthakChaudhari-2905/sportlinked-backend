import express from "express";
import Reel from "../models/Reel.js";
import Comment from "../models/Comment.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const reels = await Reel.find({})
    .populate("author", "name")
    .sort({ createdAt: -1 })
    .limit(30);
  res.json(reels);
});

router.post("/", auth, async (req, res) => {
  const { caption, videoUrl, tags } = req.body;
  const reel = await Reel.create({
    author: req.user._id,
    caption,
    videoUrl,
    tags
  });
  res.status(201).json(reel);
});

router.post("/:id/boost", auth, async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) return res.status(404).json({ message: "Reel not found" });
  if (!reel.boosts.includes(req.user._id)) reel.boosts.push(req.user._id);
  await reel.save();
  res.json(reel);
});

router.post("/:id/comments", auth, async (req, res) => {
  const reel = await Reel.findById(req.params.id);
  if (!reel) return res.status(404).json({ message: "Reel not found" });
  const comment = await Comment.create({
    author: req.user._id,
    reel: reel._id,
    content: req.body.content
  });
  reel.comments.push(comment._id);
  await reel.save();
  res.json(comment);
});

export default router;

