import mongoose from "mongoose";

const organizationMemberSchema =
  new mongoose.Schema(
    {
      organization: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Organization",
        required: true,
        index: true,
      },

      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      role: {
        type: String,
        enum: [
          "OWNER",
          "ADMIN",
          "MANAGER",
          "SCOUT",
          "COACH",
          "RECRUITER",
          "STAFF",
        ],
        default: "STAFF",
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "ACTIVE",
          "SUSPENDED",
          "REMOVED",
        ],
        default: "PENDING",
      },

      joinedAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

organizationMemberSchema.index(
  {
    organization: 1,
    user: 1,
  },
  {
    unique: true,
  }
);

const OrganizationMember =
  mongoose.model(
    "OrganizationMember",
    organizationMemberSchema
  );

export default OrganizationMember;