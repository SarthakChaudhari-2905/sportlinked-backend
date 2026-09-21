import crypto from "crypto";

import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

const hashToken = (token) => {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
};

const getRefreshTokenExpiry = () => {
  const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || "7d";

  const match = expiresIn.match(
    /^(\d+)([smhd])$/
  );

  if (!match) {
    return new Date(
      Date.now() + 7 * 24 * 60 * 60 * 1000
    );
  }

  const value = Number(match[1]);
  const unit = match[2];

  const multipliers = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return new Date(
    Date.now() + value * multipliers[unit]
  );
};

// Creates a RefreshToken document, retrying once with a freshly generated
// token if we somehow collide on the unique tokenHash index (this should
// be extremely rare now that tokens include a random jti, but two truly
// simultaneous requests could still land here - this keeps that a clean
// retry instead of an unhandled Mongo error that crashes the process).
const createRefreshTokenRecord = async (user, req, attempt = 0) => {
  const refreshToken = generateRefreshToken(user);
  const refreshTokenHash = hashToken(refreshToken);

  try {
    await RefreshToken.create({
      user: user._id,
      tokenHash: refreshTokenHash,
      expiresAt: getRefreshTokenExpiry(),
      userAgent: req?.get ? req.get("user-agent") || null : null,
      ipAddress:
        req?.ip ||
        req?.headers?.["x-forwarded-for"] ||
        null,
    });

    return refreshToken;
  } catch (error) {
    if (error?.code === 11000 && attempt < 2) {
      return createRefreshTokenRecord(user, req, attempt + 1);
    }

    throw error;
  }
};

const createSession = async (
  user,
  req
) => {
  const accessToken =
    generateAccessToken(user);

  const refreshToken =
    await createRefreshTokenRecord(user, req);

  return {
    accessToken,
    refreshToken,
  };
};

const registerUser = async (
  userData,
  req
) => {
  const {
    email,
    username,
    phone,
  } = userData;

  const conditions = [
    { email: email.toLowerCase() },
  ];

  if (username) {
    conditions.push({
      username: username.toLowerCase(),
    });
  }

  if (phone) {
    conditions.push({ phone });
  }

  const existingUser =
    await User.findOne({
      $or: conditions,
    });

  if (existingUser) {
    if (
      existingUser.email ===
      email.toLowerCase()
    ) {
      const error = new Error(
        "An account with this email already exists"
      );
      error.statusCode = 409;
      throw error;
    }

    if (
      username &&
      existingUser.username ===
        username.toLowerCase()
    ) {
      const error = new Error(
        "This username is already taken"
      );
      error.statusCode = 409;
      throw error;
    }

    if (
      phone &&
      existingUser.phone === phone
    ) {
      const error = new Error(
        "An account with this phone number already exists"
      );
      error.statusCode = 409;
      throw error;
    }
  }

  const user = await User.create({
    ...userData,
    email: email.toLowerCase(),
    username:
      username?.toLowerCase(),
  });

  const tokens = await createSession(
    user,
    req
  );

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user,
    ...tokens,
  };
};

const loginUser = async (
  email,
  password,
  req
) => {
  const user = await User.findOne({
    email: email.toLowerCase(),
  }).select("+password");

  if (!user) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  if (
    user.accountStatus !== "ACTIVE" ||
    !user.isActive ||
    user.isDeleted
  ) {
    const error = new Error(
      "This account is not active"
    );
    error.statusCode = 403;
    throw error;
  }

  const passwordMatch =
    await user.comparePassword(
      password
    );

  if (!passwordMatch) {
    const error = new Error(
      "Invalid email or password"
    );
    error.statusCode = 401;
    throw error;
  }

  const tokens = await createSession(
    user,
    req
  );

  user.lastLoginAt = new Date();
  await user.save();

  return {
    user,
    ...tokens,
  };
};

const refreshSession = async (
  refreshToken,
  req
) => {
  if (!refreshToken) {
    const error = new Error(
      "Refresh token is required"
    );
    error.statusCode = 401;
    throw error;
  }

  let payload;

  try {
    payload =
      verifyRefreshToken(
        refreshToken
      );
  } catch {
    const error = new Error(
      "Invalid or expired refresh token"
    );
    error.statusCode = 401;
    throw error;
  }

  if (payload.type !== "refresh") {
    const error = new Error(
      "Invalid refresh token"
    );
    error.statusCode = 401;
    throw error;
  }

  const tokenHash =
    hashToken(refreshToken);

  const storedToken =
    await RefreshToken.findOne({
      tokenHash,
      revoked: false,
    });

  if (!storedToken) {
    const error = new Error(
      "Refresh token has been revoked or does not exist"
    );
    error.statusCode = 401;
    throw error;
  }

  if (
    storedToken.expiresAt <
    new Date()
  ) {
    const error = new Error(
      "Refresh token has expired"
    );
    error.statusCode = 401;
    throw error;
  }

  const user =
    await User.findById(
      payload.sub
    );

  if (
    !user ||
    !user.isActive ||
    user.isDeleted ||
    user.accountStatus !== "ACTIVE"
  ) {
    const error = new Error(
      "User account is not active"
    );
    error.statusCode = 401;
    throw error;
  }

  // Rotate refresh token
  storedToken.revoked = true;
  storedToken.revokedAt = new Date();

  await storedToken.save();

  const newAccessToken =
    generateAccessToken(user);

  const newRefreshToken =
    await createRefreshTokenRecord(user, req);

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

const logoutUser = async (
  refreshToken
) => {
  if (!refreshToken) {
    return;
  }

  const tokenHash =
    hashToken(refreshToken);

  await RefreshToken.findOneAndUpdate(
    {
      tokenHash,
      revoked: false,
    },
    {
      revoked: true,
      revokedAt: new Date(),
    }
  );
};

export {
  registerUser,
  loginUser,
  refreshSession,
  logoutUser,
};

