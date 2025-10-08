import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Find the payment request
    const paymentRequest = await prisma.paymentRequest.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!paymentRequest) {
      return NextResponse.json(
        { error: "Payment request not found" },
        { status: 404 }
      );
    }

    // Update payment request status
    const updatedRequest = await prisma.paymentRequest.update({
      where: { id },
      data: { status },
    });

    await prisma.user.update({
      where: { id: updatedRequest?.userId },
      data: {
        totalWithdrawals: {
          increment: updatedRequest?.amount,
        },
        pendingAmount: {
          decrement: updatedRequest?.amount,
        },
        updatedAt: new Date(),
      },
    });
    return NextResponse.json({ success: true, data: updatedRequest });
  } catch (error) {
    console.error("Error updating payment request:", error);
    return NextResponse.json(
      { error: "Failed to update payment request" },
      { status: 500 }
    );
  }
}
