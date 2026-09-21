import {
  submitVerification,
  getMyVerifications,
  getPendingVerifications,
  reviewVerification,
} from "../services/verification.service.js";

const submit = async (
  req,
  res
) => {
  const verification =
    await submitVerification(
      req.user,
      req.body,
      req
    );

  res.status(201).json({
    success: true,
    message:
      "Verification request submitted successfully",
    data: {
      verification,
    },
  });
};

const getMine = async (
  req,
  res
) => {
  const verifications =
    await getMyVerifications(
      req.user._id
    );

  res.status(200).json({
    success: true,
    message:
      "Verification requests fetched successfully",
    data: {
      verifications,
    },
  });
};

const getPending = async (
  req,
  res
) => {
  const verifications =
    await getPendingVerifications();

  res.status(200).json({
    success: true,
    message:
      "Pending verification requests fetched successfully",
    data: {
      verifications,
    },
  });
};

const review = async (
  req,
  res
) => {
  const verification =
    await reviewVerification(
      req.params.id,
      req.user,
      req.body,
      req
    );

  res.status(200).json({
    success: true,
    message:
      "Verification request reviewed successfully",
    data: {
      verification,
    },
  });
};

export {
  submit,
  getMine,
  getPending,
  review,
};