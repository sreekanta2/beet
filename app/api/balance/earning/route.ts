import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Sum of totalEarnings across all users
    const totalEarningsResult = await prisma.user.aggregate({
      _sum: {
        totalEarnings: true,
        totalWithdrawals: true,
      },
    });

    const totalEarnings = totalEarningsResult._sum.totalEarnings || 0;
    const totalWithdrawals = totalEarningsResult._sum.totalWithdrawals || 0;

    return NextResponse.json({
      success: true,
      data: {
        totalEarnings,
        totalWithdrawals,
      },
    });
  } catch (error) {
    console.error("Error fetching summary:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
