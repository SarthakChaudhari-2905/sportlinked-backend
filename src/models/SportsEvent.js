import mongoose from "mongoose";

const sportsEventSchema =
  new mongoose.Schema(
    {
      // ==========================================
      // ORGANIZER
      // ==========================================

      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },

      // ==========================================
      // EVENT INFORMATION
      // ==========================================

      title: {
        type: String,
        required: true,
        trim: true,
        maxlength: 200,
        index: true,
      },

      description: {
        type: String,
        trim: true,
        maxlength: 3000,
        default: "",
      },

      type: {
        type: String,
        enum: [
          "MATCH",
          "TRIAL",
          "TOURNAMENT",
          "TRAINING",
          "CAMP",
          "SCOUTING_SESSION",
          "OTHER",
        ],
        required: true,
        index: true,
      },

      sport: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        index: true,
      },

      // ==========================================
      // POSITIONS / ROLES REQUIRED
      // ==========================================

      positionsRequired: [
        {
          type: String,
          trim: true,
        },
      ],

      // ==========================================
      // ELIGIBILITY
      // ==========================================

      eligibility: {
        minimumAge: {
          type: Number,
          min: 5,
          max: 100,
          default: null,
        },

        maximumAge: {
          type: Number,
          min: 5,
          max: 100,
          default: null,
        },

        gender: {
          type: String,
          enum: [
            "MALE",
            "FEMALE",
            "MIXED",
            "ANY",
          ],
          default: "ANY",
        },

        playingLevels: [
          {
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
          },
        ],
      },

      // ==========================================
      // DATE & TIME
      // ==========================================

      startDate: {
        type: Date,
        required: true,
        index: true,
      },

      endDate: {
        type: Date,
        default: null,
      },

      registrationDeadline: {
        type: Date,
        required: true,
      },

      // ==========================================
      // LOCATION
      // ==========================================

      location: {
        venueName: {
          type: String,
          trim: true,
          default: null,
        },

        address: {
          type: String,
          trim: true,
          default: null,
        },

        city: {
          type: String,
          trim: true,
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
      // CAPACITY
      // ==========================================

      capacity: {
        type: Number,
        min: 1,
        default: null,
      },

      applicationsCount: {
        type: Number,
        default: 0,
        min: 0,
      },

      // ==========================================
      // FEES
      // ==========================================

      registrationFee: {
        amount: {
          type: Number,
          min: 0,
          default: 0,
        },

        currency: {
          type: String,
          default: "INR",
        },
      },

      // ==========================================
      // STATUS
      // ==========================================

      status: {
        type: String,
        enum: [
          "DRAFT",
          "PUBLISHED",
          "REGISTRATION_CLOSED",
          "ONGOING",
          "COMPLETED",
          "CANCELLED",
        ],
        default: "DRAFT",
        index: true,
      },

      // ==========================================
      // VISIBILITY
      // ==========================================

      visibility: {
        type: String,
        enum: [
          "PUBLIC",
          "PRIVATE",
        ],
        default: "PUBLIC",
        index: true,
      },

      // ==========================================
      // ADDITIONAL
      // ==========================================

      bannerUrl: {
        type: String,
        default: null,
      },

      contactEmail: {
        type: String,
        default: null,
      },

      contactPhone: {
        type: String,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

sportsEventSchema.index({
  "location.coordinates": "2dsphere",
});

sportsEventSchema.index({
  sport: 1,
  type: 1,
  status: 1,
});

sportsEventSchema.index({
  "location.city": 1,
  startDate: 1,
});

const SportsEvent =
  mongoose.model(
    "SportsEvent",
    sportsEventSchema
  );

export default SportsEvent;