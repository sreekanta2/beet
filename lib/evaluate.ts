import { BadgeLevel } from "@prisma/client";

import type { Prisma } from "@prisma/client";

export async function evaluateBadges(
  tx: Prisma.TransactionClient,
  userIds: (string | null)[]
): Promise<void> {
  for (const uid of userIds.filter(Boolean) as string[]) {
    const user = await tx.user.findUnique({
      where: { id: uid },
      include: { referrals: true },
    });
    if (!user) continue;

    const referralCount = user.referrals?.length ?? 0;
    const referralClubsDone = await tx.club.count({
      where: { ownerId: { in: user.referrals.map((r) => r.id) } },
    });

    let newBadge: BadgeLevel = BadgeLevel.NONE;
    if (referralCount >= 4 && referralClubsDone >= 50)
      newBadge = BadgeLevel.SILVER;
    if (referralCount >= 4 && referralClubsDone >= 200)
      newBadge = BadgeLevel.GOLDEN;
    if (referralCount >= 4 && referralClubsDone >= 400)
      newBadge = BadgeLevel.DIAMOND;

    if (newBadge !== user.badgeLevel) {
      await tx.user.update({
        where: { id: user.id },
        data: { badgeLevel: newBadge },
      });
    }
  }
}
