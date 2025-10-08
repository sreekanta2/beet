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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Transaction ID is required" },
        { status: 400 }
      );
    }

    if (!status || !["approved", "rejected", "pending"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Invalid status" },
        { status: 400 }
      );
    }

    // Update transaction status
    const updatedTransaction = await prisma.transaction.update({
      where: { id: id },
      data: { status },
    });

    // Optional: if approved, increment user's totalDeposits
    if (updatedTransaction?.type === "deposit") {
      if (status === "approved") {
        await prisma.user.update({
          where: { id: updatedTransaction.userId },
          data: { totalDeposits: { increment: updatedTransaction.amount } },
        });
      }
      if (status === "pending") {
        await prisma.user.update({
          where: { id: updatedTransaction.userId },
          data: { totalDeposits: { decrement: updatedTransaction.amount } },
        });
      }
    }
    if (updatedTransaction?.type === "withdraw") {
      if (status === "approved") {
        await prisma.user.update({
          where: { id: updatedTransaction?.userId },
          data: {
            totalWithdrawals: {
              increment: updatedTransaction?.amount,
            },
            pendingAmount: {
              decrement: updatedTransaction?.amount,
            },
            updatedAt: new Date(),
          },
        });
      }
      if (status === "pending") {
        await prisma.user.update({
          where: { id: updatedTransaction?.userId },
          data: {
            totalWithdrawals: {
              decrement: updatedTransaction?.amount,
            },
            pendingAmount: {
              increment: updatedTransaction?.amount,
            },
            updatedAt: new Date(),
          },
        });
      }
    }

    return NextResponse.json({ success: true, data: updatedTransaction });
  } catch (err: any) {
    console.error("Error updating transaction status:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to update status" },
      { status: 500 }
    );
  }
}
