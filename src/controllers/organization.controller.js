import {
  createOrganization,
  getOrganizationById,
  getMyOrganizations,
  updateOrganization,
  addMember,
  searchOrganizations,
} from "../services/organization.service.js";

const create = async (
  req,
  res
) => {
  const organization =
    await createOrganization(
      req.user._id,
      req.body
    );

  res.status(201).json({
    success: true,
    message:
      "Organization created successfully",
    data: {
      organization,
    },
  });
};

const getById = async (
  req,
  res
) => {
  const organization =
    await getOrganizationById(
      req.params.id
    );

  res.status(200).json({
    success: true,
    data: {
      organization,
    },
  });
};

const getMine = async (
  req,
  res
) => {
  const organizations =
    await getMyOrganizations(
      req.user._id
    );

  res.status(200).json({
    success: true,
    data: {
      organizations,
    },
  });
};

const update = async (
  req,
  res
) => {
  const organization =
    await updateOrganization(
      req.user._id,
      req.params.id,
      req.body
    );

  res.status(200).json({
    success: true,
    message:
      "Organization updated successfully",
    data: {
      organization,
    },
  });
};

const addOrganizationMember =
  async (
    req,
    res
  ) => {
    const member =
      await addMember(
        req.user._id,
        req.params.id,
        req.body.userId,
        req.body.role
      );

    res.status(201).json({
      success: true,
      message:
        "Organization member added successfully",
      data: {
        member,
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
    type,
    sport,
    city,
    limit,
    page,
  } = req.query;

  const result = await searchOrganizations({
    type,
    sport,
    city,
    limit,
    page,
  });

  res.status(200).json({
    success: true,
    data: result,
  });
};

export {
  create,
  getById,
  getMine,
  update,
  addOrganizationMember,
  search,
};

