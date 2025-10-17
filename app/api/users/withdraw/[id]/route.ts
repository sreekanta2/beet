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

    // --- Allow update only if current status is PENDING ---
    if (withdraw.status !== "PENDING") {
      return NextResponse.json(
        {
          success: false,
          message: `Withdraw is already ${withdraw.status.toLowerCase()} and cannot be changed.`,
        },
        { status: 400 }
      );
    }

    // --- Update withdraw status only ---
    const updatedWithdraw = await prisma.withdraw.update({
      where: { id: withdrawId },
      data: { status },
    });

    return NextResponse.json({
      success: true,
      message: `Withdraw ${status.toLowerCase()} successfully.`,
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
