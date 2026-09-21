import {
  createVideo,
  getMyVideos,
  getPublicVideos,
  updateVideo,
  deleteVideo,
  incrementViews,
} from "../services/athleteVideo.service.js";

const create = async (
  req,
  res
) => {
  const video =
    await createVideo(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Athlete video added successfully",
    data: {
      video,
    },
  });
};

const getMine = async (
  req,
  res
) => {
  const videos =
    await getMyVideos(
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: {
      videos,
    },
  });
};

const getPublic = async (
  req,
  res
) => {
  const videos =
    await getPublicVideos(
      req.params.userId
    );

  res.status(200).json({
    success: true,
    data: {
      videos,
    },
  });
};

const update = async (
  req,
  res
) => {
  const video =
    await updateVideo(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Video updated successfully",
    data: {
      video,
    },
  });
};

const remove = async (
  req,
  res
) => {
  await deleteVideo(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message:
      "Video deleted successfully",
  });
};

const view = async (
  req,
  res
) => {
  const video =
    await incrementViews(
      req.params.id
    );

  if (!video) {
    return res.status(404).json({
      success: false,
      message: "Video not found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      video,
    },
  });
};

export {
  create,
  getMine,
  getPublic,
  update,
  remove,
  view,
};