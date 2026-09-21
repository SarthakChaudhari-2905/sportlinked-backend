import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    sport: String,
    position: String,
    bio: String,
    avatar: String,
    achievements: [String],
    stats: {
      matches: { type: Number, default: 0 },
      goals: { type: Number, default: 0 },
      assists: { type: Number, default: 0 },
      winRate: { type: String, default: "0%" }
    },
    reels: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reel" }],
    matchHistory: [
      {
        opponent: String,
        result: String,
        date: String
      }
    ],
    connections: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    badges: [String],
    notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notification" }]
  },
  { timestamps: true }
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function compare(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);

