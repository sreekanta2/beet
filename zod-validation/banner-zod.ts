import { z } from "zod";

export const BannerSchema = z.object({
  name: z.string().min(1, { message: "User ID is required" }),
  url: z.string().url({ message: "Invalid url format" }),
});
