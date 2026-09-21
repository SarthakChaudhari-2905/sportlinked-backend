import { z } from "zod";

const createAchievementSchema = z.object({
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

  sport: z
    .string()
    .trim()
    .min(2)
    .max(50),

  category: z
    .enum([
      "TOURNAMENT",
      "MEDAL",
      "AWARD",
      "RECORD",
      "CHAMPIONSHIP",
      "OTHER",
    ])
    .optional(),

  position: z
    .string()
    .trim()
    .max(100)
    .optional(),

  organization: z
    .string()
    .trim()
    .max(200)
    .optional(),

  achievementDate: z
    .string()
    .datetime(),

  rank: z
    .number()
    .int()
    .min(1)
    .optional(),

  mediaUrl: z
    .string()
    .url()
    .optional(),

  isPublic: z
    .boolean()
    .optional(),
});

const updateAchievementSchema =
  createAchievementSchema.partial();

export {
  createAchievementSchema,
  updateAchievementSchema,
};