import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
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

    issuingOrganization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    category: {
      type: String,
      enum: [
        "SPORTS",
        "COACHING",
        "TOURNAMENT",
        "FITNESS",
        "EDUCATION",
        "OTHER",
      ],
      default: "SPORTS",
    },

    sport: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    issueDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      default: null,
    },

    certificateNumber: {
      type: String,
      trim: true,
      maxlength: 100,
      default: null,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    // Cloud storage URL.
    // We will connect S3/Cloudinary later.
    documentUrl: {
      type: String,
      default: null,
    },

    documentPublicId: {
      type: String,
      default: null,
      select: false,
    },

    verificationStatus: {
      type: String,
      enum: [
        "UNVERIFIED",
        "PENDING",
        "VERIFIED",
        "REJECTED",
      ],
      default: "UNVERIFIED",
      index: true,
    },

    verificationReference: {
      type: String,
      default: null,
      select: false,
    },

    rejectionReason: {
      type: String,
      maxlength: 500,
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

certificateSchema.index({
  athlete: 1,
  sport: 1,
});

certificateSchema.index({
  verificationStatus: 1,
});

const Certificate = mongoose.model(
  "Certificate",
  certificateSchema
);

export default Certificate;