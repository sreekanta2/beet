import prisma from "@/lib/db";
import { z } from "zod";

// ✅ Zod schema for validation
const mobileBankingSchema = z.object({
  userId: z.string(),
  name: z.string().min(1, "Service name is required"),
  number: z.string().min(10, "Phone number must be valid"),
});

// Create / Add Service
export async function addService(data: z.infer<typeof mobileBankingSchema>) {
  const parsed = mobileBankingSchema.parse(data);
  const service = await prisma.mobileBankingService.create({
    data: parsed,
  });
  return { success: true, service };
}

// Get all services for a user
export async function getServices(userId: string) {
  const services = await prisma.mobileBankingService.findMany({
    where: { userId },
    select: {
      id: true,
      name: true, // optional — add any mobile service fields you want
      number: true,
      createdAt: true,
      user: {
        select: {
          id: true,
          totalBalance: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  return services;
}

// Update Service
export async function updateService(
  id: string,
  data: Partial<z.infer<typeof mobileBankingSchema>>
) {
  if (!data.name && !data.number) {
    return { success: false, error: "Nothing to update" };
  }

  const service = await prisma.mobileBankingService.update({
    where: { id },
    data,
  });
  return { success: true, service };
}

// Delete Service
export async function deleteService(id: string) {
  await prisma.mobileBankingService.delete({ where: { id } });
  return { success: true };
}
