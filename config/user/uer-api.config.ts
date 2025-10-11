import prisma from "@/lib/db";
import { User } from "@prisma/client";
export async function getUserByTelephone(
  telephone: string
): Promise<User | null> {
  return prisma.user.findUnique({
    where: { telephone },
  });
}
