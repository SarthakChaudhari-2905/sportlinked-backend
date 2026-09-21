import { z } from "zod";

const createOrganizationSchema =
  z.object({
    name: z
      .string()
      .trim()
      .min(2)
      .max(200),

    slug: z
      .string()
      .trim()
      .min(2)
      .max(100)
      .regex(
        /^[a-z0-9-]+$/,
        "Slug can only contain lowercase letters, numbers and hyphens"
      ),

    type: z.enum([
      "CLUB",
      "ACADEMY",
      "AGENCY",
      "SPORTS_ASSOCIATION",
      "EVENT_ORGANIZER",
    ]),

    description: z
      .string()
      .trim()
      .max(2000)
      .optional(),

    logoUrl: z
      .string()
      .url()
      .optional(),

    coverImageUrl: z
      .string()
      .url()
      .optional(),

    sports: z
      .array(
        z
          .string()
          .trim()
          .min(2)
          .max(50)
      )
      .min(1)
      .max(20),

    email: z
      .string()
      .email()
      .optional(),

    phone: z
      .string()
      .trim()
      .max(30)
      .optional(),

    website: z
      .string()
      .url()
      .optional(),

    location: z
      .object({
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

    isPublic: z
      .boolean()
      .optional(),

    searchable: z
      .boolean()
      .optional(),
  });

const updateOrganizationSchema =
  createOrganizationSchema.partial();

export {
  createOrganizationSchema,
  updateOrganizationSchema,
};