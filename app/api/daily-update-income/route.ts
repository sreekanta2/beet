import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const now = new Date();

    // Fetch user and club info
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        clubs: { select: { id: true } },
        clubsIncome: true,
        totalBalance: true,
        lastIncomeUpdate: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const lastUpdate = user.lastIncomeUpdate ?? user.createdAt ?? new Date(0);
    const msDiff = now.getTime() - new Date(lastUpdate).getTime();
    const daysSinceLastUpdate = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    // Skip if less than 1 full day passed
    if (daysSinceLastUpdate < 1) {
      return NextResponse.json({
        success: false,
        message: "Income already updated today.",
        lastUpdate,
        now,
      });
    }

    const clubCount = user.clubs.length;
    if (clubCount === 0) {
      return NextResponse.json({
        success: false,
        message: "No clubs found for this user.",
      });
    }

    // Daily income = number of clubs * 0.01
    const dailyIncomePerDay = clubCount * 0.01;
    // Total income for all missed days
    const totalAddedIncome = dailyIncomePerDay * daysSinceLastUpdate;

    // Update user balances
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        clubsIncome: user.clubsIncome + totalAddedIncome,
        totalBalance: user.totalBalance + totalAddedIncome,
        lastIncomeUpdate: now,
      },
      select: {
        id: true,
        clubsIncome: true,
        totalBalance: true,
        lastIncomeUpdate: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Income updated for ${daysSinceLastUpdate} day(s).`,
      addedPerDay: dailyIncomePerDay,
      totalAddedIncome,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user daily income:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
