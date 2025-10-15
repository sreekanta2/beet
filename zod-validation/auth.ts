import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Your email is required." }),
  password: z.string({ required_error: "Please enter your password" }),
});

// ✅ Define Zod Schema
export const registerSchema = z
  .object({
    country: z.string().min(1, "Country is required"),
    reference: z.string().optional(),
    role: z.enum(["user", "admin", "shoper"]),

    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    telephone: z
      .string()
      .min(6, "Telephone must be at least 6 digits")
      .regex(/^[0-9+\-\s()]+$/, "Invalid telephone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
    subscribe: z.enum(["yes", "no"]).default("no"),
    agree: z.boolean().refine((v) => v === true, {
      message: "You must agree to the Privacy Policy",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
export const EmailSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export const ResetPasswordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
