import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: String,
    startDate: String,
    endDate: String,
    prize: String,
    status: { type: String, default: "Upcoming" },
    tags: [String],
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: true }
);

export default mongoose.model("Tournament", tournamentSchema);

