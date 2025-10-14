import prisma from "@/lib/db";
import { NextResponse } from "next/server";

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
      include: { clubsBonus: true, owner: { select: { id: true } } },
    });

    const bonusClubs = await prisma.clubsBonus.findMany({
      where: { clubId: clubs[0].id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      message: "✅ Clubs bonuses processed successfully",

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
