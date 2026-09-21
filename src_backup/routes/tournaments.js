import express from "express";
import Tournament from "../models/Tournament.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const tournaments = await Tournament.find({}).sort({ createdAt: -1 });
  res.json(tournaments);
});

router.post("/", auth, async (req, res) => {
  const tournament = await Tournament.create(req.body);
  res.status(201).json(tournament);
});

router.put("/:id", auth, async (req, res) => {
  const tournament = await Tournament.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(tournament);
});

router.delete("/:id", auth, async (req, res) => {
  await Tournament.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;

