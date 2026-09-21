import {
  requestConnection,
  getConnections,
  acceptConnection,
  rejectConnection,
  removeConnection,
  getSuggestions,
} from "../services/connection.service.js";

export const request = async (
  req,
  res
) => {
  const connection =
    await requestConnection(
      req.user._id,
      req.params.userId
    );

  res.status(201).json({
    success: true,
    message:
      "Connection request sent",
    data: {
      connection,
    },
  });
};

export const mine = async (
  req,
  res
) => {
  const connections =
    await getConnections(
      req.user._id
    );

  res.json({
    success: true,
    data: {
      connections,
    },
  });
};

export const suggestions = async (
  req,
  res
) => {
  const suggestions =
    await getSuggestions(
      req.user._id,
      req.query.limit
    );

  res.json({
    success: true,
    data: {
      suggestions,
    },
  });
};

export const accept = async (
  req,
  res
) => {
  const connection =
    await acceptConnection(
      req.user._id,
      req.params.id
    );

  res.json({
    success: true,
    message:
      "Connection accepted",
    data: {
      connection,
    },
  });
};

export const reject = async (
  req,
  res
) => {
  const connection =
    await rejectConnection(
      req.user._id,
      req.params.id
    );

  res.json({
    success: true,
    message:
      "Connection request rejected",
    data: {
      connection,
    },
  });
};

export const remove = async (
  req,
  res
) => {
  await removeConnection(
    req.user._id,
    req.params.id
  );

  res.json({
    success: true,
    message:
      "Connection removed",
  });
};