import type { Prisma } from "@prisma/client";
import { BadgeLevel } from "@prisma/client";

// ---------------- Configuration ----------------
const BATCH_SIZE = 4;

export async function evaluateBadges(
  tx: Prisma.TransactionClient,
  userIds: (string | null)[],
  userId: string
): Promise<void> {
  // ---------------- 1️⃣ Badge Evaluation for referrers ----------------
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
    if (user.badgeLevel === "NONE" && referrals.length >= BATCH_SIZE) {
      const allQualified = referrals
        .slice(0, BATCH_SIZE)
        .every((r) => r.cachedClubsCount >= 50);
      if (allQualified) newBadge = "SILVER";
    }

    // --- SILVER → GOLDEN ---
    else if (user.badgeLevel === "SILVER" && referrals.length >= BATCH_SIZE) {
      const allSilver = referrals
        .slice(0, BATCH_SIZE)
        .every((r) => r.badgeLevel === "SILVER");
      if (allSilver) newBadge = "GOLDEN";
    }

    // --- GOLDEN → PLATINUM ---
    else if (user.badgeLevel === "GOLDEN" && referrals.length >= BATCH_SIZE) {
      const allGolden = referrals
        .slice(0, BATCH_SIZE)
        .every((r) => r.badgeLevel === "GOLDEN");
      if (allGolden) newBadge = "PLATINUM";
    }

    // --- PLATINUM → DIAMOND ---
    else if (user.badgeLevel === "PLATINUM" && referrals.length >= BATCH_SIZE) {
      const allPlatinum = referrals
        .slice(0, BATCH_SIZE)
        .every((r) => r.badgeLevel === "PLATINUM");
      if (allPlatinum) newBadge = "DIAMOND";
    }

    if (newBadge !== user.badgeLevel) {
      await tx.user.update({
        where: { id: user.id },
        data: { badgeLevel: newBadge },
      });
    }
  }
}
