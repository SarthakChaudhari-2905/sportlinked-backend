import SportsEvent from "../models/SportsEvent.js";
import OrganizationMember from "../models/OrganizationMember.js";

const checkOrganizationPermission =
  async (
    userId,
    organizationId
  ) => {
    const member =
      await OrganizationMember.findOne({
        organization: organizationId,
        user: userId,
        role: {
          $in: [
            "OWNER",
            "ADMIN",
            "MANAGER",
          ],
        },
        status: "ACTIVE",
      });

    if (!member) {
      const error = new Error(
        "You do not have permission to manage events for this organization"
      );

      error.statusCode = 403;

      throw error;
    }

    return member;
  };

// ==========================================
// CREATE EVENT
// ==========================================

const createEvent = async (
  userId,
  data
) => {
  await checkOrganizationPermission(
    userId,
    data.organizationId
  );

  const event =
    await SportsEvent.create({
      organization:
        data.organizationId,

      createdBy: userId,

      title: data.title,
      description: data.description,
      type: data.type,
      sport: data.sport,

      positionsRequired:
        data.positionsRequired || [],

      eligibility:
        data.eligibility || {},

      startDate:
        new Date(data.startDate),

      endDate: data.endDate
        ? new Date(data.endDate)
        : null,

      registrationDeadline:
        new Date(
          data.registrationDeadline
        ),

      location:
        data.location || {},

      capacity:
        data.capacity || null,

      registrationFee:
        data.registrationFee || {
          amount: 0,
          currency: "INR",
        },

      visibility:
        data.visibility || "PUBLIC",

      bannerUrl:
        data.bannerUrl || null,

      contactEmail:
        data.contactEmail || null,

      contactPhone:
        data.contactPhone || null,
    });

  return event;
};

// ==========================================
// PUBLISH EVENT
// ==========================================

const publishEvent = async (
  userId,
  eventId
) => {
  const event =
    await SportsEvent.findById(
      eventId
    );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await checkOrganizationPermission(
    userId,
    event.organization
  );

  event.status = "PUBLISHED";

  await event.save();

  return event;
};

// ==========================================
// GET EVENT
// ==========================================

const getEventById = async (
  eventId
) => {
  const event =
    await SportsEvent.findOne({
      _id: eventId,
      visibility: "PUBLIC",
    })
      .populate(
        "organization",
        "name slug type logoUrl verificationStatus"
      )
      .populate(
        "createdBy",
        "firstName lastName username avatar"
      );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return event;
};

// ==========================================
// MY ORGANIZATION EVENTS
// ==========================================

const getMyOrganizationEvents =
  async (
    userId,
    organizationId
  ) => {
    await checkOrganizationPermission(
      userId,
      organizationId
    );

    return SportsEvent.find({
      organization: organizationId,
    }).sort({
      startDate: -1,
    });
  };

// ==========================================
// UPDATE
// ==========================================

const updateEvent = async (
  userId,
  eventId,
  data
) => {
  const event =
    await SportsEvent.findById(
      eventId
    );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await checkOrganizationPermission(
    userId,
    event.organization
  );

  const updateData = {
    ...data,
  };

  delete updateData.organizationId;

  if (data.startDate) {
    updateData.startDate =
      new Date(data.startDate);
  }

  if (data.endDate) {
    updateData.endDate =
      new Date(data.endDate);
  }

  if (data.registrationDeadline) {
    updateData.registrationDeadline =
      new Date(
        data.registrationDeadline
      );
  }

  Object.assign(
    event,
    updateData
  );

  await event.save();

  return event;
};

// ==========================================
// DELETE
// ==========================================

const deleteEvent = async (
  userId,
  eventId
) => {
  const event =
    await SportsEvent.findById(
      eventId
    );

  if (!event) {
    const error = new Error(
      "Event not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await checkOrganizationPermission(
    userId,
    event.organization
  );

  await event.deleteOne();

  return event;
};

export {
  createEvent,
  publishEvent,
  getEventById,
  getMyOrganizationEvents,
  updateEvent,
  deleteEvent,
};

// ==========================================
// BROWSE / DISCOVER EVENTS (public)
// ==========================================

const browseEvents = async ({
  sport,
  type,
  city,
  status,
  organizationId,
  limit,
  page,
} = {}) => {
  const query = {
    visibility: "PUBLIC",
  };

  query.status = status || "PUBLISHED";

  if (sport) {
    query.sport = sport.toLowerCase();
  }

  if (type) {
    query.type = type.toUpperCase();
  }

  if (city) {
    query["location.city"] = new RegExp(city, "i");
  }

  if (organizationId) {
    query.organization = organizationId;
  }

  const pageSize = Math.min(
    Number(limit) || 20,
    50
  );

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const [events, total] = await Promise.all([
    SportsEvent.find(query)
      .populate("organization", "name logoUrl type verificationStatus")
      .sort({ startDate: 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    SportsEvent.countDocuments(query),
  ]);

  return {
    events,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize) || 1,
  };
};

export { browseEvents };

