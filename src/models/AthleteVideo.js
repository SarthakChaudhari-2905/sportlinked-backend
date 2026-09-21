import mongoose from "mongoose";

const athleteVideoSchema =
  new mongoose.Schema(
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

      videoUrl: {
        type: String,
        required: true,
      },

      thumbnailUrl: {
        type: String,
        default: null,
      },

      videoPublicId: {
        type: String,
        default: null,
        select: false,
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
          "MATCH_HIGHLIGHT",
          "TRAINING",
          "SKILLS",
          "FULL_MATCH",
          "INTERVIEW",
          "OTHER",
        ],
        default: "MATCH_HIGHLIGHT",
      },

      position: {
        type: String,
        trim: true,
        default: null,
      },

      durationSeconds: {
        type: Number,
        min: 0,
        default: null,
      },

      matchName: {
        type: String,
        trim: true,
        default: null,
      },

      opponent: {
        type: String,
        trim: true,
        default: null,
      },

      eventDate: {
        type: Date,
        default: null,
      },

      views: {
        type: Number,
        default: 0,
        min: 0,
      },

      likes: {
        type: Number,
        default: 0,
        min: 0,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

      visibility: {
        type: String,
        enum: [
          "PUBLIC",
          "CONNECTIONS",
          "PRIVATE",
        ],
        default: "PUBLIC",
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

athleteVideoSchema.index({
  athlete: 1,
  sport: 1,
});

athleteVideoSchema.index({
  visibility: 1,
  isFeatured: 1,
});

const AthleteVideo =
  mongoose.model(
    "AthleteVideo",
    athleteVideoSchema
  );

export default AthleteVideo;