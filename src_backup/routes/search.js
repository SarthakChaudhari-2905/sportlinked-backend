import express from "express";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Tournament from "../models/Tournament.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const regex = new RegExp(q, "i");
  const [players, posts, tournaments] = await Promise.all([
    User.find({ name: regex }).select("name sport position"),
    Post.find({ title: regex }).select("title author"),
    Tournament.find({ name: regex }).select("name location startDate status")
  ]);
  res.json({ players, posts, tournaments });
});

export default router;

