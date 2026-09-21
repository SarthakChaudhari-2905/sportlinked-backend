import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    reel: { type: mongoose.Schema.Types.ObjectId, ref: "Reel" },
    content: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);

