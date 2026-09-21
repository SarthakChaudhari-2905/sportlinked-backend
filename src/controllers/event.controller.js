import {
  createEvent,
  publishEvent,
  getEventById,
  getMyOrganizationEvents,
  updateEvent,
  deleteEvent,
  browseEvents,
} from "../services/event.service.js";

const create = async (
  req,
  res
) => {
  const event =
    await createEvent(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Event created successfully",
    data: {
      event,
    },
  });
};

const publish = async (
  req,
  res
) => {
  const event =
    await publishEvent(
      req.user._id,
      req.params.id
    );

  res.status(200).json({
    success: true,
    message:
      "Event published successfully",
    data: {
      event,
    },
  });
};

const getById = async (
  req,
  res
) => {
  const event =
    await getEventById(
      req.params.id
    );

  res.status(200).json({
    success: true,
    data: {
      event,
    },
  });
};

const getOrganizationEvents =
  async (
    req,
    res
  ) => {
    const events =
      await getMyOrganizationEvents(
        req.user._id,
        req.params.organizationId
      );

    res.status(200).json({
      success: true,
      data: {
        events,
      },
    });
  };

const update = async (
  req,
  res
) => {
  const event =
    await updateEvent(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Event updated successfully",
    data: {
      event,
    },
  });
};

const remove = async (
  req,
  res
) => {
  await deleteEvent(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message:
      "Event deleted successfully",
  });
};

// ==========================================
// PUBLIC BROWSE / DISCOVERY
// ==========================================

const browse = async (
  req,
  res
) => {
  const {
    sport,
    type,
    city,
    status,
    organizationId,
    limit,
    page,
  } = req.query;

  const result = await browseEvents({
    sport,
    type,
    city,
    status,
    organizationId,
    limit,
    page,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};

export {
  create,
  publish,
  getById,
  getOrganizationEvents,
  update,
  remove,
  browse,
};

