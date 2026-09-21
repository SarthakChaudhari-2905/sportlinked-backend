import express from "express";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Reel from "../models/Reel.js";
import Tournament from "../models/Tournament.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/feed", async (_req, res) => {
  const [postsRaw, reels, tournaments] = await Promise.all([
    Post.find({})
      .populate("author", "name sport position")
      .limit(30)
      .lean(),
    Reel.find({}).sort({ createdAt: -1 }).limit(10),
    Tournament.find({}).sort({ createdAt: -1 }).limit(6)
  ]);

  const posts = postsRaw.sort((a, b) => {
    const boostA = a.boosts?.length || 0;
    const boostB = b.boosts?.length || 0;
    if (boostA === boostB) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return boostB - boostA;
  });

  res.json({ posts, reels, tournaments });
});

router.post("/", auth, async (req, res) => {
  const { title, description, tags, media, videoUrl } = req.body;
  const post = await Post.create({
    author: req.user._id,
    title,
    description,
    tags,
    media,
    videoUrl
  });
  res.status(201).json(post);
});

router.post("/:id/boost", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.boosts.includes(req.user._id)) post.boosts.push(req.user._id);
  await post.save();
  res.json(post);
});

router.post("/:id/comments", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  const comment = await Comment.create({
    author: req.user._id,
    post: post._id,
    content: req.body.content
  });
  post.comments.push(comment._id);
  await post.save();
  res.json(comment);
});

router.post("/:id/share", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  post.shares += 1;
  await post.save();
  res.json(post);
});

router.get("/:id", async (req, res) => {
  const post = await Post.findById(req.params.id).populate("author", "name");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.json(post);
});

router.put("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id))
    return res.status(403).json({ message: "Not allowed" });
  Object.assign(post, req.body);
  await post.save();
  res.json(post);
});

router.delete("/:id", auth, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });
  if (!post.author.equals(req.user._id))
    return res.status(403).json({ message: "Not allowed" });
  await post.deleteOne();
  res.json({ message: "Deleted" });
});

export default router;

