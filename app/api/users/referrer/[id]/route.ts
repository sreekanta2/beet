import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  try {
    // Fetch all users who have a referrer
    const referredUsers = await prisma.user.findMany({
      where: {
        referredById: id,
      },
      select: {
        id: true,
        serialNumber: true,
        name: true,
        cachedClubsCount: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ referredUsers }, { status: 200 });
  } catch (err) {
    console.error("Get referred users error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
