import Certificate from "../models/Certificate.js";

const createCertificate = async (
  userId,
  data
) => {
  return Certificate.create({
    athlete: userId,
    ...data,
    issueDate: new Date(data.issueDate),
    expiryDate: data.expiryDate
      ? new Date(data.expiryDate)
      : null,
  });
};

const getMyCertificates = async (
  userId
) => {
  return Certificate.find({
    athlete: userId,
  }).sort({
    issueDate: -1,
  });
};

const getPublicCertificates = async (
  userId
) => {
  return Certificate.find({
    athlete: userId,
    isPublic: true,
  }).sort({
    issueDate: -1,
  });
};

const updateCertificate = async (
  userId,
  certificateId,
  data
) => {
  const certificate =
    await Certificate.findOne({
      _id: certificateId,
      athlete: userId,
    });

  if (!certificate) {
    const error = new Error(
      "Certificate not found"
    );

    error.statusCode = 404;

    throw error;
  }

  Object.assign(certificate, data);

  if (data.issueDate) {
    certificate.issueDate =
      new Date(data.issueDate);
  }

  if (data.expiryDate) {
    certificate.expiryDate =
      new Date(data.expiryDate);
  }

  await certificate.save();

  return certificate;
};

const deleteCertificate = async (
  userId,
  certificateId
) => {
  const certificate =
    await Certificate.findOneAndDelete({
      _id: certificateId,
      athlete: userId,
    });

  if (!certificate) {
    const error = new Error(
      "Certificate not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return certificate;
};

export {
  createCertificate,
  getMyCertificates,
  getPublicCertificates,
  updateCertificate,
  deleteCertificate,
};