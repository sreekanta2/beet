import type { Prisma } from "@prisma/client";
import { BadgeLevel } from "@prisma/client";

const BATCH_SIZE = 4;

export async function evaluateBadges(
  tx: Prisma.TransactionClient,
  userIds: (string | null)[]
): Promise<void> {
  for (const uid of userIds.filter(Boolean) as string[]) {
    const user = await tx.user.findUnique({
      where: { id: uid },
      include: {
        referrals: {
          select: { id: true, badgeLevel: true, cachedClubsCount: true },
        },
      },
    });

    if (!user) continue;

    const referrals = user.referrals || [];
    let newBadge: BadgeLevel = user.badgeLevel;

    // --- NONE → SILVER ---
    if (user.badgeLevel === "NONE") {
      const qualifiedReferrals = referrals.filter(
        (r) => r.cachedClubsCount >= 50
      );

      if (qualifiedReferrals.length >= BATCH_SIZE) {
        console.log("first");
        newBadge = "SILVER";
      }
    }

    // --- SILVER → GOLDEN ---
    else if (user.badgeLevel === "SILVER") {
      const silverReferrals = referrals.filter(
        (r) => r.badgeLevel === "SILVER"
      );
      if (silverReferrals.length >= BATCH_SIZE) {
        newBadge = "GOLDEN";
      }
    }

    // --- GOLDEN → PLATINUM ---
    else if (user.badgeLevel === "GOLDEN") {
      const goldenReferrals = referrals.filter(
        (r) => r.badgeLevel === "GOLDEN"
      );
      if (goldenReferrals.length >= BATCH_SIZE) {
        newBadge = "PLATINUM";
      }
    }

    // --- PLATINUM → DIAMOND ---
    else if (user.badgeLevel === "PLATINUM") {
      const platinumReferrals = referrals.filter(
        (r) => r.badgeLevel === "PLATINUM"
      );
      if (platinumReferrals.length >= BATCH_SIZE) {
        newBadge = "DIAMOND";
      }
    }

    // ✅ Update badge if changed
    if (newBadge !== user.badgeLevel) {
      await tx.user.update({
        where: { id: user.id },
        data: { badgeLevel: newBadge },
      });
    }
  }
}
