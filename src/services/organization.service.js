import Organization from "../models/Organization.js";
import OrganizationMember from "../models/OrganizationMember.js";

const createOrganization = async (
  userId,
  data
) => {
  const existing =
    await Organization.findOne({
      slug: data.slug,
    });

  if (existing) {
    const error = new Error(
      "Organization slug already exists"
    );

    error.statusCode = 409;

    throw error;
  }

  const organization =
    await Organization.create(data);

  await OrganizationMember.create({
    organization: organization._id,
    user: userId,
    role: "OWNER",
    status: "ACTIVE",
    joinedAt: new Date(),
  });

  organization.memberCount = 1;

  await organization.save();

  return organization;
};

const getOrganizationById = async (
  organizationId
) => {
  const organization =
    await Organization.findOne({
      _id: organizationId,
      isPublic: true,
    });

  if (!organization) {
    const error = new Error(
      "Organization not found"
    );

    error.statusCode = 404;

    throw error;
  }

  return organization;
};

const getMyOrganizations = async (
  userId
) => {
  const memberships =
    await OrganizationMember.find({
      user: userId,
      status: "ACTIVE",
    }).populate(
      "organization"
    );

  return memberships;
};

const updateOrganization = async (
  userId,
  organizationId,
  data
) => {
  const membership =
    await OrganizationMember.findOne({
      organization: organizationId,
      user: userId,
      role: {
        $in: [
          "OWNER",
          "ADMIN",
        ],
      },
      status: "ACTIVE",
    });

  if (!membership) {
    const error = new Error(
      "You do not have permission to update this organization"
    );

    error.statusCode = 403;

    throw error;
  }

  const organization =
    await Organization.findById(
      organizationId
    );

  if (!organization) {
    const error = new Error(
      "Organization not found"
    );

    error.statusCode = 404;

    throw error;
  }

  Object.assign(
    organization,
    data
  );

  await organization.save();

  return organization;
};

const addMember = async (
  ownerId,
  organizationId,
  userId,
  role
) => {
  const owner =
    await OrganizationMember.findOne({
      organization: organizationId,
      user: ownerId,
      role: {
        $in: [
          "OWNER",
          "ADMIN",
        ],
      },
      status: "ACTIVE",
    });

  if (!owner) {
    const error = new Error(
      "You do not have permission to add members"
    );

    error.statusCode = 403;

    throw error;
  }

  const existing =
    await OrganizationMember.findOne({
      organization: organizationId,
      user: userId,
    });

  if (existing) {
    const error = new Error(
      "User is already a member"
    );

    error.statusCode = 409;

    throw error;
  }

  const member =
    await OrganizationMember.create({
      organization: organizationId,
      user: userId,
      role: role || "STAFF",
      status: "ACTIVE",
      joinedAt: new Date(),
    });

  await Organization.findByIdAndUpdate(
    organizationId,
    {
      $inc: {
        memberCount: 1,
      },
    }
  );

  return member;
};

export {
  createOrganization,
  getOrganizationById,
  getMyOrganizations,
  updateOrganization,
  addMember,
};

// ==========================================
// SEARCH / DISCOVER ORGANIZATIONS (public)
// ==========================================

const searchOrganizations = async ({
  type,
  sport,
  city,
  limit,
  page,
} = {}) => {
  const query = {
    isPublic: true,
  };

  if (type) {
    query.type = type.toUpperCase();
  }

  if (sport) {
    query.sports = sport.toLowerCase();
  }

  if (city) {
    query["location.city"] = new RegExp(city, "i");
  }

  const pageSize = Math.min(
    Number(limit) || 20,
    50
  );

  const pageNumber = Math.max(
    Number(page) || 1,
    1
  );

  const [organizations, total] = await Promise.all([
    Organization.find(query)
      .sort({ verificationStatus: -1, name: 1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Organization.countDocuments(query),
  ]);

  return {
    organizations,
    total,
    page: pageNumber,
    pages: Math.ceil(total / pageSize) || 1,
  };
};

export { searchOrganizations };

