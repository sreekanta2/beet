import prisma from "@/lib/db";
import { evaluateBadges } from "@/lib/evaluate";
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
    const user = await prisma.user.findUnique({
      where: { telephone },
      select: {
        id: true,
        totalBalance: true,
        name: true,
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
    const recentWithdraws = await prisma.withdraw.findMany({
      where: { user: { telephone } },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        amount: true,
        status: true,
        createdAt: true,
        mobileBankingService: {
          select: {
            name: true,
            number: true,
          },
        },
      },
    });
    const result = await prisma.$transaction(async (tx) => {
      // 🧩 1️⃣ Get user & referral structure

      // 🧩 2️⃣ Build referral chain (up to 4 levels)
      const referrerIds = [
        user?.referredBy?.id,
        user?.referredBy?.referredBy?.id,
        user?.referredBy?.referredBy?.referredBy?.id,
      ].filter(Boolean) as string[];

      // 🧩 3️⃣ Process badges (you can call refBonus here if needed)
      if (referrerIds.length > 0 && user?.id) {
        await evaluateBadges(tx, referrerIds);
      }

      // 🧩 4️⃣ Calculate time difference
      const now = new Date();
      const lastUpdate = user.lastIncomeUpdate || user.createdAt;
      const diffInMs = now.getTime() - new Date(lastUpdate).getTime();
      const diffInSeconds = diffInMs / 1000;
      const daysPassed = Math.floor(diffInSeconds / 86400);

      // 🧩 5️⃣ Initial values
      let newTotalBalance = user.totalBalance;
      let newClubsIncome = user.clubsIncome;
      let newRoyaltyIncome = user.royaltyIncome;

      const clubCount = user.clubs.length;
      const dailyClubIncome = clubCount * DAILY_CLUB_INCOME_RATE;
      const dailyRoyaltyIncome = ROYALTY_INCOME[user.badgeLevel];

      // 🧩 6️⃣ Apply daily income if full days passed
      if (daysPassed >= 1) {
        const totalClubGain = dailyClubIncome * daysPassed;
        const totalRoyaltyGain = dailyRoyaltyIncome * daysPassed;

        newClubsIncome += totalClubGain;
        newRoyaltyIncome += totalRoyaltyGain;
        newTotalBalance += totalClubGain + totalRoyaltyGain;

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

      // 🧩 7️⃣ Per-second live updates
      const perSecondClubIncome = dailyClubIncome / 86400;
      const perSecondRoyaltyIncome = dailyRoyaltyIncome / 86400;

      const liveClubIncrement = diffInSeconds * perSecondClubIncome;
      const liveRoyaltyIncrement = diffInSeconds * perSecondRoyaltyIncome;

      const liveClubsIncome = newClubsIncome + liveClubIncrement;
      const liveRoyaltyIncome = newRoyaltyIncome + liveRoyaltyIncrement;
      const liveTotalBalance =
        newTotalBalance + liveClubIncrement + liveRoyaltyIncrement;

      // ✅ 8️⃣ Return updated user data
      return {
        success: true,
        user: {
          ...user,
          totalBalance: parseFloat(liveTotalBalance.toFixed(6)),
          clubsIncome: parseFloat(liveClubsIncome.toFixed(6)),
          royaltyIncome: parseFloat(liveRoyaltyIncome.toFixed(6)),
          perSecondClubIncome: parseFloat(perSecondClubIncome.toFixed(12)),
          perSecondRoyaltyIncome: parseFloat(
            perSecondRoyaltyIncome.toFixed(12)
          ),
          diffInSeconds: Math.floor(diffInSeconds),
          updatedAt: now,
        },
      };
    });
    const data = { ...result, recentWithdraws };
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("❌ Transaction Error:", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}
