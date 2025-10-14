import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const VALID_STATUSES = ["COMPLETED", "REJECTED"] as const;

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id: withdrawId } = params;
    const body = await req.json().catch(() => null);

    // --- Validate body ---
    if (!body || typeof body.status !== "string") {
      return NextResponse.json(
        { success: false, message: "Missing or invalid status" },
        { status: 400 }
      );
    }

    const status = body.status.toUpperCase();
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status must be COMPLETED or REJECTED" },
        { status: 400 }
      );
    }

    // --- Find withdraw record ---
    const withdraw = await prisma.withdraw.findUnique({
      where: { id: withdrawId },
    });

    if (!withdraw) {
      return NextResponse.json(
        { success: false, message: "Withdraw not found" },
        { status: 404 }
      );
    }

    // --- Prevent re-updating same status ---
    if (withdraw.status === status) {
      return NextResponse.json(
        { success: false, message: `Withdraw is already ${status}` },
        { status: 400 }
      );
    }

    // --- Validate user existence ---
    const user = await prisma.user.findUnique({
      where: { id: withdraw.userId },
      select: { totalBalance: true },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Associated user not found" },
        { status: 404 }
      );
    }

    // --- Ensure sufficient balance before marking as completed ---
    if (status === "COMPLETED" && user.totalBalance < withdraw.amount) {
      return NextResponse.json(
        { success: false, message: "Insufficient balance" },
        { status: 400 }
      );
    }

    // --- Update inside transaction ---
    const updatedWithdraw = await prisma.$transaction(async (tx) => {
      const newWithdraw = await tx.withdraw.update({
        where: { id: withdrawId },
        data: { status },
      });

      if (status === "COMPLETED") {
        await tx.user.update({
          where: { id: withdraw.userId },
          data: {
            totalBalance: { decrement: withdraw.amount },
          },
        });
      }

      return newWithdraw;
    });

    return NextResponse.json({
      success: true,
      message: `Withdraw ${status.toLowerCase()} successfully`,
      withdraw: updatedWithdraw,
    });
  } catch (error) {
    console.error("Withdraw update error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
