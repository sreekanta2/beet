import { z } from "zod";

export const transactionSchema = z.object({
  id: z.string().cuid().optional(),
  userId: z.string().min(1, { message: "User ID is required" }),
  type: z.enum(["deposit", "withdrawal"]), // or adjust as needed
  amount: z.preprocess(
    (val) => Number(val),
    z
      .number({ invalid_type_error: "Price must be a number" })
      .positive({ message: "Price must be greater than 0" })
  ),
  bankName: z.string(),
  number: z.string().optional(),
  purl: z.string().url().optional(),
  mobileNumberId: z.string().optional(),
  trnId: z.string(),
  status: z.enum(["pending", "completed", "failed"]).optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});
export type TransactionFormData = z.infer<typeof transactionSchema>;
