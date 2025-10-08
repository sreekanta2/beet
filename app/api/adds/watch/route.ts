// app/api/ads/watch/route.ts
import { AppError } from "@/lib/actions/actions-error-response";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: NextRequest) {
  try {
    const { userId, packageId } = await req.json();

    if (!userId || !packageId) {
      return NextResponse.json(
        { error: "Missing parameters" },
        { status: 400 }
      );
    }

    // Find AdView tracker
    let adView = await prisma.adView.findFirst({
      where: { userId, packageId },
      include: { package: true },
    });

    if (!adView) {
      throw new AppError("Ad view record not found. Buy a package first.");
    }

    // Today’s reset point
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Reset if old record (previous day)
    if (adView.createdAt < todayStart) {
      adView = await prisma.adView.update({
        where: { id: adView.id },
        data: {
          viewAd: 0,
          createdAt: new Date(),
          maxViewAdd: adView.package.adLimit,
        },
        include: { package: true },
      });
    }

    // Check remaining limit
    if (adView.viewAd >= adView.maxViewAdd) {
      return NextResponse.json(
        { error: "Daily ad limit reached" },
        { status: 403 }
      );
    }

    // Increment view count
    await prisma.adView.update({
      where: { id: adView.id },
      data: { viewAd: { increment: 1 } },
    });

    const reward = adView.package.rewardPerAd;

    // Update user earnings
    await prisma.user.update({
      where: { id: userId },
      data: { totalEarnings: { increment: reward } },
    });

    // Update package earnings
    await prisma.package.update({
      where: { id: packageId },
      data: { totalEarnings: { increment: reward } },
    });

    return NextResponse.json({
      success: true,
      reward,
      remaining: adView.maxViewAdd - (adView.viewAd + 1),
      max: adView.maxViewAdd,
      viewed: adView.viewAd + 1,
    });
  } catch (error) {
    console.error("Watch ad error:", error);
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
