import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const DAILY_CLUB_INCOME_RATE = 0.1; // per club per day
const ROYALTY_RATES: Record<string, number> = {
  NONE: 0,
  SILVER: 100,
  GOLDEN: 500,
  PLATINUM: 2100,
  DIAMOND: 8100,
};

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
        clubsIncome: true,
        teamIncome: true,
        lastIncomeUpdate: true,
        royaltyIncome: true,
        cachedClubsCount: true,
        clubsBonus: true,
        deposit: true,
        serialNumber: true,
        badgeLevel: true, // 👈 make sure badgeLevel is selected
        withdraw: { select: { amount: true, status: true } },
        clubs: { select: { id: true } },
        createdAt: true,
        referralCode: true,
        referrals: { select: { id: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const now = new Date();
    const lastUpdate = user.lastIncomeUpdate || new Date(user.createdAt);
    const diffInMs = now.getTime() - lastUpdate.getTime();
    const daysPassed = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    let newTotalBalance = user.totalBalance;
    let newClubsIncome = user.clubsIncome;
    let newRoyaltyIncome = user.royaltyIncome;

    if (daysPassed >= 1) {
      // --- 1️⃣ Club income ---
      const clubCount = user.clubs.length;
      const dailyClubIncome = clubCount * DAILY_CLUB_INCOME_RATE;
      const totalClubGain = dailyClubIncome * daysPassed;

      // --- 2️⃣ Royalty income ---
      const royaltyRate = ROYALTY_RATES[user.badgeLevel] || 0;
      const totalRoyaltyGain = royaltyRate * daysPassed;

      newClubsIncome += totalClubGain;
      newRoyaltyIncome += totalRoyaltyGain;
      newTotalBalance += totalClubGain + totalRoyaltyGain;

      await prisma.user.update({
        where: { telephone },
        data: {
          totalBalance: parseFloat(newTotalBalance.toFixed(6)),
          clubsIncome: parseFloat(newClubsIncome.toFixed(6)),
          royaltyIncome: parseFloat(newRoyaltyIncome.toFixed(6)),
          lastIncomeUpdate: now,
        },
      });
    }

    // --- Per-second income calculation ---
    const clubCount = user.clubs.length;
    const totalDailyIncome =
      clubCount * DAILY_CLUB_INCOME_RATE +
      (ROYALTY_RATES[user.badgeLevel] || 0);
    const perSecondIncome = totalDailyIncome / 86400; // 24 hours = 86400 seconds

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        totalBalance: newTotalBalance,
        clubsIncome: newClubsIncome,
        royaltyIncome: newRoyaltyIncome,
        perSecondIncome,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
