import { z } from "zod";

export const UserRoleSchema = z.enum([
  "government",
  "ngo",
  "responder",
  "farmer",
  "health_worker",
  "citizen",
]);

export const RegisterSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  full_name: z.string().min(2, "Full name must be at least 2 characters long"),
  role: UserRoleSchema,
});

export const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const OnboardingSchema = z.object({
  role: UserRoleSchema.optional(),
  country: z.string().min(1, "Country is required"),
  region: z.string().min(1, "Region is required"),
  district: z.string().optional(),
  phone_number: z.string().optional(),
  interests: z.array(z.string()).default([]),
  notification_email: z.boolean().default(true),
  notification_sms: z.boolean().default(false),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type OnboardingInput = z.infer<typeof OnboardingSchema>;
