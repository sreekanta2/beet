import prisma from "@/lib/db";
import { evaluateBadges } from "@/lib/evaluate";
import { refBonus } from "@/lib/ref-bonus";
import { BadgeLevel } from "@prisma/client";
import { NextResponse } from "next/server";

// ---------------- Constants ----------------
const DAILY_CLUB_INCOME_RATE = 0.1;
const ROYALTY_INCOME = {
  [BadgeLevel.NONE]: 0,
  [BadgeLevel.SILVER]: 110,
  [BadgeLevel.GOLDEN]: 440,
  [BadgeLevel.PLATINUM]: 1760,
  [BadgeLevel.DIAMOND]: 7040,
};

// ---------------- Handler ----------------
export async function GET(
  req: Request,
  { params }: { params: { telephone: string } }
) {
  const { telephone } = params;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 🧩 1️⃣ Get user & referral structure
      const user = await tx.user.findUnique({
        where: { telephone },
        select: {
          id: true,
          totalBalance: true,
          clubsIncome: true,
          teamIncome: true,
          lastIncomeUpdate: true,
          royaltyIncome: true,
          cachedClubsCount: true,
          clubsBonus: true,
          deposit: true,
          serialNumber: true,
          badgeLevel: true,
          withdraw: { select: { amount: true, status: true } },
          clubs: { select: { id: true } },
          createdAt: true,
          referralCode: true,
          referredBy: {
            select: {
              id: true,
              referredBy: {
                select: {
                  id: true,
                  referredBy: { select: { id: true } },
                },
              },
            },
          },
        },
      });

      if (!user) throw new Error("User not found");

      // 🧩 2️⃣ Build referral chain (up to 4 levels)
      const referrerIds = [
        user?.referredBy?.id,
        user?.referredBy?.referredBy?.id,
        user?.referredBy?.referredBy?.referredBy?.id,
      ].filter(Boolean) as string[];

      // 🧩 3️⃣ Process referral bonuses + badges
      if (referrerIds.length > 0 && user.id) {
        await refBonus(tx, referrerIds, user.id);
        await evaluateBadges(tx, referrerIds, user.id);
      }

      // 🧩 4️⃣ Time difference calculation
      const now = new Date();
      const lastUpdate = user.lastIncomeUpdate || user.createdAt;
      const diffInMs = now.getTime() - new Date(lastUpdate).getTime();
      const diffInSeconds = diffInMs / 1000;
      const daysPassed = Math.floor(diffInSeconds / 86400);

      // 🧩 5️⃣ Initialize values
      let newTotalBalance = user.totalBalance;
      let newClubsIncome = user.clubsIncome;
      let newRoyaltyIncome = user.royaltyIncome;

      const clubCount = user.clubs.length;
      const dailyClubIncome = clubCount * DAILY_CLUB_INCOME_RATE;

      // 🧩 6️⃣ Apply daily club + royalty income (if full days passed)
      if (daysPassed >= 1) {
        const totalClubGain = dailyClubIncome * daysPassed;
        const totalRoyaltyGain =
          ROYALTY_INCOME[user.badgeLevel] * 4 * daysPassed;

        newClubsIncome += totalClubGain;
        newRoyaltyIncome += totalRoyaltyGain;
        newTotalBalance += totalClubGain + totalRoyaltyGain; // ✅ FIXED HERE

        await tx.user.update({
          where: { telephone },
          data: {
            totalBalance: parseFloat(newTotalBalance.toFixed(6)),
            clubsIncome: parseFloat(newClubsIncome.toFixed(6)),
            royaltyIncome: parseFloat(newRoyaltyIncome.toFixed(6)),
            lastIncomeUpdate: now,
          },
        });
      }

      // 🧩 7️⃣ Per-second live income (no DB write)
      const perSecondIncome = dailyClubIncome / 86400;
      const liveIncrement = diffInSeconds * perSecondIncome;
      const liveClubsIncome = newClubsIncome + liveIncrement;
      const liveTotalBalance = newTotalBalance + liveIncrement;

      // ✅ 8️⃣ Return updated user data
      return {
        success: true,
        user: {
          ...user,
          totalBalance: parseFloat(liveTotalBalance.toFixed(6)),
          clubsIncome: parseFloat(liveClubsIncome.toFixed(6)),
          perSecondIncome: parseFloat(perSecondIncome.toFixed(12)),
          diffInSeconds: Math.floor(diffInSeconds),
          updatedAt: now,
        },
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("❌ Transaction Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
