import Joi from "joi";

export const createApplicationSchema = Joi.object({
  eventId: Joi.string().hex().length(24).required(),

  position: Joi.string()
    .trim()
    .max(100)
    .allow("", null),

  message: Joi.string()
    .trim()
    .max(2000)
    .allow("", null),

  experience: Joi.string()
    .trim()
    .max(2000)
    .allow("", null),

  achievements: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(500)
    )
    .max(20)
    .default([]),
});

export const updateApplicationStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      "UNDER_REVIEW",
      "SHORTLISTED",
      "SELECTED",
      "REJECTED"
    )
    .required(),

  organizationNote: Joi.string()
    .trim()
    .max(2000)
    .allow("", null),
});