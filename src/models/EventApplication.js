import mongoose from "mongoose";

const eventApplicationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SportsEvent",
      required: true,
      index: true,
    },

    athlete: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    position: {
      type: String,
      trim: true,
      lowercase: true,
      default: null,
    },

    message: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    experience: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    achievements: [
      {
        type: String,
        trim: true,
        maxlength: 500,
      },
    ],

    status: {
      type: String,
      enum: [
        "APPLIED",
        "UNDER_REVIEW",
        "SHORTLISTED",
        "SELECTED",
        "REJECTED",
        "WITHDRAWN",
      ],
      default: "APPLIED",
      index: true,
    },

    organizationNote: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    withdrawnAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Prevent the same athlete from applying
 * to the same event more than once.
 */
eventApplicationSchema.index(
  { event: 1, athlete: 1 },
  { unique: true }
);

/*
 * Useful for organization dashboards.
 */
eventApplicationSchema.index({
  event: 1,
  status: 1,
});

const EventApplication = mongoose.model(
  "EventApplication",
  eventApplicationSchema
);

export default EventApplication;