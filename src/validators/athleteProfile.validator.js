import { z } from "zod";

const createAthleteProfileSchema =
  z.object({
    dateOfBirth: z
      .string()
      .datetime()
      .optional(),

    gender: z
      .enum([
        "MALE",
        "FEMALE",
        "OTHER",
        "PREFER_NOT_TO_SAY",
      ])
      .optional(),

    bio: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    primarySport: z
      .string()
      .trim()
      .min(
        2,
        "Primary sport is required"
      )
      .max(50),

    secondarySports: z
      .array(
        z
          .string()
          .trim()
          .max(50)
      )
      .max(5)
      .optional(),

    position: z
      .string()
      .trim()
      .max(50)
      .optional(),

    secondaryPosition: z
      .string()
      .trim()
      .max(50)
      .optional(),

    heightCm: z
      .number()
      .min(50)
      .max(250)
      .optional(),

    weightKg: z
      .number()
      .min(10)
      .max(300)
      .optional(),

    preferredFoot: z
      .enum([
        "LEFT",
        "RIGHT",
        "BOTH",
        "NOT_APPLICABLE",
      ])
      .optional(),

    yearsOfExperience: z
      .number()
      .min(0)
      .max(80)
      .optional(),

    playingLevel: z
      .enum([
        "BEGINNER",
        "AMATEUR",
        "SCHOOL",
        "COLLEGE",
        "DISTRICT",
        "STATE",
        "NATIONAL",
        "INTERNATIONAL",
        "PROFESSIONAL",
      ])
      .optional(),

    location: z
      .object({
        city: z.string().trim().max(100).optional(),
        state: z.string().trim().max(100).optional(),
        country: z.string().trim().max(100).optional(),

        coordinates: z
          .object({
            type: z.literal("Point"),
            coordinates: z
              .array(z.number())
              .length(2),
          })
          .optional(),
      })
      .optional(),

    availability: z
      .object({
        status: z.enum([
          "AVAILABLE",
          "OPEN_TO_OPPORTUNITIES",
          "NOT_AVAILABLE",
        ]).optional(),

        availableFrom: z
          .string()
          .datetime()
          .optional(),

        preferredSessionTypes: z
          .array(
            z.enum([
              "TRIAL",
              "MATCH",
              "TRAINING",
              "CAMP",
              "TOURNAMENT",
              "OTHER",
            ])
          )
          .optional(),
      })
      .optional(),

    socialLinks: z
      .object({
        instagram: z.string().url().optional(),
        youtube: z.string().url().optional(),
        linkedin: z.string().url().optional(),
        website: z.string().url().optional(),
      })
      .optional(),

    visibility: z
      .enum([
        "PUBLIC",
        "CONNECTIONS",
        "PRIVATE",
      ])
      .optional(),

    searchable: z
      .boolean()
      .optional(),
  });

const updateAthleteProfileSchema =
  createAthleteProfileSchema.partial();

export {
  createAthleteProfileSchema,
  updateAthleteProfileSchema,
};