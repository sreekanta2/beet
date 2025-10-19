import { BadgeLevel } from "@prisma/client";
import { refBonus } from "./ref-bonus";

// ---------------- Configuration ----------------
const REQUIRED_CLUBS = 50;
const BATCH_SIZE = 4;

// ---------------- Main Function ----------------
export async function processReferralAndBadges(
  tx: any,
  userId: string,
  referredById: string | null
) {
  if (!referredById) return;

  // 🔹 Load 4-level referral chain
  const refChain = await tx.user.findUnique({
    where: { id: referredById },
    select: {
      id: true,
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

  const referrerIds = [
    refChain?.id,
    refChain?.referredBy?.id,
    refChain?.referredBy?.referredBy?.id,
    refChain?.referredBy?.referredBy?.referredBy?.id,
  ].filter(Boolean) as string[];

  // 🔁 Loop through all levels
  // for (let i = 0; i < referrerIds.length; i++) {
  //   const refId = referrerIds[i];
  //   const amount = REFERRAL_CLUB_INCOME[i];
  //   const type =
  //     i === 0
  //       ? TransactionType.REFERRAL_SIGNUP_BONUS
  //       : TransactionType.REFERRAL_CLUB_INCOME;

  //   // Prevent double-paying same chain
  //   const exists = await tx.pointTransaction.findFirst({
  //     where: {
  //       userId: refId,
  //       type,
  //       meta: { path: ["newUserId"], equals: userId },
  //     },
  //   });

  //   if (exists) continue;

  //   // 💸 Create transaction
  //   await tx.pointTransaction.create({
  //     data: {
  //       userId: refId,
  //       amount,
  //       type,
  //       meta: { newUserId: userId, level: i + 1 },
  //     },
  //   });

  //   // 💵 Update balances
  //   await tx.user.update({
  //     where: { id: refId },
  //     data: {
  //       totalBalance: { increment: amount },
  //       teamIncome: { increment: amount },
  //     },
  //   });

  //   console.log(`💰 Level ${i + 1} bonus $${amount} → ${refId}`);
  // }

  // 🏅 Evaluate badges for all referrers
  await refBonus(tx, referrerIds, userId);
  await evaluateBadges(tx, referrerIds);
}

// ---------------- Badge Evaluation ----------------
export async function evaluateBadges(tx: any, userIds: string[]) {
  for (const userId of userIds) {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        referrals: {
          include: {
            referrals: true, // nested for recursive upgrades
          },
        },
      },
    });

    if (!user) continue;

    const referrals = user.referrals || [];
    let newBadge: BadgeLevel | null = null;

    // --- NONE → SILVER ---
    if (user.badgeLevel === "NONE") {
      // ✅ Only promote when user has exactly 4 referrals
      if (referrals.length >= BATCH_SIZE) {
        // Check that all 4 referrals have completed at least 50 clubs
        const qualifiedReferrals = referrals
          .slice(0, BATCH_SIZE)
          .every(
            (r: { cachedClubsCount: number }) =>
              r.cachedClubsCount >= REQUIRED_CLUBS
          );
        console.log({ qualifiedReferrals });
        if (qualifiedReferrals) {
          console.log("in", qualifiedReferrals);
          newBadge = "SILVER";
        }
      }
    }

    // --- SILVER → GOLDEN ---
    else if (user.badgeLevel === "SILVER") {
      if (referrals.length >= BATCH_SIZE) {
        const allSilver = referrals
          .slice(0, BATCH_SIZE)
          .every((r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "SILVER");

        if (allSilver) newBadge = "GOLDEN";
      }
    }

    // --- GOLDEN → PLATINUM ---
    else if (user.badgeLevel === "GOLDEN") {
      if (referrals.length >= BATCH_SIZE) {
        const allGolden = referrals
          .slice(0, BATCH_SIZE)
          .every((r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "GOLDEN");

        if (allGolden) newBadge = "PLATINUM";
      }
    }

    // --- PLATINUM → DIAMOND ---
    else if (user.badgeLevel === "PLATINUM") {
      if (referrals.length >= BATCH_SIZE) {
        const allPlatinum = referrals
          .slice(0, BATCH_SIZE)
          .every(
            (r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "PLATINUM"
          );

        if (allPlatinum) newBadge = "DIAMOND";
      }
    }

    // --- Update badge if user qualifies ---
    if (newBadge) {
      await tx.user.update({
        where: { id: userId },
        data: { badgeLevel: newBadge },
      });

      console.log(`🏅 User ${userId} promoted → ${newBadge}`);
    }
  }
}
