import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const DAILY_CLUB_INCOME_RATE = 0.1; // per club per day

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

        withdraw: {
          select: {
            amount: true,
            status: true,
          },
        },
        clubs: { select: { id: true } },
        createdAt: true,
        referralCode: true,
        referrals: {
          select: { id: true },
        },
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

    if (daysPassed >= 1) {
      const clubCount = user.clubs.length;
      const dailyIncome = clubCount * DAILY_CLUB_INCOME_RATE;
      const totalGain = dailyIncome * daysPassed;

      newClubsIncome += totalGain;
      newTotalBalance += totalGain;

      await prisma.user.update({
        where: { telephone },
        data: {
          totalBalance: parseFloat(newTotalBalance.toFixed(6)),
          clubsIncome: parseFloat(newClubsIncome.toFixed(6)),
          lastIncomeUpdate: now,
        },
      });
    }

    // Per-second income based on 24-hour distribution
    const clubCount = user.clubs.length;
    const totalDailyIncome = clubCount * DAILY_CLUB_INCOME_RATE;
    const perSecondIncome = totalDailyIncome / 86400; // 24h = 86400s

    return NextResponse.json({
      success: true,
      user: {
        ...user,
        totalBalance: newTotalBalance,
        clubsIncome: newClubsIncome,
        perSecondIncome,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
