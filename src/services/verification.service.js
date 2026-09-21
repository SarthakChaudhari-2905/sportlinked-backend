import Verification from "../models/Verification.js";
import User from "../models/User.js";

import {
  VERIFICATION_STATUS,
  VERIFICATION_TYPES,
} from "../config/constants.js";

// ==========================================
// SUBMIT VERIFICATION
// ==========================================

const submitVerification = async (
  user,
  data,
  req
) => {
  const existing =
    await Verification.findOne({
      user: user._id,
      type: data.type,
      status: {
        $in: [
          VERIFICATION_STATUS.PENDING,
          VERIFICATION_STATUS.APPROVED,
        ],
      },
    });

  if (existing) {
    const error = new Error(
      "A verification request already exists for this type"
    );

    error.statusCode = 409;

    throw error;
  }

  const verification =
    await Verification.create({
      user: user._id,
      type: data.type,
      provider: data.provider || null,
      providerReference:
        data.providerReference ||
        null,
      reviewNotes:
        data.reviewNotes || null,
      submittedIp:
        req.ip ||
        req.headers["x-forwarded-for"] ||
        null,
      status:
        VERIFICATION_STATUS.PENDING,
    });

  return verification;
};

// ==========================================
// GET MY VERIFICATIONS
// ==========================================

const getMyVerifications = async (
  userId
) => {
  return Verification.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate(
      "reviewedBy",
      "firstName lastName username role"
    );
};

// ==========================================
// GET PENDING VERIFICATIONS
// ==========================================

const getPendingVerifications = async () => {
  return Verification.find({
    status:
      VERIFICATION_STATUS.PENDING,
  })
    .sort({
      createdAt: 1,
    })
    .populate(
      "user",
      "firstName lastName username email phone role avatar"
    );
};

// ==========================================
// REVIEW VERIFICATION
// ==========================================

const reviewVerification = async (
  verificationId,
  admin,
  data,
  req
) => {
  const verification =
    await Verification.findById(
      verificationId
    );

  if (!verification) {
    const error = new Error(
      "Verification request not found"
    );

    error.statusCode = 404;

    throw error;
  }

  if (
    verification.status !==
    VERIFICATION_STATUS.PENDING
  ) {
    const error = new Error(
      "This verification request has already been reviewed"
    );

    error.statusCode = 409;

    throw error;
  }

  if (
    data.status ===
      VERIFICATION_STATUS.REJECTED &&
    !data.rejectionReason
  ) {
    const error = new Error(
      "Rejection reason is required"
    );

    error.statusCode = 400;

    throw error;
  }

  verification.status =
    data.status;

  verification.reviewedAt =
    new Date();

  verification.reviewedBy =
    admin._id;

  verification.reviewedIp =
    req.ip ||
    req.headers["x-forwarded-for"] ||
    null;

  verification.reviewNotes =
    data.reviewNotes || null;

  verification.rejectionReason =
    data.rejectionReason || null;

  await verification.save();

  // ==========================================
  // UPDATE USER VERIFICATION STATUS
  // ==========================================

  const user =
    await User.findById(
      verification.user
    );

  if (user) {
    if (
      verification.type ===
      VERIFICATION_TYPES.IDENTITY
    ) {
      user.identityVerification.status =
        data.status;

      if (
        data.status ===
        VERIFICATION_STATUS.APPROVED
      ) {
        user.identityVerification.verifiedAt =
          new Date();
      } else {
        user.identityVerification.verifiedAt =
          null;
      }
    }

    if (
      verification.type ===
      VERIFICATION_TYPES.ATHLETE
    ) {
      if (
        data.status ===
        VERIFICATION_STATUS.APPROVED
      ) {
        user.profileCompleted = true;
      }
    }

    await user.save();
  }

  return verification;
};

export {
  submitVerification,
  getMyVerifications,
  getPendingVerifications,
  reviewVerification,
};