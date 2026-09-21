import { z } from "zod";

const createCertificateSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2)
    .max(200),

  issuingOrganization: z
    .string()
    .trim()
    .min(2)
    .max(200),

  category: z
    .enum([
      "SPORTS",
      "COACHING",
      "TOURNAMENT",
      "FITNESS",
      "EDUCATION",
      "OTHER",
    ])
    .optional(),

  sport: z
    .string()
    .trim()
    .min(2)
    .max(50),

  issueDate: z
    .string()
    .datetime(),

  expiryDate: z
    .string()
    .datetime()
    .optional(),

  certificateNumber: z
    .string()
    .trim()
    .max(100)
    .optional(),

  description: z
    .string()
    .trim()
    .max(1000)
    .optional(),

  documentUrl: z
    .string()
    .url()
    .optional(),

  documentPublicId: z
    .string()
    .max(300)
    .optional(),

  isPublic: z
    .boolean()
    .optional(),
});

const updateCertificateSchema =
  createCertificateSchema.partial();

export {
  createCertificateSchema,
  updateCertificateSchema,
};