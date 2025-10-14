import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const BONUS_MULTIPLIER = 200;
const MAX_BONUS_STEPS = 13;

// Generate club series pattern
function generateClubSeries(start: number): number[] {
  const series: number[] = [];
  let value = start;

  for (let i = 0; i < MAX_BONUS_STEPS; i++) {
    series.push(value);
    value = i < 4 ? value * 3 : value * 2;
  }

  return series;
}

export async function GET(
  req: Request,
  { params }: { params: { ownerId: string } }
) {
  const userId = params?.ownerId || "cmgprfkdi0003ue4kset05jn8";
  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  try {
    const clubs = await prisma.club.findMany({ where: { ownerId: userId } });
    if (!clubs.length) return NextResponse.json({ message: "No clubs found" });

    const totalClubs = await prisma.club.count();

    let totalNewBonus = 0; // 🧮 track only new bonuses created

    for (const club of clubs) {
      const pattern = generateClubSeries(club.serialNumber).slice(1);
      const validPattern = pattern.filter((num) => num <= totalClubs);
      const limitedPattern = validPattern.slice(0, MAX_BONUS_STEPS);

      const existingCount = await prisma.clubsBonus.count({
        where: { clubId: club.id },
      });

      const remainingToCreate = Math.min(
        limitedPattern.length - existingCount,
        MAX_BONUS_STEPS - existingCount
      );

      if (remainingToCreate > 0) {
        for (
          let i = existingCount;
          i < existingCount + remainingToCreate;
          i++
        ) {
          const bonusAmount = BONUS_MULTIPLIER * Math.pow(2, i);

          await prisma.clubsBonus.create({
            data: {
              clubId: club.id,
              userId,
              amount: bonusAmount,
              status: "Complete",
            },
          });

          totalNewBonus += bonusAmount; // 🧮 add only newly created
        }
      } else {
        console.log(
          `Club ${club.id} already has max bonuses (${existingCount}/${MAX_BONUS_STEPS})`
        );
      }
    }

    // ✅ Increment only newly created bonus amounts
    if (totalNewBonus > 0) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          clubsBonus: { increment: totalNewBonus },
          totalBalance: { increment: totalNewBonus },
        },
      });
    }

    return NextResponse.json({
      message: `✅ Clubs bonuses processed successfully. Created ${totalNewBonus} worth of bonuses.`,
      success: true,
      clubs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process clubs bonus" },
      { status: 500 }
    );
  }
}
