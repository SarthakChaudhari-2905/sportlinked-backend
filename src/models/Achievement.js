import mongoose from "mongoose";

const achievementSchema = new mongoose.Schema(
  {
    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    sport: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    category: {
      type: String,
      enum: [
        "TOURNAMENT",
        "MEDAL",
        "AWARD",
        "RECORD",
        "CHAMPIONSHIP",
        "OTHER",
      ],
      default: "OTHER",
    },

    position: {
      type: String,
      trim: true,
      default: null,
    },

    organization: {
      type: String,
      trim: true,
      default: null,
    },

    achievementDate: {
      type: Date,
      required: true,
    },

    rank: {
      type: Number,
      min: 1,
      default: null,
    },

    mediaUrl: {
      type: String,
      default: null,
    },

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

achievementSchema.index({
  athlete: 1,
  sport: 1,
});

const Achievement = mongoose.model(
  "Achievement",
  achievementSchema
);

export default Achievement;