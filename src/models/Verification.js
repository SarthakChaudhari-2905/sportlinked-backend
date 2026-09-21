import mongoose from "mongoose";

import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPES,
} from "../config/constants.js";

const verificationSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // ==========================================
    // VERIFICATION TYPE
    // ==========================================

    type: {
      type: String,
      enum: {
        values: Object.values(
          VERIFICATION_TYPES
        ),
        message: "Invalid verification type",
      },
      required: true,
      index: true,
    },

    // ==========================================
    // STATUS
    // ==========================================

    status: {
      type: String,
      enum: {
        values: Object.values(
          VERIFICATION_STATUS
        ),
        message: "Invalid verification status",
      },
      default:
        VERIFICATION_STATUS.PENDING,
      index: true,
    },

    // ==========================================
    // SUBMISSION DETAILS
    // ==========================================

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    reviewedAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ADMIN REVIEWER
    // ==========================================

    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // ==========================================
    // EXTERNAL KYC REFERENCE
    // ==========================================

    provider: {
      type: String,
      default: null,
      trim: true,
    },

    providerReference: {
      type: String,
      default: null,
      trim: true,
      select: false,
    },

    // ==========================================
    // REJECTION
    // ==========================================

    rejectionReason: {
      type: String,
      default: null,
      maxlength: 500,
      trim: true,
    },

    // ==========================================
    // ADMIN NOTES
    // ==========================================

    reviewNotes: {
      type: String,
      default: null,
      maxlength: 1000,
      trim: true,
    },

    // ==========================================
    // SECURITY / AUDIT
    // ==========================================

    submittedIp: {
      type: String,
      default: null,
    },

    reviewedIp: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// INDEXES
// ==========================================

verificationSchema.index({
  user: 1,
  type: 1,
});

verificationSchema.index({
  status: 1,
  type: 1,
});

const Verification =
  mongoose.model(
    "Verification",
    verificationSchema
  );

export default Verification;