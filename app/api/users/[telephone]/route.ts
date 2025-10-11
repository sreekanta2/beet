import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { telephone: string } }
) {
  const telephone = params.telephone;

  const user = await prisma.user.findUnique({
    where: { telephone },
    select: {
      totalBalance: true,
      royaltyIncome: true,
      id: true,
      name: true,
      createdAt: true,
      teamIncome: true,
      clubsBonus: true,
      deposit: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const clubCount = await prisma.club.count({ where: { ownerId: user.id } });

  const perClubDailyRate = 0.1; // daily rate per club
  const totalDailyIncome = clubCount * perClubDailyRate;
  const perSecondIncome = totalDailyIncome / 86400; // seconds per day

  const now = new Date();
  const createdAt = new Date(user.createdAt);
  const secondsSinceCreated = Math.floor(
    (now.getTime() - createdAt.getTime()) / 1000
  );

  const clubsIncome = perSecondIncome * secondsSinceCreated;
  const totalBalance =
    (user.teamIncome ?? 0) +
    (user.royaltyIncome ?? 0) +
    clubsIncome +
    (user.clubsBonus ?? 0);

  return NextResponse.json({
    user: { ...user, clubCount, clubsIncome, totalBalance },
  });
}
