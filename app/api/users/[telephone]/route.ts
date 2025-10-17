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
        badgeLevel: true,
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
    const lastUpdate = user.lastIncomeUpdate || user.createdAt;
    const diffInMs = now.getTime() - new Date(lastUpdate).getTime();
    const diffInSeconds = diffInMs / 1000;
    const daysPassed = Math.floor(diffInSeconds / 86400);

    let newTotalBalance = user.totalBalance;
    let newClubsIncome = user.clubsIncome;

    const clubCount = user.clubs.length;
    const dailyClubIncome = clubCount * DAILY_CLUB_INCOME_RATE;

    // 🧩 1️⃣ Daily update (if at least 1 full day passed)
    if (daysPassed >= 1) {
      const totalClubGain = dailyClubIncome * daysPassed;
      newClubsIncome += totalClubGain;
      newTotalBalance += totalClubGain;

      await prisma.user.update({
        where: { telephone },
        data: {
          totalBalance: parseFloat(newTotalBalance.toFixed(6)),
          clubsIncome: parseFloat(newClubsIncome.toFixed(6)),
          lastIncomeUpdate: now,
        },
      });
    }

    // 🧩 2️⃣ Per-second live income (after last full update)
    const perSecondIncome = dailyClubIncome / 86400; // per second rate
    const earnedSinceLastUpdate =
      newClubsIncome + diffInSeconds * perSecondIncome;
    const totalWithLive = newTotalBalance + diffInSeconds * perSecondIncome;

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        totalBalance: parseFloat(totalWithLive.toFixed(6)),
        clubsIncome: parseFloat(earnedSinceLastUpdate.toFixed(6)),
        perSecondIncome: parseFloat(perSecondIncome.toFixed(12)),
        diffInSeconds: Math.floor(diffInSeconds),
        updatedAt: now,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
