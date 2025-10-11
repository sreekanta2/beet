import prisma from "@/lib/db";
import { AppError } from "./actions/actions-error-response";
import { evaluateBadges } from "./evaluate";

export async function processPointsAndClubs(userId: string, earned: number) {
  await prisma.$transaction(async (tx) => {
    // 1️⃣ Credit earned points to user
    await tx.pointTransaction.create({
      data: {
        userId,
        amount: earned,
        type: "MANUAL",
        meta: { source: "deposit" },
      },
    });

    // 2️⃣ Add earned points to user's deposit
    await tx.user.update({
      where: { id: userId },
      data: {
        deposit: { increment: earned },
      },
    });

    // 3️⃣ Fetch updated user data
    const user = await tx.user.findUnique({
      where: { id: userId },
      select: {
        deposit: true,
        cachedClubsCount: true,
        referredById: true,
      },
    });

    if (!user) throw new AppError("User not found");

    const { deposit, cachedClubsCount, referredById } = user;

    // 4️⃣ Determine how many new clubs can be created
    const MAX_CLUBS = 50;
    const CLUB_COST = 100;

    const remainingSlots = MAX_CLUBS - cachedClubsCount;
    if (remainingSlots <= 0) {
      throw new AppError("You reach all clubs ", 403);
    }

    const possibleClubs = Math.floor(deposit / CLUB_COST);
    const clubsToCreate = Math.min(possibleClubs, remainingSlots);
    if (clubsToCreate <= 0) return;

    // 5️⃣ Get the last serial number for this user
    const lastClub = await tx.club.findFirst({
      where: { ownerId: userId },
      orderBy: { serialNumber: "desc" },
      select: { serialNumber: true },
    });

    let nextSerialNumber = lastClub?.serialNumber
      ? lastClub.serialNumber + 1
      : 1;

    // 6️⃣ Create clubs with incremental serial numbers
    for (let i = 0; i < clubsToCreate; i++) {
      await tx.club.create({
        data: {
          ownerId: userId,
          source: "AUTO",
          serialNumber: nextSerialNumber,
        },
      });
      nextSerialNumber++;
    }

    // 7️⃣ Update user club count & deposit
    await tx.user.update({
      where: { id: userId },
      data: {
        deposit: { decrement: CLUB_COST * clubsToCreate },
        cachedClubsCount: { increment: clubsToCreate },
      },
    });

    // 8️⃣ Handle referral bonus (one-time per user)
    if (referredById) {
      const existingBonus = await tx.pointTransaction.findFirst({
        where: {
          userId: referredById,
          type: "REFERRAL_SIGNUP_BONUS",
          meta: {
            path: ["newUserId"],
            equals: userId,
          },
        },
      });

      if (!existingBonus) {
        // Create the one-time referral bonus transaction
        await tx.pointTransaction.create({
          data: {
            userId: referredById,
            amount: 40,
            type: "REFERRAL_SIGNUP_BONUS",
            meta: { newUserId: userId },
          },
        });

        // Update the referrer’s referral income
        await tx.user.update({
          where: { id: referredById },
          data: {
            teamIncome: { increment: 40 },
          },
        });
      }
    }

    // 9️⃣ Evaluate badges (for user and referrer)
    await evaluateBadges(tx, [userId, referredById].filter(Boolean));

    console.log(
      `✅ User ${userId} earned ${earned} points and created ${clubsToCreate} clubs.`
    );
  });
}
