import prisma from "@/lib/db";
import { getBangladeshNow } from "@/lib/utils";
import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, amount, serviceId } = body;

    if (!userId || !amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: "Invalid request data" },
        { status: 400 }
      );
    }

    // 🔹 Fetch user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { totalBalance: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // 🔹 Check sufficient balance
    if (user.totalBalance < amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // 💰 Apply 5% withdrawal fee
    const feeRate = 0.05;
    const feeAmount = amount * feeRate;
    const finalAmount = amount - feeAmount;

    // 🔹 Use transaction for consistency
    const [withdraw, pointTx] = await prisma.$transaction([
      prisma.withdraw.create({
        data: {
          userId,
          amount: finalAmount, // ✅ Amount user receives
          status: "PENDING",
          mobileBankingServiceId: serviceId,
        },
      }),
      prisma.pointTransaction.create({
        data: {
          userId,
          amount: finalAmount,
          type: TransactionType.TRANSFER_OUT,
          meta: {
            clubOwnerId: userId,
          },
          createdAt: getBangladeshNow(),
        },
      }),
      prisma.user.update({
        where: { id: userId },
        data: {
          totalBalance: { decrement: amount }, // ✅ Deduct full withdrawal request
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      message: `Withdrawal of ৳${finalAmount.toFixed(
        2
      )} submitted (Fee ৳${feeAmount.toFixed(2)})`,
      withdraw,
      pointTx,
    });
  } catch (error) {
    console.error("Withdraw error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const withdraws = await prisma.withdraw.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        mobileBankingService: { select: { number: true, name: true } },
      },
    });

    return NextResponse.json({ success: true, withdraws });
  } catch (error) {
    console.error("Withdraw fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch withdraws" },
      { status: 500 }
    );
  }
}
