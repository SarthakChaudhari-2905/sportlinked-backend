import jwt from "jsonwebtoken";
import crypto from "crypto";
import env from "../config/env.js";

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      type: "access",
    },
    env.jwt.accessSecret,
    {
      expiresIn: env.jwt.accessExpiresIn,
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      sub: user._id.toString(),
      type: "refresh",
      // A random jti guarantees the signed token is unique even if two
      // refresh tokens are issued for the same user within the same
      // second (e.g. two concurrent refresh calls). Without this, the
      // resulting JWT would be byte-for-byte identical and collide on
      // the RefreshToken.tokenHash unique index, crashing the request.
      jti: crypto.randomUUID(),
    },
    env.jwt.refreshSecret,
    {
      expiresIn: env.jwt.refreshExpiresIn,
    }
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(
    token,
    env.jwt.accessSecret
  );
};

const verifyRefreshToken = (token) => {
  return jwt.verify(
    token,
    env.jwt.refreshSecret
  );
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};

