import Achievement from "../models/Achievement.js";

const createAchievement = async (
  userId,
  data
) => {
  return Achievement.create({
    athlete: userId,
    ...data,
    achievementDate:
      new Date(data.achievementDate),
  });
};

const getMyAchievements = async (
  userId
) => {
  return Achievement.find({
    athlete: userId,
  }).sort({
    achievementDate: -1,
  });
};

const getPublicAchievements = async (
  userId
) => {
  return Achievement.find({
    athlete: userId,
    isPublic: true,
  }).sort({
    achievementDate: -1,
  });
};

const updateAchievement = async (
  userId,
  achievementId,
  data
) => {
  const achievement =
    await Achievement.findOne({
      _id: achievementId,
      athlete: userId,
    });

  if (!achievement) {
    const error = new Error(
      "Achievement not found"
    );

    error.statusCode = 404;

    throw error;
  }

  Object.assign(
    achievement,
    data
  );

  if (data.achievementDate) {
    achievement.achievementDate =
      new Date(data.achievementDate);
  }

  await achievement.save();

  return achievement;
};

const deleteAchievement = async (
  userId,
  achievementId
) => {
  const achievement =
    await Achievement.findOneAndDelete({
      _id: achievementId,
      athlete: userId,
    });

  if (!achievement) {
    const error = new Error(
      "Achievement not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return achievement;
};

export {
  createAchievement,
  getMyAchievements,
  getPublicAchievements,
  updateAchievement,
  deleteAchievement,
};