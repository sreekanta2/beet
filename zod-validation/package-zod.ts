import { z } from "zod";

export const PackageSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  description: z.string().optional(),
  image: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .or(z.literal("")),
  price: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "Price must be a number" })
      .positive({ message: "Price must be greater than 0" })
  ),
  initialEarn: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "initialEarn must be a number" })
      .positive({ message: "initialEarn must be greater than 0" })
  ),
  adLimit: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "Ad limit must be a number" })
      .int()
      .positive({ message: "Ad limit must be greater than 0" })
      .default(5)
  ),
  rewardPerAd: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "Reward per ad must be a number" })
      .positive({ message: "Reward per ad must be greater than 0" })
      .default(1)
  ),
});

export type PackageFormData = z.infer<typeof PackageSchema>;
