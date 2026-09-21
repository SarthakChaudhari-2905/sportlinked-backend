import { USER_ROLES } from "../config/constants.js";

const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    }

    next();
  };
};

const athleteOnly = authorizeRoles(
  USER_ROLES.ATHLETE
);

const organizationOnly = authorizeRoles(
  USER_ROLES.CLUB,
  USER_ROLES.ACADEMY,
  USER_ROLES.AGENCY
);

const scoutOnly = authorizeRoles(
  USER_ROLES.SCOUT,
  USER_ROLES.AGENCY
);

const adminOnly = authorizeRoles(
  USER_ROLES.ADMIN
);

export {
  authorizeRoles,
  athleteOnly,
  organizationOnly,
  scoutOnly,
  adminOnly,
};