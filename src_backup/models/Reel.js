import mongoose from "mongoose";

const reelSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    caption: String,
    videoUrl: { type: String, required: true },
    tags: [String],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    boosts: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    shares: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }]
  },
  { timestamps: true }
);

export default mongoose.model("Reel", reelSchema);

