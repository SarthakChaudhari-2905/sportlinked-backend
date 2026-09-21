import EventApplication from "../models/EventApplication.js";
import SportsEvent from "../models/SportsEvent.js";
import OrganizationMember from "../models/OrganizationMember.js";

/*
 * Check whether the user is an active
 * organization administrator/manager.
 */
const checkOrganizationPermission = async (
  userId,
  organizationId
) => {
  const membership = await OrganizationMember.findOne({
    organization: organizationId,
    user: userId,
    status: "ACTIVE",
    role: {
      $in: ["OWNER", "ADMIN", "MANAGER", "SCOUT", "COACH", "RECRUITER"],
    },
  });

  return membership;
};

/*
 * Check basic athlete eligibility.
 *
 * This function intentionally keeps the checks
 * generic because the exact User profile schema
 * may evolve later.
 */
const checkEligibility = (event, athlete) => {
  const eligibility = event.eligibility || {};

  /*
   * Gender check
   */
  if (
    eligibility.gender &&
    eligibility.gender !== "ANY" &&
    eligibility.gender !== "MIXED"
  ) {
    if (
      athlete.gender &&
      athlete.gender.toUpperCase() !== eligibility.gender
    ) {
      return {
        eligible: false,
        reason: "Athlete gender does not match event eligibility",
      };
    }
  }

  /*
   * Age check
   *
   * Supports either:
   * - athlete.age
   * - athlete.dateOfBirth
   */
  let age = athlete.age;

  if (!age && athlete.dateOfBirth) {
    const dob = new Date(athlete.dateOfBirth);
    const today = new Date();

    age =
      today.getFullYear() -
      dob.getFullYear();

    const monthDifference =
      today.getMonth() - dob.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 &&
        today.getDate() < dob.getDate())
    ) {
      age--;
    }
  }

  if (
    age &&
    eligibility.minimumAge &&
    age < eligibility.minimumAge
  ) {
    return {
      eligible: false,
      reason: `Minimum age requirement is ${eligibility.minimumAge}`,
    };
  }

  if (
    age &&
    eligibility.maximumAge &&
    age > eligibility.maximumAge
  ) {
    return {
      eligible: false,
      reason: `Maximum age requirement is ${eligibility.maximumAge}`,
    };
  }

  return {
    eligible: true,
  };
};

/*
 * Create application
 */
export const createApplication = async (
  athleteId,
  data
) => {
  const {
    eventId,
    position,
    message,
    experience,
    achievements,
  } = data;

  const event = await SportsEvent.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  /*
   * Event must be published
   */
  if (event.status !== "PUBLISHED") {
    throw new Error(
      "Applications are available only for published events"
    );
  }

  /*
   * Event visibility
   */
  if (event.visibility !== "PUBLIC") {
    throw new Error(
      "This event is not publicly available"
    );
  }

  /*
   * Deadline check
   */
  if (
    event.registrationDeadline &&
    new Date() > new Date(event.registrationDeadline)
  ) {
    throw new Error(
      "Application deadline has passed"
    );
  }

  /*
   * Event start check
   */
  if (
    event.startDate &&
    new Date() > new Date(event.startDate)
  ) {
    throw new Error(
      "This event has already started"
    );
  }

  /*
   * Capacity check
   */
  if (
    event.capacity &&
    event.applicationsCount >= event.capacity
  ) {
    throw new Error(
      "Application capacity has been reached"
    );
  }

  /*
   * Duplicate application check
   */
  const existingApplication =
    await EventApplication.findOne({
      event: eventId,
      athlete: athleteId,
    });

  if (existingApplication) {
    throw new Error(
      "You have already applied to this event"
    );
  }

  /*
   * Basic eligibility check
   */
  const User = (
    await import("../models/User.js")
  ).default;

  const athlete = await User.findById(athleteId);

  if (!athlete) {
    throw new Error("Athlete not found");
  }

  const eligibilityResult = checkEligibility(
    event,
    athlete
  );

  if (!eligibilityResult.eligible) {
    throw new Error(
      eligibilityResult.reason
    );
  }

  /*
   * Position validation
   */
  if (
    position &&
    Array.isArray(event.positionsRequired) &&
    event.positionsRequired.length > 0
  ) {
    const normalizedPositions =
      event.positionsRequired.map((item) =>
        String(item).toLowerCase()
      );

    if (
      !normalizedPositions.includes(
        position.toLowerCase()
      )
    ) {
      throw new Error(
        "Selected position is not required for this event"
      );
    }
  }

  const application =
    await EventApplication.create({
      event: eventId,
      athlete: athleteId,
      position: position || null,
      message: message || "",
      experience: experience || "",
      achievements: achievements || [],
      status: "APPLIED",
    });

  /*
   * Increase application count
   */
  await SportsEvent.findByIdAndUpdate(
    eventId,
    {
      $inc: {
        applicationsCount: 1,
      },
    }
  );

  return application.populate([
    {
      path: "athlete",
      select:
        "firstName lastName username avatar",
    },
    {
      path: "event",
      select:
        "title sport type startDate endDate location status",
    },
  ]);
};

