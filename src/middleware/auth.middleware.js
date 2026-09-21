import User from "../models/User.js";
import {
  verifyAccessToken,
} from "../utils/jwt.js";

const authenticate = async (
  req,
  res,
  next
) => {
  try {
    const authorization =
      req.headers.authorization;

    if (
      !authorization ||
      !authorization.startsWith(
        "Bearer "
      )
    ) {
      return res.status(401).json({
        success: false,
        message:
          "Authentication required. Please provide a Bearer token.",
      });
    }

    const token =
      authorization.substring(7);

    let payload;

    try {
      payload =
        verifyAccessToken(token);
    } catch {
      return res.status(401).json({
        success: false,
        message:
          "Invalid or expired access token",
      });
    }

    if (payload.type !== "access") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const user =
      await User.findById(
        payload.sub
      );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    if (
      !user.isActive ||
      user.isDeleted ||
      user.accountStatus !== "ACTIVE"
    ) {
      return res.status(403).json({
        success: false,
        message:
          "Your account is not active",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    next(error);
  }
};

export default authenticate;