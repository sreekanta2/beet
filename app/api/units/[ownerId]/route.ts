// app/api/clubs/owner/[ownerId]/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { ownerId: string } }
) {
  const { ownerId } = params;

  if (!ownerId) {
    return NextResponse.json({ error: "ownerId is required" }, { status: 400 });
  }

  try {
    const clubs = await prisma.club.findMany({
      where: { ownerId },
      orderBy: { serialNumber: "asc" },
    });

    return NextResponse.json({ clubs });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch clubs" },
      { status: 500 }
    );
  }
}
