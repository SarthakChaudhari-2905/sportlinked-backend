import mongoose from "mongoose";

const organizationSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
      index: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "CLUB",
        "ACADEMY",
        "AGENCY",
        "SPORTS_ASSOCIATION",
        "EVENT_ORGANIZER",
      ],
      required: true,
      index: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },

    logoUrl: {
      type: String,
      default: null,
    },

    coverImageUrl: {
      type: String,
      default: null,
    },

    // ==========================================
    // SPORTS
    // ==========================================

    sports: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    // ==========================================
    // CONTACT
    // ==========================================

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    phone: {
      type: String,
      trim: true,
      default: null,
    },

    website: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================
    // LOCATION
    // ==========================================

    location: {
      address: {
        type: String,
        trim: true,
        default: null,
      },

      city: {
        type: String,
        trim: true,
        default: null,
        index: true,
      },

      state: {
        type: String,
        trim: true,
        default: null,
      },

      country: {
        type: String,
        trim: true,
        default: "India",
      },

      coordinates: {
        type: {
          type: String,
          enum: ["Point"],
          default: undefined,
        },

        coordinates: {
          type: [Number],
          default: undefined,
        },
      },
    },

    // ==========================================
    // VERIFICATION
    // ==========================================

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

    verificationDocuments: [
      {
        type: String,
      },
    ],

    verificationReason: {
      type: String,
      maxlength: 500,
      default: null,
    },

    // ==========================================
    // DISCOVERY
    // ==========================================

    isPublic: {
      type: Boolean,
      default: true,
      index: true,
    },

    searchable: {
      type: Boolean,
      default: true,
      index: true,
    },

    // ==========================================
    // STATISTICS
    // ==========================================

    followersCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    memberCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

organizationSchema.index({
  "location.coordinates": "2dsphere",
});

organizationSchema.index({
  type: 1,
  verificationStatus: 1,
});

organizationSchema.index({
  sports: 1,
  "location.city": 1,
});

const Organization = mongoose.model(
  "Organization",
  organizationSchema
);

export default Organization;