import { evaluateBadges } from "./evaluate";
import { refBonus } from "./ref-bonus";

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
  if (referrerIds.length > 0 && userId) {
    // 🏅 Evaluate badges for all referrers
    await refBonus(tx, referrerIds, userId);
    await evaluateBadges(tx, referrerIds, userId);
  }
}

// ---------------- Badge Evaluation ----------------
// export async function evaluateBadges(tx: any, userIds: string[]) {
//   for (const userId of userIds) {
//     const user = await tx.user.findUnique({
//       where: { id: userId },
//       include: {
//         referrals: {
//           include: {
//             referrals: true, // nested for recursive upgrades
//           },
//         },
//       },
//     });

//     if (!user) continue;

//     const referrals = user.referrals || [];
//     let newBadge: BadgeLevel | null = null;

//     // --- NONE → SILVER ---
//     if (user.badgeLevel === "NONE") {
//       // ✅ Only promote when user has exactly 4 referrals
//       if (referrals.length >= BATCH_SIZE) {
//         // Check that all 4 referrals have completed at least 50 clubs
//         const qualifiedReferrals = referrals
//           .slice(0, BATCH_SIZE)
//           .every(
//             (r: { cachedClubsCount: number }) =>
//               r.cachedClubsCount >= REQUIRED_CLUBS
//           );
//         console.log({ qualifiedReferrals });
//         if (qualifiedReferrals) {
//           console.log("in", qualifiedReferrals);
//           newBadge = "SILVER";
//         }
//       }
//     }

//     // --- SILVER → GOLDEN ---
//     else if (user.badgeLevel === "SILVER") {
//       if (referrals.length >= BATCH_SIZE) {
//         const allSilver = referrals
//           .slice(0, BATCH_SIZE)
//           .every((r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "SILVER");

//         if (allSilver) newBadge = "GOLDEN";
//       }
//     }

//     // --- GOLDEN → PLATINUM ---
//     else if (user.badgeLevel === "GOLDEN") {
//       if (referrals.length >= BATCH_SIZE) {
//         const allGolden = referrals
//           .slice(0, BATCH_SIZE)
//           .every((r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "GOLDEN");

//         if (allGolden) newBadge = "PLATINUM";
//       }
//     }

//     // --- PLATINUM → DIAMOND ---
//     else if (user.badgeLevel === "PLATINUM") {
//       if (referrals.length >= BATCH_SIZE) {
//         const allPlatinum = referrals
//           .slice(0, BATCH_SIZE)
//           .every(
//             (r: { badgeLevel: BadgeLevel }) => r.badgeLevel === "PLATINUM"
//           );

//         if (allPlatinum) newBadge = "DIAMOND";
//       }
//     }

//     // --- Update badge if user qualifies ---
//     if (newBadge) {
//       await tx.user.update({
//         where: { id: userId },
//         data: { badgeLevel: newBadge },
//       });

//       console.log(`🏅 User ${userId} promoted → ${newBadge}`);
//     }
//   }
// }
