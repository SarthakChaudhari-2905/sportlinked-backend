import Connection from "../models/Connection.js";
import User from "../models/User.js";
import AthleteProfile from "../models/AthleteProfile.js";

const makePairKey = (a, b) => {
  return [a.toString(), b.toString()]
    .sort()
    .join(":");
};

const getOtherUser = (connection, userId) => {
  const current = userId.toString();

  if (
    connection.requester._id.toString() === current
  ) {
    return connection.recipient;
  }

  return connection.requester;
};

const requestConnection = async (
  userId,
  targetUserId
) => {
  if (
    userId.toString() ===
    targetUserId.toString()
  ) {
    const error = new Error(
      "You cannot connect with yourself"
    );

    error.statusCode = 400;

    throw error;
  }

  const targetUser =
    await User.findOne({
      _id: targetUserId,
      isActive: true,
      isDeleted: false,
      accountStatus: "ACTIVE",
    });

  if (!targetUser) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const pairKey = makePairKey(
    userId,
    targetUserId
  );

  const existing =
    await Connection.findOne({
      pairKey,
    });

  if (existing) {
    if (existing.status === "ACCEPTED") {
      const error = new Error(
        "You are already connected"
      );

      error.statusCode = 409;

      throw error;
    }

    if (existing.status === "PENDING") {
      const error = new Error(
        "A connection request already exists"
      );

      error.statusCode = 409;

      throw error;
    }

    existing.requester = userId;
    existing.recipient = targetUserId;
    existing.status = "PENDING";
    existing.acceptedAt = null;

    await existing.save();

    return existing;
  }

  return Connection.create({
    requester: userId,
    recipient: targetUserId,
    pairKey,
    status: "PENDING",
  });
};

const getConnections = async (
  userId
) => {
  const connections =
    await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
      status: {
        $in: [
          "PENDING",
          "ACCEPTED",
        ],
      },
    })
      .populate(
        "requester",
        "firstName lastName username avatar role identityVerification"
      )
      .populate(
        "recipient",
        "firstName lastName username avatar role identityVerification"
      )
      .sort({
        updatedAt: -1,
      });

  return connections.map((connection) => ({
    ...connection.toObject(),
    otherUser: getOtherUser(
      connection,
      userId
    ),
    direction:
      connection.recipient._id.toString() ===
      userId.toString()
        ? "INCOMING"
        : "OUTGOING",
  }));
};

const acceptConnection = async (
  userId,
  connectionId
) => {
  const connection =
    await Connection.findOne({
      _id: connectionId,
      recipient: userId,
      status: "PENDING",
    });

  if (!connection) {
    const error = new Error(
      "Connection request not found"
    );

    error.statusCode = 404;

    throw error;
  }

  connection.status = "ACCEPTED";
  connection.acceptedAt = new Date();

  await connection.save();

  return connection.populate([
    {
      path: "requester",
      select:
        "firstName lastName username avatar role identityVerification",
    },
    {
      path: "recipient",
      select:
        "firstName lastName username avatar role identityVerification",
    },
  ]);
};

const rejectConnection = async (
  userId,
  connectionId
) => {
  const connection =
    await Connection.findOne({
      _id: connectionId,
      recipient: userId,
      status: "PENDING",
    });

  if (!connection) {
    const error = new Error(
      "Connection request not found"
    );

    error.statusCode = 404;

    throw error;
  }

  connection.status = "REJECTED";

  await connection.save();

  return connection;
};

const removeConnection = async (
  userId,
  connectionId
) => {
  const connection =
    await Connection.findOne({
      _id: connectionId,
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
    });

  if (!connection) {
    const error = new Error(
      "Connection not found"
    );

    error.statusCode = 404;

    throw error;
  }

  await connection.deleteOne();

  return true;
};

/*
 * Smart connection suggestions.
 *
 * Athletes:
 * - other athletes
 * - scouts
 * - clubs
 * - academies
 * - agencies
 *
 * Scouts / organizations:
 * - athletes
 */
const getSuggestions = async (
  userId,
  limit = 12
) => {
  const currentUser =
    await User.findById(userId);

  if (!currentUser) {
    const error = new Error(
      "User not found"
    );

    error.statusCode = 404;

    throw error;
  }

  const existing =
    await Connection.find({
      $or: [
        { requester: userId },
        { recipient: userId },
      ],
      status: {
        $in: [
          "PENDING",
          "ACCEPTED",
        ],
      },
    });

  const excludedIds = new Set([
    userId.toString(),
  ]);

  existing.forEach((connection) => {
    excludedIds.add(
      connection.requester.toString()
    );

    excludedIds.add(
      connection.recipient.toString()
    );
  });

  let candidateRoles;

  if (currentUser.role === "ATHLETE") {
    candidateRoles = [
      "ATHLETE",
      "SCOUT",
      "CLUB",
      "ACADEMY",
      "AGENCY",
    ];
  } else {
    candidateRoles = ["ATHLETE"];
  }

  const users =
    await User.find({
      _id: {
        $nin: Array.from(
          excludedIds
        ),
      },
      role: {
        $in: candidateRoles,
      },
      isActive: true,
      isDeleted: false,
      accountStatus: "ACTIVE",
    })
      .select(
        "firstName lastName username avatar role identityVerification"
      )
      .limit(
        Math.max(
          Number(limit) || 12,
          12
        )
      );

  const athleteIds = users
    .filter(
      (u) => u.role === "ATHLETE"
    )
    .map((u) => u._id);

  const profiles =
    await AthleteProfile.find({
      user: {
        $in: athleteIds,
      },
      searchable: true,
      visibility: "PUBLIC",
    }).select(
      "user primarySport position playingLevel location profileCompletion availability"
    );

  const profileMap = new Map(
    profiles.map((p) => [
      p.user.toString(),
      p,
    ])
  );

  return users
    .map((user) => {
      const profile =
        profileMap.get(
          user._id.toString()
        );

      let reason = "People you may know";

      if (user.role === "SCOUT") {
        reason =
          "Scout in the sports community";
      } else if (
        user.role === "CLUB" ||
        user.role === "ACADEMY" ||
        user.role === "AGENCY"
      ) {
        reason =
          "Sports organization";
      } else if (profile) {
        reason = `${profile.primarySport} athlete`;
      }

      return {
        user,
        profile: profile || null,
        reason,
      };
    })
    .slice(0, Number(limit) || 12);
};

export {
  requestConnection,
  getConnections,
  acceptConnection,
  rejectConnection,
  removeConnection,
  getSuggestions,
};