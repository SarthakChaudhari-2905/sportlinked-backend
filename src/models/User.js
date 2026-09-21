import mongoose from "mongoose";
import bcrypt from "bcryptjs";

import {
  USER_ROLES,
  ACCOUNT_STATUS,
  VERIFICATION_STATUS,
} from "../config/constants.js";

const userSchema = new mongoose.Schema(
  {
    // ==========================================
    // BASIC INFORMATION
    // ==========================================

    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must contain at least 2 characters"],
      maxlength: [50, "First name cannot exceed 50 characters"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must contain at least 2 characters"],
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      minlength: [3, "Username must contain at least 3 characters"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      match: [
        /^[a-z0-9._]+$/,
        "Username can only contain letters, numbers, dots and underscores",
      ],
    },

    // ==========================================
    // CONTACT INFORMATION
    // ==========================================

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 120,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      maxlength: 20,
    },

    // ==========================================
    // AUTHENTICATION
    // ==========================================

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must contain at least 8 characters"],
      select: false,
    },

    // ==========================================
    // ROLE
    // ==========================================

    role: {
      type: String,
      enum: {
        values: Object.values(USER_ROLES),
        message: "Invalid user role",
      },
      default: USER_ROLES.ATHLETE,
      required: true,
      index: true,
    },

    // ==========================================
    // ACCOUNT STATUS
    // ==========================================

    accountStatus: {
      type: String,
      enum: {
        values: Object.values(ACCOUNT_STATUS),
        message: "Invalid account status",
      },
      default: ACCOUNT_STATUS.ACTIVE,
      index: true,
    },

    // ==========================================
    // PROFILE
    // ==========================================

    avatar: {
      type: String,
      default: null,
    },

    // ==========================================
    // EMAIL VERIFICATION
    // ==========================================

    emailVerification: {
      status: {
        type: String,
        enum: Object.values(VERIFICATION_STATUS),
        default: VERIFICATION_STATUS.NOT_SUBMITTED,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },
    },

    // ==========================================
    // PHONE VERIFICATION
    // ==========================================

    phoneVerification: {
      status: {
        type: String,
        enum: Object.values(VERIFICATION_STATUS),
        default: VERIFICATION_STATUS.NOT_SUBMITTED,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },
    },

    // ==========================================
    // IDENTITY VERIFICATION
    // ==========================================

    identityVerification: {
      status: {
        type: String,
        enum: Object.values(VERIFICATION_STATUS),
        default: VERIFICATION_STATUS.NOT_SUBMITTED,
        index: true,
      },

      verifiedAt: {
        type: Date,
        default: null,
      },
    },

    // ==========================================
    // PROFILE STATUS
    // ==========================================

    profileCompleted: {
      type: Boolean,
      default: false,
      index: true,
    },

    // ==========================================
    // LOGIN INFORMATION
    // ==========================================

    lastLoginAt: {
      type: Date,
      default: null,
    },

    // ==========================================
    // ACCOUNT CONTROL
    // ==========================================

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,

    // Don't expose sensitive fields by default
    toJSON: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
      },
    },

    toObject: {
      transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;

        return ret;
      },
    },
  }
);

// ==========================================
// INDEXES
// ==========================================

userSchema.index({
  role: 1,
  accountStatus: 1,
});

userSchema.index({
  "identityVerification.status": 1,
});

// ==========================================
// PASSWORD HASHING
// ==========================================

userSchema.pre("save", async function (next) {
  // Password hasn't changed
  if (!this.isModified("password")) {
    return next();
  }

  const saltRounds = 12;

  this.password = await bcrypt.hash(
    this.password,
    saltRounds
  );

  next();
});

// ==========================================
// PASSWORD COMPARISON
// ==========================================

userSchema.methods.comparePassword = async function (
  candidatePassword
) {
  return bcrypt.compare(
    candidatePassword,
    this.password
  );
};

// ==========================================
// FULL NAME VIRTUAL
// ==========================================

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// ==========================================
// EXPORT MODEL
// ==========================================

const User = mongoose.model("User", userSchema);

export default User;