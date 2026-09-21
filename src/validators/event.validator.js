import { z } from "zod";

const createEventSchema = z.object({
  organizationId: z
    .string()
    .min(1),

  title: z
    .string()
    .trim()
    .min(2)
    .max(200),

  description: z
    .string()
    .trim()
    .max(3000)
    .optional(),

  type: z.enum([
    "MATCH",
    "TRIAL",
    "TOURNAMENT",
    "TRAINING",
    "CAMP",
    "SCOUTING_SESSION",
    "OTHER",
  ]),

  sport: z
    .string()
    .trim()
    .min(2)
    .max(50),

  positionsRequired: z
    .array(
      z.string().trim().max(100)
    )
    .max(30)
    .optional(),

  eligibility: z
    .object({
      minimumAge: z
        .number()
        .int()
        .min(5)
        .max(100)
        .optional(),

      maximumAge: z
        .number()
        .int()
        .min(5)
        .max(100)
        .optional(),

      gender: z
        .enum([
          "MALE",
          "FEMALE",
          "MIXED",
          "ANY",
        ])
        .optional(),

      playingLevels: z
        .array(
          z.enum([
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
        )
        .optional(),
    })
    .optional(),

  startDate: z
    .string()
    .datetime(),

  endDate: z
    .string()
    .datetime()
    .optional(),

  registrationDeadline: z
    .string()
    .datetime(),

  location: z
    .object({
      venueName: z
        .string()
        .trim()
        .max(200)
        .optional(),

      address: z
        .string()
        .trim()
        .max(500)
        .optional(),

      city: z
        .string()
        .trim()
        .max(100)
        .optional(),

      state: z
        .string()
        .trim()
        .max(100)
        .optional(),

      country: z
        .string()
        .trim()
        .max(100)
        .optional(),

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

  capacity: z
    .number()
    .int()
    .min(1)
    .optional(),

  registrationFee: z
    .object({
      amount: z
        .number()
        .min(0),

      currency: z
        .string()
        .length(3)
        .default("INR"),
    })
    .optional(),

  visibility: z
    .enum([
      "PUBLIC",
      "PRIVATE",
    ])
    .optional(),

  bannerUrl: z
    .string()
    .url()
    .optional(),

  contactEmail: z
    .string()
    .email()
    .optional(),

  contactPhone: z
    .string()
    .max(30)
    .optional(),
});

const updateEventSchema =
  createEventSchema
    .omit({
      organizationId: true,
    })
    .partial();

export {
  createEventSchema,
  updateEventSchema,
};