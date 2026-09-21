import { z } from "zod";

const submitVerificationSchema =
  z.object({
    type: z.enum([
      "IDENTITY",
      "ATHLETE",
      "ORGANIZATION",
      "CERTIFICATE",
    ]),

    provider: z
      .string()
      .trim()
      .max(100)
      .optional(),

    providerReference: z
      .string()
      .trim()
      .max(200)
      .optional(),

    reviewNotes: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  });

const reviewVerificationSchema =
  z.object({
    status: z.enum([
      "APPROVED",
      "REJECTED",
    ]),

    rejectionReason: z
      .string()
      .trim()
      .max(500)
      .optional(),

    reviewNotes: z
      .string()
      .trim()
      .max(1000)
      .optional(),
  });

export {
  submitVerificationSchema,
  reviewVerificationSchema,
};