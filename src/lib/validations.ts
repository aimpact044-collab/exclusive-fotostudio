import { z } from "zod";

import { EVENT_TYPES } from "@/lib/constants";

/**
 * Shared validation for the public contact form. Only `phone` is required —
 * every other field is optional, per the studio's request to keep the form
 * as low-friction as possible for prospective clients.
 */
export const contactFormSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  phone: z.string().trim().min(6, "required").max(40),
  eventType: z.enum(EVENT_TYPES).optional(),
  eventDate: z.string().trim().optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;
