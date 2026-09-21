import {
  createCertificate,
  getMyCertificates,
  getPublicCertificates,
  updateCertificate,
  deleteCertificate,
} from "../services/certificate.service.js";

const create = async (req, res) => {
  const certificate =
    await createCertificate(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Certificate added successfully",
    data: {
      certificate,
    },
  });
};

const getMine = async (req, res) => {
  const certificates =
    await getMyCertificates(
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: {
      certificates,
    },
  });
};

const getPublic = async (
  req,
  res
) => {
  const certificates =
    await getPublicCertificates(
      req.params.userId
    );

  res.status(200).json({
    success: true,
    data: {
      certificates,
    },
  });
};

const update = async (
  req,
  res
) => {
  const certificate =
    await updateCertificate(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Certificate updated successfully",
    data: {
      certificate,
    },
  });
};

const remove = async (
  req,
  res
) => {
  await deleteCertificate(
    req.user._id,
    req.params.id
  );

  res.status(200).json({
    success: true,
    message:
      "Certificate deleted successfully",
  });
};

export {
  create,
  getMine,
  getPublic,
  update,
  remove,
};