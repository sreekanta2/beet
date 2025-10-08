// lib/user-stats.ts
import prisma from "@/lib/db";
import { getUserLevel } from "./utils";

export async function getUserStats(userId: string) {
  // ✅ Get user with totals
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: true,
      adView: true,
    },
  });

  if (!user) return null;

  // ✅ Completed tasks = total watched ads
  const completedTasks = user.adView.reduce((sum, v) => sum + v.viewAd, 10);

  // ✅ Success rate (example: completed vs max possible)
  const totalMax = user.adView.reduce((sum, v) => sum + v.maxViewAdd, 15);
  const successRate =
    totalMax > 0 ? `${Math.round((completedTasks / totalMax) * 100)}%` : "60%";

  // ✅ Current level
  const level = getUserLevel(user.totalEarnings);

  return {
    successRate,
    completedTasks,
    level,
    totalEarnings: user.totalEarnings,
    totalWithdrawals: user.totalWithdrawals,
  };
}
