import { AppError } from "@/lib/actions/actions-error-response";
import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
export const dynamic = "force-dynamic";
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { userId, packageId } = body;

    if (!userId && !packageId) {
      throw new AppError("missing required field");
    }

    // check if order exists for user + package
    let order = await prisma.order.findFirst({
      where: {
        userId,
        packageId,
        OR: [{ status: "pending" }, { pendingOrder: { gt: 0 } }],
      },
    });
    if (!order) {
      throw new AppError("No found pending order", 404);
    }
    if (order) {
      // update existing order
      order = await prisma.order.update({
        where: { id: order.id },
        data: {
          pendingOrder: 0,
          status: "paid",
          numOfPur: (order.numOfPur ?? 0) + 1,
        },
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user?.referredBy) {
      // Find the referrer by refCode
      const referrer = await prisma.user.findUnique({
        where: { refCode: user.referredBy },
      });

      if (referrer) {
        // Check if bonus already rewarded for this referred user
        const existingReferral = await prisma.referral.findFirst({
          where: { referrerId: referrer.id, referredId: user.id },
        });

        if (!existingReferral) {
          const bonusAmount = 100; // define your bonus

          // Create referral record and reward
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredId: user.id,
              bonus: bonusAmount,
              rewarded: true,
            },
          });

          // Increment referrer's earnings
          await prisma.user.update({
            where: { id: referrer.id },
            data: {
              totalEarnings: { increment: bonusAmount },
              refBonusEarned: { increment: bonusAmount },
            },
          });
        }
      }
    }
    const maxAdLimit = order?.numOfPur * 5;
    // ✅ ensure adView exists or reset
    let adView = await prisma.adView.findFirst({
      where: {
        userId,
        packageId,
      },
    });

    if (!adView) {
      adView = await prisma.adView.create({
        data: {
          userId,
          packageId,
          viewAd: 0,
          maxViewAdd: maxAdLimit,
        },
      });
    } else {
      adView = await prisma.adView.update({
        where: { id: adView.id },
        data: {
          maxViewAdd: maxAdLimit,
          createdAt: new Date(),
        },
      });
    }

    return createSuccessResponse({ order });
  } catch (error) {
    console.error("Package creation error:", error);
    return errorResponse(error);
  }
}
