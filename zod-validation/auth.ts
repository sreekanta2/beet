import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Your email is required." }),
  password: z.string({ required_error: "Please enter your password" }),
});

export const RegisterSchema = z
  .object({
    name: z
      .string()
      .min(3, {
        message: "First Name is required .",
      })
      .trim(),

    email: z.string().email({ message: "Your email is invalid." }).trim(),
    password: z.string().min(6, { message: "Password must 6 characters ." }),
    refBy: z.string().optional(),
    confirmPassword: z.string().min(6, {
      message: "Confirm Password must 6 characters .",
    }),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }
  });
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
