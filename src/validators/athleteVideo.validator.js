import { z } from "zod";

const createAthleteVideoSchema =
  z.object({
    title: z
      .string()
      .trim()
      .min(2)
      .max(200),

    description: z
      .string()
      .trim()
      .max(1000)
      .optional(),

    videoUrl: z
      .string()
      .url(),

    thumbnailUrl: z
      .string()
      .url()
      .optional(),

    videoPublicId: z
      .string()
      .max(300)
      .optional(),

    sport: z
      .string()
      .trim()
      .min(2)
      .max(50),

    category: z
      .enum([
        "MATCH_HIGHLIGHT",
        "TRAINING",
        "SKILLS",
        "FULL_MATCH",
        "INTERVIEW",
        "OTHER",
      ])
      .optional(),

    position: z
      .string()
      .trim()
      .max(100)
      .optional(),

    durationSeconds: z
      .number()
      .min(0)
      .optional(),

    matchName: z
      .string()
      .trim()
      .max(200)
      .optional(),

    opponent: z
      .string()
      .trim()
      .max(200)
      .optional(),

    eventDate: z
      .string()
      .datetime()
      .optional(),

    visibility: z
      .enum([
        "PUBLIC",
        "CONNECTIONS",
        "PRIVATE",
      ])
      .optional(),
  });

const updateAthleteVideoSchema =
  createAthleteVideoSchema.partial();

export {
  createAthleteVideoSchema,
  updateAthleteVideoSchema,
};