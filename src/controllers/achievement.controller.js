import {
  createAchievement,
  getMyAchievements,
  getPublicAchievements,
  updateAchievement,
  deleteAchievement,
} from "../services/achievement.service.js";

const create = async (req, res) => {
  const achievement =
    await createAchievement(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Achievement added successfully",
    data: {
      achievement,
    },
  });
};

const getMine = async (req, res) => {
  const achievements =
    await getMyAchievements(
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: {
      achievements,
    },
  });
};

const getPublic = async (
  req,
  res
) => {
  const achievements =
    await getPublicAchievements(
      req.params.userId
    );

  res.status(200).json({
    success: true,
    data: {
      achievements,
    },
  });
};

const update = async (
  req,
  res
) => {
  const achievement =
    await updateAchievement(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Achievement updated successfully",
    data: {
      achievement,
    },
  });
};

const remove = async (
  req,
  res
) => {
  await deleteAchievement(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message:
      "Achievement deleted successfully",
  });
};

export {
  create,
  getMine,
  getPublic,
  update,
  remove,
};