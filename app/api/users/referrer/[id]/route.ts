import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    // 🧩 Fetch user referral tree up to 4 levels
    const user = await prisma.user.findUnique({
      where: { id },
      select: { badgeLevel: true },
    });
    const referredUsers = await prisma.user.findMany({
      where: { referredById: id },
      select: {
        id: true,
        name: true,
        serialNumber: true,
        cachedClubsCount: true,
        badgeLevel: true,
        createdAt: true,

        // Level 2
        referrals: {
          select: {
            id: true,
            name: true,
            serialNumber: true,
            cachedClubsCount: true,
            badgeLevel: true,
            createdAt: true,

            // Level 3
            referrals: {
              select: {
                id: true,
                name: true,
                serialNumber: true,
                cachedClubsCount: true,
                badgeLevel: true,
                createdAt: true,

                // Level 4
                referrals: {
                  select: {
                    id: true,
                    name: true,
                    serialNumber: true,
                    cachedClubsCount: true,
                    badgeLevel: true,
                    createdAt: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ ...user, referredUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching referral tree:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
