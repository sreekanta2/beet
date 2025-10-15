import prisma from "@/lib/db";
import { processPointsAndClubs } from "@/lib/refral";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { sId, amount, userId } = await req.json();

    // 🧩 Validation
    if (!sId || !userId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide valid sId, userId, and amount." },
        { status: 400 }
      );
    }

    // 🔍 Find sender
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, totalBalance: true },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found." }, { status: 404 });
    }

    // 💰 Check sufficient balance
    if ((sender.totalBalance ?? 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance." },
        { status: 400 }
      );
    }

    // 🔍 Find receiver by serial number
    const receiver = await prisma.user.findFirst({
      where: { serialNumber: Number(sId) },
      select: { id: true, role: true, name: true, deposit: true },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // 🚫 Prevent self-transfer
    if (userId === receiver.id) {
      return NextResponse.json(
        { error: "You cannot send points to yourself." },
        { status: 400 }
      );
    }

    // 🧮 Start a transaction for atomic updates
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: userId },
        data: {
          totalBalance: { decrement: amount },
          teamIncome: { increment: amount * 0.02 },
        },
      });
      await tx.pointTransaction.create({
        data: {
          userId,
          amount,
          type: "TRANSFER_OUT",
          meta: { source: "deposit" },
        },
      });
      if (receiver.role === "shoper") {
        // Deposit to shoper
        const updatedShoper = await tx.user.update({
          where: { id: receiver.id },
          data: {
            deposit: { increment: amount },
          },
          select: { id: true, name: true, deposit: true, role: true },
        });

        return {
          success: true,
          message: "Deposit sent to shoper successfully.",
          receiver: updatedShoper,
        };
      } else {
        // Process normal user points
        await processPointsAndClubs(receiver.id, amount);
        return {
          success: true,
          message: "Points processed successfully.",
          receiver,
        };
      }
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("Deposit Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing the deposit." },
      { status: 500 }
    );
  }
}
