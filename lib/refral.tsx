import prisma from "@/lib/db";
import { Prisma, TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

// ---------------- Configuration ----------------
const BONUS_MULTIPLIER = 200;
const MAX_BONUS_STEPS = 13;
const MAX_CLUBS = 50;
const CLUB_COST = 100;
const REFERRAL_CLUB_INCOME = [40, 20, 10, 5];

// ---------------- Helper Functions ----------------

// Generate geometric bonus series (for club bonuses)
function generateClubSeries(start: number): number[] {
  const series: number[] = [];
  let value = start;
  for (let i = 0; i < MAX_BONUS_STEPS; i++) {
    series.push(value);
    value *= 3;
  }
  return series;
}

// ✅ Handle referral bonuses for each new club created
async function giveReferralClubBonus(
  tx: Prisma.TransactionClient,
  clubOwnerId: string,
  clubId: string
) {
  const referrerIds: string[] = [];
  let currentId = clubOwnerId;

  // 🔁 Collect up to 4-level referrer chain
  for (let i = 0; i < REFERRAL_CLUB_INCOME.length; i++) {
    const user = await tx.user.findUnique({
      where: { id: currentId },
      select: { referredById: true },
    });

    if (!user?.referredById) break;
    referrerIds.push(user.referredById);
    currentId = user.referredById;
  }

  // 🎁 Distribute referral bonuses
  for (let i = 0; i < referrerIds.length; i++) {
    const refId = referrerIds[i];
    const amount = REFERRAL_CLUB_INCOME[i];

    // Prevent double-payment for same club
    const exists = await tx.pointTransaction.findFirst({
      where: {
        userId: refId,
        type: TransactionType.REFERRAL_CLUB_INCOME,
        meta: { path: ["clubId"], equals: clubId },
      },
    });

    if (exists) continue;

    // 💸 Create transaction
    await tx.pointTransaction.create({
      data: {
        userId: refId,
        amount,
        type: TransactionType.REFERRAL_CLUB_INCOME,
        meta: { clubId, clubOwnerId, level: i + 1 },
      },
    });

    // 💵 Update balances
    await tx.user.update({
      where: { id: refId },
      data: {
        totalBalance: { increment: amount },
        teamIncome: { increment: amount },
      },
    });

    console.log(`🎯 Level ${i + 1} referral bonus ${amount} → ${refId}`);
  }
}

// ---------------- Main Function ----------------
export async function processPointsAndClubs(userId: string, earned: number) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Create transaction for earned points
    await tx.pointTransaction.create({
      data: {
        userId,
        amount: earned,
        type: TransactionType.CLUB_CREATION_SPEND,
        meta: { source: "deposit" },
      },
    });

    // 2️⃣ Update user deposit balance
    const user = await tx.user.update({
      where: { id: userId },
      data: { deposit: { increment: earned } },
      select: { deposit: true, cachedClubsCount: true, referredById: true },
    });

    const { deposit, cachedClubsCount, referredById } = user;
    const remainingSlots = MAX_CLUBS - cachedClubsCount;

    if (remainingSlots <= 0) {
      return NextResponse.json({ error: "Limit the clubs." }, { status: 400 });
    }

    // 3️⃣ Determine how many clubs to create
    const possibleClubs = Math.floor(deposit / CLUB_COST);
    const clubsToCreate = Math.min(possibleClubs, remainingSlots);
    if (clubsToCreate <= 0) return;

    // 4️⃣ Find next serial number
    const lastClub = await tx.club.findFirst({
      orderBy: { serialNumber: "desc" },
      select: { serialNumber: true },
    });

    let nextSerialNumber = lastClub?.serialNumber
      ? lastClub.serialNumber + 1
      : 1;

    // 5️⃣ Create new clubs
    const newClubsData = Array.from({ length: clubsToCreate }, (_, i) => ({
      ownerId: userId,
      source: "AUTO",
      serialNumber: nextSerialNumber + i,
    }));

    const createdClubs = await tx.club.createManyAndReturn({
      data: newClubsData,
    });

    // 6️⃣ Update user’s deposit and cached club count
    await tx.user.update({
      where: { id: userId },
      data: {
        deposit: { decrement: CLUB_COST * clubsToCreate },
        cachedClubsCount: { increment: clubsToCreate },
      },
    });

    // 7️⃣ Re-fetch all clubs
    const allClubs = await tx.club.findMany({
      where: { ownerId: userId },
      select: { id: true, serialNumber: true },
    });

    const totalClubs = allClubs.length;
    let totalNewBonus = 0;

    // 8️⃣ Generate Club Bonuses
    for (const club of createdClubs) {
      const pattern = generateClubSeries(club.serialNumber).slice(1);
      const validPattern = pattern
        .filter((n) => n <= totalClubs)
        .slice(0, MAX_BONUS_STEPS);

      const bonuses = validPattern.map((_, i) => ({
        clubId: club.id,
        userId,
        amount: BONUS_MULTIPLIER * Math.pow(2, i),
        status: "Complete",
      }));

      await tx.clubsBonus.createMany({ data: bonuses });
      totalNewBonus += bonuses.reduce((sum, b) => sum + b.amount, 0);

      // 💎 Referral bonus for each new club
      if (referredById) {
        await giveReferralClubBonus(tx, userId, club.id);
      }
    }

    // 9️⃣ Update total club bonus + balance
    if (totalNewBonus > 0) {
      await tx.user.update({
        where: { id: userId },
        data: {
          clubsBonus: { increment: totalNewBonus },
          totalBalance: { increment: totalNewBonus },
        },
      });
    }

    console.log(
      `✅ User ${userId} earned ${earned} pts → created ${clubsToCreate} clubs → got ${totalNewBonus} bonus (incl. referrals)`
    );
  });
}
