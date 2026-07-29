import { z } from "zod";
import { REFERRAL_SOURCES, MARKETS } from "@/types/waitlist";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pakistanPhoneRegex = /^(\+92|0)3\d{9}$/;

export const waitlistFormSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(1, "Full name is required")
            .max(100, "Full name must be at most 100 characters"),

        contactMethod: z.enum(["email", "phone"]),

        email: z
            .string()
            .trim()
            .toLowerCase()
            .max(254, "Email must be at most 254 characters")
            .optional(),

        phone: z
            .string()
            .trim()
            .max(15, "Phone number is too long")
            .transform((val) => val.replace(/[\s-]/g, ""))
            .optional(),

        referralSource: z.enum(REFERRAL_SOURCES, {
            error: "Please select a referral source",
        }),

        market: z.enum(MARKETS),
    })
    .superRefine((data, ctx) => {
        if (data.contactMethod === "email") {
            if (!data.email) {
                ctx.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Email is required",
                });
            } else if (!emailRegex.test(data.email)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["email"],
                    message: "Enter a valid email address",
                });
            }
        }

        if (data.contactMethod === "phone") {
            if (!data.phone) {
                ctx.addIssue({
                    code: "custom",
                    path: ["phone"],
                    message: "Phone number is required",
                });
            } else if (!pakistanPhoneRegex.test(data.phone)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["phone"],
                    message: "Enter a valid Pakistani phone number",
                });
            }
        }
    });


export type WaitlistFormValues = z.infer<typeof waitlistFormSchema>;