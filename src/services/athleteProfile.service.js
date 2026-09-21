import AthleteProfile from "../models/AthleteProfile.js";
import User from "../models/User.js";

const calculateProfileCompletion = (
  profile
) => {
  const checks = [
    Boolean(profile.dateOfBirth),
    Boolean(profile.gender),
    Boolean(profile.bio),
    Boolean(profile.primarySport),
    Boolean(profile.position),
    Boolean(profile.heightCm),
    Boolean(profile.weightKg),
    Boolean(profile.playingLevel),
    Boolean(profile.location?.city),
    Boolean(profile.location?.state),
    Boolean(
      profile.yearsOfExperience !==
        undefined
    ),
    Boolean(profile.socialLinks?.instagram),
    Boolean(profile.socialLinks?.youtube),
    Boolean(profile.availability?.status),
  ];

  const completed =
    checks.filter(Boolean).length;

  return Math.round(
    (completed / checks.length) *
      100
  );
};

// ==========================================
// CREATE PROFILE
// ==========================================

const createProfile = async (
  user,
  data
) => {
  const existing =
    await AthleteProfile.findOne({
      user: user._id,
    });

  if (existing) {
    const error = new Error(
      "Athlete profile already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  const profile =
    await AthleteProfile.create({
      user: user._id,
      ...data,
      profileCompletion:
        calculateProfileCompletion(
          data
        ),
    });

  await User.findByIdAndUpdate(
    user._id,
    {
      profileCompleted: true,
    }
  );

  return profile;
};

// ==========================================
// GET MY PROFILE
// ==========================================

const getMyProfile = async (
  userId
) => {
  const profile =
    await AthleteProfile.findOne({
      user: userId,
    }).populate(
      "user",
      "firstName lastName username email phone avatar role identityVerification"
    );

  if (!profile) {
    const error = new Error(
      "Athlete profile not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return profile;
};

// ==========================================
// UPDATE PROFILE
// ==========================================

const updateProfile = async (
  userId,
  data
) => {
  const profile =
    await AthleteProfile.findOne({
      user: userId,
    });

  if (!profile) {
    const error = new Error(
      "Athlete profile not found"
    );

    error.statusCode = 404;

    throw error;
  }

  Object.keys(data).forEach(
    (key) => {
      profile[key] = data[key];
    }
  );

  profile.profileCompletion =
    calculateProfileCompletion(
      profile
    );

  await profile.save();

  return profile;
};

// ==========================================
// GET PUBLIC PROFILE
// ==========================================

const getPublicProfile = async (
  userId
) => {
  const profile =
    await AthleteProfile.findOne({
      user: userId,
      visibility: "PUBLIC",
      searchable: true,
    }).populate(
      "user",
      "firstName lastName username avatar role identityVerification"
    );

  if (!profile) {
    const error = new Error(
      "Public athlete profile not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return profile;
};

export {
  createProfile,
  getMyProfile,
  updateProfile,
  getPublicProfile,
};

// ==========================================
// SEARCH / DISCOVER ATHLETES (public)
// ==========================================

const searchAthleteProfiles = async ({
  sport,
  level,
  city,
  limit,
  page,
  excludeUserId,
} = {}) => {
  const query = {
    searchable: true,
    visibility: "PUBLIC",
  };

  if (sport) {
    query.primarySport = sport.toLowerCase();
  }

  if (level) {
    query.playingLevel = level.toUpperCase();
  }

  if (city) {
    query["location.city"] = new RegExp(city, "i");
  }

  if (excludeUserId) {
    query.user = { $ne: excludeUserId };
  }

  const pageSize = Math.min(
    Number(limit) || 20,
    50
  );

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const [profiles, total] = await Promise.all([
    AthleteProfile.find(query)
      .populate("user", "firstName lastName avatar username identityVerification")
      .sort({ profileCompletion: -1, updatedAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    AthleteProfile.countDocuments(query),
  ]);

  return {
    profiles,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize) || 1,
  };
};

export { searchAthleteProfiles };

