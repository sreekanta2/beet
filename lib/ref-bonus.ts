import { Prisma, TransactionType } from "@prisma/client";

const REFERRAL_CLUB_INCOME = [40, 20, 10, 5];
export async function refBonus(
  tx: Prisma.TransactionClient,
  referrerIds: string[],
  userId: string
) {
  for (let i = 0; i < referrerIds.length; i++) {
    const refId = referrerIds[i];
    const amount = REFERRAL_CLUB_INCOME[i];
    const type = TransactionType.REFERRAL_SIGNUP_BONUS;

    // Prevent double-paying same chain
    const exists = await tx.pointTransaction.findFirst({
      where: {
        userId: refId,
        type,
        meta: { path: ["newUserId"], equals: userId },
      },
    });

    if (exists) continue;

    // 💸 Create transaction
    await tx.pointTransaction.create({
      data: {
        userId: refId,
        amount,
        type,
        meta: { newUserId: userId, level: i + 1 },
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

    console.log(`💰 Level ${i + 1} bonus $${amount} → ${refId}`);
  }
}
