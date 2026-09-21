import AthleteVideo from "../models/AthleteVideo.js";

const createVideo = async (
  userId,
  data
) => {
  return AthleteVideo.create({
    athlete: userId,
    ...data,
    eventDate: data.eventDate
      ? new Date(data.eventDate)
      : null,
  });
};

const getMyVideos = async (
  userId
) => {
  return AthleteVideo.find({
    athlete: userId,
  }).sort({
    createdAt: -1,
  });
};

const getPublicVideos = async (
  userId
) => {
  return AthleteVideo.find({
    athlete: userId,
    visibility: "PUBLIC",
  }).sort({
    isFeatured: -1,
    createdAt: -1,
  });
};

const updateVideo = async (
  userId,
  videoId,
  data
) => {
  const video =
    await AthleteVideo.findOne({
      _id: videoId,
      athlete: userId,
    });

  if (!video) {
    const error = new Error(
      "Video not found"
    );

    error.statusCode = 404;

    throw error;
  }

  Object.assign(video, data);

  if (data.eventDate) {
    video.eventDate =
      new Date(data.eventDate);
  }

  await video.save();

  return video;
};

const deleteVideo = async (
  userId,
  videoId
) => {
  const video =
    await AthleteVideo.findOneAndDelete({
      _id: videoId,
      athlete: userId,
    });

  if (!video) {
    const error = new Error(
      "Video not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return video;
};

const incrementViews = async (
  videoId
) => {
  return AthleteVideo.findByIdAndUpdate(
    videoId,
    {
      $inc: {
        views: 1,
      },
    },
    {
      new: true,
    }
  );
};

export {
  createVideo,
  getMyVideos,
  getPublicVideos,
  updateVideo,
  deleteVideo,
  incrementViews,
};