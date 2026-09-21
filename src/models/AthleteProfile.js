import mongoose from "mongoose";

const athleteProfileSchema = new mongoose.Schema(
  {
    // ==========================================
    // USER
    // ==========================================

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    dateOfBirth: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: [
        "MALE",
        "FEMALE",
        "OTHER",
        "PREFER_NOT_TO_SAY",
      ],
      default: null,
    },

    bio: {
      type: String,
      maxlength: 1000,
      trim: true,
      default: "",
    },

    // ==========================================
    // SPORT INFORMATION
    // ==========================================

    primarySport: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    secondarySports: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    position: {
      type: String,
      trim: true,
      default: null,
    },

    secondaryPosition: {
      type: String,
      trim: true,
      default: null,
    },

    // ==========================================
    // PHYSICAL INFORMATION
    // ==========================================

    heightCm: {
      type: Number,
      min: 50,
      max: 250,
      default: null,
    },

    weightKg: {
      type: Number,
      min: 10,
      max: 300,
      default: null,
    },

    preferredFoot: {
      type: String,
      enum: [
        "LEFT",
        "RIGHT",
        "BOTH",
        "NOT_APPLICABLE",
      ],
      default: null,
    },

    // ==========================================
    // EXPERIENCE
    // ==========================================

    yearsOfExperience: {
      type: Number,
      min: 0,
      max: 80,
      default: 0,
    },

    playingLevel: {
      type: String,
      enum: [
        "BEGINNER",
        "AMATEUR",
        "SCHOOL",
        "COLLEGE",
        "DISTRICT",
        "STATE",
        "NATIONAL",
        "INTERNATIONAL",
        "PROFESSIONAL",
      ],
      default: "BEGINNER",
      index: true,
    },

    // ==========================================
    // LOCATION
    // ==========================================

    location: {
      city: {
        type: String,
        trim: true,
        default: null,
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
    // CURRENT TEAM / ORGANIZATION
    // ==========================================

    currentTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    currentAcademy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },

    // ==========================================
    // AVAILABILITY
    // ==========================================

    availability: {
      status: {
        type: String,
        enum: [
          "AVAILABLE",
          "OPEN_TO_OPPORTUNITIES",
          "NOT_AVAILABLE",
        ],
        default: "OPEN_TO_OPPORTUNITIES",
      },

      availableFrom: {
        type: Date,
        default: null,
      },

      preferredSessionTypes: [
        {
          type: String,
          enum: [
            "TRIAL",
            "MATCH",
            "TRAINING",
            "CAMP",
            "TOURNAMENT",
            "OTHER",
          ],
        },
      ],
    },

    // ==========================================
    // SOCIAL LINKS
    // ==========================================

    socialLinks: {
      instagram: {
        type: String,
        trim: true,
        default: null,
      },

      youtube: {
        type: String,
        trim: true,
        default: null,
      },

      linkedin: {
        type: String,
        trim: true,
        default: null,
      },

      website: {
        type: String,
        trim: true,
        default: null,
      },
    },

    // ==========================================
    // PROFILE VISIBILITY
    // ==========================================

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

    // ==========================================
    // PROFILE COMPLETION
    // ==========================================

    profileCompletion: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    // ==========================================
    // SEARCH / DISCOVERY
    // ==========================================

    searchable: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// GEO INDEX
// ==========================================

athleteProfileSchema.index({
  "location.coordinates": "2dsphere",
});

// ==========================================
// SEARCH INDEX
// ==========================================

athleteProfileSchema.index({
  primarySport: 1,
  playingLevel: 1,
  "location.city": 1,
});

const AthleteProfile =
  mongoose.model(
    "AthleteProfile",
    athleteProfileSchema
  );

export default AthleteProfile;