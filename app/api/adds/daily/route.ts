// app/api/ads/daily/route.ts
import { AppError } from "@/lib/actions/actions-error-response";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    const packageId = url.searchParams.get("packageId");

    if (!userId || !packageId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Today’s reset point
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // 1️⃣ get adView record
    let adView = await prisma.adView.findFirst({
      where: { userId, packageId },
    });

    if (!adView) {
      throw new AppError("No active package found");
    }

    // 2️⃣ reset adView if record is from previous day
    if (adView.createdAt < todayStart) {
      adView = await prisma.adView.update({
        where: { id: adView.id },
        data: {
          viewAd: 0,
          createdAt: new Date(),
        },
      });
    }

    // 3️⃣ calculate remaining safely
    const remaining = Math.max(adView.maxViewAdd - adView.viewAd, 0);

    if (remaining <= 0) {
      return NextResponse.json({
        success: true,
        message: "Daily ad limit reached",
        remaining: 0,
        max: adView.maxViewAdd,
        viewed: adView.viewAd,
        ads: [],
      });
    }

    // 4️⃣ fetch ads (handle if fewer ads exist)
    const ads = await prisma.ad.findMany({
      take: remaining,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      remaining,
      max: adView.maxViewAdd,
      viewed: adView.viewAd,
      ads,
    });
  } catch (error: any) {
    console.error("Daily ads fetch error:", error);

    if (error instanceof AppError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
