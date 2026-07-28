import { z } from "zod";

export const waitlistFormSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  contactMethod: z.enum(["email", "phone"]),
  email: z.string().optional(),
  phone: z.string().optional(),
  referralSource: z.string().min(1, "Please select a referral source"),
  market: z.string(),
});