import { z } from "zod";

export const OrderSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  packageId: z.string().min(1, { message: "Package ID is required" }),

  purl: z.string().url("Invalid url").optional(),
  type: z.string().min(1, "order id required"),
  tranId: z.string().min(1, "tranId id required"),
  amount: z.number().min(1, "number is requirent"),
  number: z.string().min(11, { message: "number is requirent" }),
  status: z
    .enum(["pending", "paid", "cancelled"])
    .default("pending")
    .optional(),
});

export type OrderFormData = z.infer<typeof OrderSchema>;
