import prisma from "@/lib/db";
import { AppError } from "./actions/actions-error-response";

import { processReferralAndBadges } from "./processReferalAndBadge";

const BONUS_MULTIPLIER = 200;
const MAX_BONUS_STEPS = 13;
const MAX_CLUBS = 50;
const CLUB_COST = 100;

function generateClubSeries(start: number): number[] {
  const series: number[] = [];
  let value = start;
  for (let i = 0; i < MAX_BONUS_STEPS; i++) {
    series.push(value);
    value *= 3;
  }
  return series;
}

export async function processPointsAndClubs(userId: string, earned: number) {
  return prisma.$transaction(async (tx) => {
    // 1️⃣ Credit earned points
    await tx.pointTransaction.create({
      data: {
        userId,
        amount: earned,
        type: "CLUB_CREATION_SPEND",
        meta: { source: "deposit" },
      },
    });

    // 2️⃣ Add earned points to user deposit
    const user = await tx.user.update({
      where: { id: userId },
      data: { deposit: { increment: earned } },
      select: { deposit: true, cachedClubsCount: true, referredById: true },
    });

    const { deposit, cachedClubsCount, referredById } = user;
    const remainingSlots = MAX_CLUBS - cachedClubsCount;
    if (remainingSlots <= 0)
      throw new AppError("You’ve reached your club limit.");

    const possibleClubs = Math.floor(deposit / CLUB_COST);
    const clubsToCreate = Math.min(possibleClubs, remainingSlots);
    if (clubsToCreate <= 0) return;

    // 3️⃣ Find next serial number
    const lastClub = await tx.club.findFirst({
      orderBy: { serialNumber: "desc" },
      select: { serialNumber: true },
    });

    let nextSerialNumber = lastClub?.serialNumber
      ? lastClub.serialNumber + 1
      : 1;

    // 4️⃣ Create new clubs
    const newClubsData = Array.from({ length: clubsToCreate }, (_, i) => ({
      ownerId: userId,
      source: "AUTO",
      serialNumber: nextSerialNumber + i,
    }));

    const createdClubs = await tx.club.createManyAndReturn({
      data: newClubsData,
    });

    // 5️⃣ Update user’s deposit and count
    await tx.user.update({
      where: { id: userId },
      data: {
        deposit: { decrement: CLUB_COST * clubsToCreate },
        cachedClubsCount: { increment: clubsToCreate },
      },
    });

    // 6️⃣ After creation, get all clubs again
    const allClubs = await tx.club.findMany({
      where: { ownerId: userId },
      select: { id: true, serialNumber: true },
    });

    const totalClubs = allClubs.length;
    let totalNewBonus = 0;

    // ✅ Step 1: Generate new bonuses for new clubs
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
    }

    // ✅ Step 2: Update older clubs (retroactive bonus check)
    for (const club of allClubs) {
      const pattern = generateClubSeries(club.serialNumber).slice(1);
      const validPattern = pattern
        .filter((n) => n <= totalClubs)
        .slice(0, MAX_BONUS_STEPS);

      const existingCount = await tx.clubsBonus.count({
        where: { clubId: club.id },
      });

      const newSteps = validPattern.length - existingCount;
      if (newSteps > 0) {
        for (let i = existingCount; i < validPattern.length; i++) {
          const bonusAmount = BONUS_MULTIPLIER * Math.pow(2, i);
          await tx.clubsBonus.create({
            data: {
              clubId: club.id,
              userId,
              amount: bonusAmount,
              status: "Complete",
            },
          });
          totalNewBonus += bonusAmount;
        }
      }
    }

    // 7️⃣ Update total bonuses
    if (totalNewBonus > 0) {
      await tx.user.update({
        where: { id: userId },
        data: {
          clubsBonus: { increment: totalNewBonus },
          totalBalance: { increment: totalNewBonus },
        },
      });
    }
    await processReferralAndBadges(tx, userId, referredById);
    // 8️⃣ Handle referral bonus
    // if (referredById) {
    //   // Count existing bonuses for this referredById and newUserId
    //   const existingBonus = await tx.pointTransaction.count({
    //     where: {
    //       userId: referredById,
    //       type: TransactionType.REFERRAL_SIGNUP_BONUS,
    //       meta: { path: ["newUserId"], equals: userId },
    //     },
    //   });

    //   const remainingRef = allClubs.length - existingBonus;

    //   if (remainingRef > 0) {
    //     const totalReferralAmount = remainingRef * 40;

    //     // ✅ 1️⃣ Create all referral transactions at once
    //     const referralBonuses = Array.from(
    //       { length: remainingRef },
    //       (_, i) => ({
    //         userId: referredById,
    //         amount: 40,
    //         type: TransactionType.REFERRAL_SIGNUP_BONUS,
    //         meta: { newUserId: userId, index: existingBonus + i + 1 },
    //       })
    //     );

    //     await tx.pointTransaction.createMany({
    //       data: referralBonuses,
    //     });

    //     // ✅ 2️⃣ Atomically increment user's total balance
    //     await tx.user.update({
    //       where: { id: referredById },
    //       data: {
    //         totalBalance: { increment: totalReferralAmount },
    //         teamIncome: { increment: totalReferralAmount },
    //       },
    //     });

    //     console.log(
    //       `✅ Created ${remainingRef} referral bonuses (${totalReferralAmount}) for user ${referredById}`
    //     );
    //   }
    // }

    // 9️⃣ Evaluate badges

    console.log(
      `✅ User ${userId} earned ${earned} points, created ${clubsToCreate} new clubs, and received ${totalNewBonus} total bonus (including retroactive bonuses).`
    );
  });
}