/*
 * Athlete's own applications
 */
export const getMyApplications = async (
  athleteId
) => {
  return EventApplication.find({
    athlete: athleteId,
  })
    .populate({
      path: "event",
      select:
        "title sport type startDate endDate registrationDeadline location status organization",
      populate: {
        path: "organization",
        select:
          "name slug logoUrl type verificationStatus",
      },
    })
    .sort({
      createdAt: -1,
    });
};

/*
 * Get one application
 */
export const getApplicationById = async (
  applicationId,
  userId
) => {
  const application =
    await EventApplication.findById(applicationId)
      .populate({
        path: "athlete",
        select:
          "firstName lastName username avatar email",
      })
      .populate({
        path: "event",
        populate: [
          {
            path: "organization",
            select:
              "name slug logoUrl type verificationStatus",
          },
          {
            path: "createdBy",
            select:
              "firstName lastName username avatar",
          },
        ],
      });

  if (!application) {
    throw new Error(
      "Application not found"
    );
  }

  /*
   * Athlete can see own application.
   */
  if (
    application.athlete._id.toString() ===
    userId.toString()
  ) {
    return application;
  }

  /*
   * Organization member can see it.
   */
  const eventOrganization =
    application.event.organization;

  const membership =
    await checkOrganizationPermission(
      userId,
      eventOrganization._id
    );

  if (!membership) {
    throw new Error(
      "You are not authorized to view this application"
    );
  }

  return application;
};

/*
 * Organization gets applications
 */
export const getEventApplications = async (
  userId,
  eventId,
  status
) => {
  const event =
    await SportsEvent.findById(eventId);

  if (!event) {
    throw new Error("Event not found");
  }

  const membership =
    await checkOrganizationPermission(
      userId,
      event.organization
    );

  if (!membership) {
    throw new Error(
      "You are not authorized to view applications for this event"
    );
  }

  const query = {
    event: eventId,
  };

  if (status) {
    query.status = status;
  }

  return EventApplication.find(query)
    .populate({
      path: "athlete",
      select:
        "firstName lastName username avatar email",
    })
    .sort({
      createdAt: -1,
    });
};

/*
 * Organization updates application status
 */
export const updateApplicationStatus = async (
  userId,
  applicationId,
  data
) => {
  const application =
    await EventApplication.findById(
      applicationId
    ).populate("event");

  if (!application) {
    throw new Error(
      "Application not found"
    );
  }

  const membership =
    await checkOrganizationPermission(
      userId,
      application.event.organization
    );

  if (!membership) {
    throw new Error(
      "You are not authorized to update this application"
    );
  }

  if (
    application.status === "WITHDRAWN"
  ) {
    throw new Error(
      "Withdrawn applications cannot be updated"
    );
  }

  application.status = data.status;

  application.organizationNote =
    data.organizationNote || "";

  application.reviewedBy = userId;
  application.reviewedAt = new Date();

  await application.save();

  return application.populate([
    {
      path: "athlete",
      select:
        "firstName lastName username avatar",
    },
    {
      path: "event",
      select:
        "title sport type startDate endDate",
    },
  ]);
};

/*
 * Athlete withdraws application
 */
export const withdrawApplication = async (
  athleteId,
  applicationId
) => {
  const application =
    await EventApplication.findOne({
      _id: applicationId,
      athlete: athleteId,
    });

  if (!application) {
    throw new Error(
      "Application not found"
    );
  }

  if (
    ["SELECTED", "REJECTED"].includes(
      application.status
    )
  ) {
    throw new Error(
      "This application can no longer be withdrawn"
    );
  }

  if (
    application.status === "WITHDRAWN"
  ) {
    throw new Error(
      "Application is already withdrawn"
    );
  }

  application.status = "WITHDRAWN";
  application.withdrawnAt = new Date();

  await application.save();

  await SportsEvent.findByIdAndUpdate(
    application.event,
    {
      $inc: {
        applicationsCount: -1,
      },
    }
  );

  return application;
};