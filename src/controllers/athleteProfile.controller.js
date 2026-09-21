import {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
  searchAthleteProfiles,
} from "../services/athleteProfile.service.js";

// ==========================================
// CREATE
// ==========================================

const create = async (
  req,
  res
) => {
  const profile =
    await createProfile(
      req.user,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Athlete profile created successfully",
    data: {
      profile,
    },
  });
};

// ==========================================
// GET MY PROFILE
// ==========================================

const getMine = async (
  req,
  res
) => {
  const profile =
    await getMyProfile(
      req.user._id
    );

  res.status(200).json({
    success: true,
    message:
      "Athlete profile fetched successfully",
    data: {
      profile,
    },
  });
};

// ==========================================
// UPDATE
// ==========================================

const update = async (
  req,
  res
) => {
  const profile =
    await updateProfile(
      req.user._id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Athlete profile updated successfully",
    data: {
      profile,
    },
  });
};

// ==========================================
// PUBLIC PROFILE
// ==========================================

const getPublic = async (
  req,
  res
) => {
  const profile =
    await getPublicProfile(
      req.params.userId
    );

  res.status(200).json({
    success: true,
    message:
      "Public athlete profile fetched successfully",
    data: {
      profile,
    },
  });
};

// ==========================================
// SEARCH / DISCOVERY
// ==========================================

const search = async (
  req,
  res
) => {
  const {
    sport,
    level,
    city,
    excludeSelf,
    limit,
    page,
  } = req.query;

  const result = await searchAthleteProfiles({
    sport,
    level,
    city,
    limit,
    page,
    excludeUserId:
      excludeSelf === "true" ? req.user?._id : undefined,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};

export {
  create,
  getMine,
  update,
  getPublic,
  search,
};

