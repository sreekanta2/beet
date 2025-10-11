import prisma from "@/lib/db";

export async function updateClubIncome() {
  console.log("Running club income update CRON job...");

  const users = await prisma.user.findMany();

  for (const user of users) {
    const clubCount = await prisma.club.count({ where: { ownerId: user.id } });
    const perClubDailyRate = 0.1;
    const totalDailyIncome = clubCount * perClubDailyRate;
    const perSecondIncome = totalDailyIncome / 86400;

    const secondsSinceCreated = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / 1000
    );

    const clubsIncome = perSecondIncome * secondsSinceCreated;
    const totalBalance =
      (user.teamIncome ?? 0) +
      (user.royaltyIncome ?? 0) +
      clubsIncome +
      (user.clubsBonus ?? 0);

    await prisma.user.update({
      where: { id: user.id },
      data: { clubsIncome, totalBalance },
    });
  }

  console.log("Club income updated for all users.");
}

// Run immediately if executed directly
updateClubIncome().catch(console.error);
