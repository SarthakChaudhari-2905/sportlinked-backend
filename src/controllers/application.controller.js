import {
  createApplication,
  getMyApplications,
  getApplicationById,
  getEventApplications,
  updateApplicationStatus,
  withdrawApplication,
} from "../services/application.service.js";

export const create = async (req, res) => {
  const application =
    await createApplication(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message: "Application submitted successfully",
    data: application,
  });
};

export const getMine = async (req, res) => {
  const applications =
    await getMyApplications(
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const getById = async (req, res) => {
  const application =
    await getApplicationById(
      req.params.id,
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: application,
  });
};

export const getForEvent = async (
  req,
  res
) => {
  const applications =
    await getEventApplications(
      req.user._id,
      req.params.eventId,
      req.query.status
    );

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const updateStatus = async (
  req,
  res
) => {
  const application =
    await updateApplicationStatus(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Application status updated successfully",
    data: application,
  });
};

export const withdraw = async (
  req,
  res
) => {
  const application =
    await withdrawApplication(
      req.user._id,
      req.params.id
    );

  res.status(200).json({
    success: true,
    message:
      "Application withdrawn successfully",
    data: application,
  });
};