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
  { params }: { params: { sn: string } }
) {
  const { sn } = params;

  if (!sn) {
    return NextResponse.json({ error: "sn is required" }, { status: 400 });
  }

  try {
    const clubSerial = Number(sn);

    // Fetch clubs with this serialNumber
    const clubs = await prisma.club.findMany({
      where: { serialNumber: clubSerial },
      include: { clubsBonus: true },
    });

    if (!clubs.length) {
      return NextResponse.json({ message: "No clubs found" });
    }

    // Total clubs in system
    // const totalClubs = 1_000_000;
    const totalClubs = await prisma.club.count();
    let totalBonus = 0;

    for (const club of clubs) {
      // Generate pattern and remove the first element (the club itself)
      const pattern = generateClubSeries(club.serialNumber).slice(1);

      // Filter out invalid serials (greater than total clubs)
      const validPattern = pattern.filter((num) => num <= totalClubs);

      // Limit to max 13 bonuses
      const limitedPattern = validPattern.slice(0, MAX_BONUS_STEPS);

      // Current number of bonuses in DB
      const existingCount = await prisma.clubsBonus.count({
        where: { clubId: club.id },
      });

      // Compute remaining slots
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
          // 💰 Bonus doubles each step
          const bonusAmount = BONUS_MULTIPLIER * Math.pow(2, i);

          await prisma.clubsBonus.create({
            data: {
              clubId: club.id,
              amount: bonusAmount,
              status: "Complete",
            },
          });

          totalBonus += bonusAmount;
        }
      } else {
        console.log(
          `Club ${club.id} already has max bonuses (${existingCount}/${MAX_BONUS_STEPS})`
        );
      }
    }

    // Update user's total clubsBonus
    await prisma.user.update({
      where: { id: clubs[0].ownerId },
      data: { clubsBonus: { increment: totalBonus } },
    });

    const bonusClubs = await prisma.clubsBonus.findMany({
      where: { clubId: clubs[0]?.id },
    });

    return NextResponse.json({
      message: "Clubs bonuses processed with incremental bonus amounts",
      totalBonus,
      clubs: bonusClubs,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process clubs bonus" },
      { status: 500 }
    );
  }
}
