import prisma from "@/lib/db";
import { processPointsAndClubs } from "@/lib/refral";
import { getBangladeshNow } from "@/lib/utils";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/option";

export async function POST(req: Request) {
  try {
    // 🔐 Verify logged-in user
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { sId, amount } = await req.json();

    // 🧩 Input validation
    if (!sId || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request. Provide valid sId and amount." },
        { status: 400 }
      );
    }

    // 🔍 Fetch sender securely
    const sender = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, totalBalance: true, role: true },
    });

    if (!sender) {
      return NextResponse.json({ error: "Sender not found." }, { status: 404 });
    }

    if (!["admin", "shoper"].includes(sender.role)) {
      return NextResponse.json(
        { error: "Access denied. Insufficient permissions." },
        { status: 403 }
      );
    }

    // 💰 Balance check
    if ((sender.totalBalance ?? 0) < amount) {
      return NextResponse.json(
        { error: "Insufficient balance." },
        { status: 400 }
      );
    }

    // 🔍 Find receiver
    const receiver = await prisma.user.findFirst({
      where: { serialNumber: Number(sId) },
      select: {
        id: true,
        role: true,
        name: true,
        deposit: true,
        cachedClubsCount: true,
      },
    });

    if (!receiver) {
      return NextResponse.json(
        { error: "Receiver not found." },
        { status: 404 }
      );
    }

    // 🚫 Prevent self-transfer
    if (receiver.id === sender.id) {
      return NextResponse.json(
        { error: "You cannot send points to yourself." },
        { status: 400 }
      );
    }

    // 🚫 Receiver limit
    if (receiver.cachedClubsCount >= 50) {
      return NextResponse.json(
        { error: "This user has reached the maximum number of units." },
        { status: 400 }
      );
    }

    // ⚙️ Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Deduct from sender
      await tx.user.update({
        where: { id: sender.id },
        data: { totalBalance: { decrement: amount } },
      });

      // Record outgoing transaction
      await tx.pointTransaction.create({
        data: {
          userId: sender.id,
          amount,
          type: "TRANSFER_OUT",
          meta: { receiverId: receiver.id, source: "deposit" },
          createdAt: getBangladeshNow(),
        },
      });

      // Deposit to receiver
      if (receiver.role === "shoper") {
        await tx.user.update({
          where: { id: receiver.id },
          data: { totalBalance: { increment: amount } },
        });
      } else {
        await processPointsAndClubs(receiver.id, amount);
      }

      // Record incoming transaction
      await tx.pointTransaction.create({
        data: {
          userId: receiver.id,
          amount,
          type: "TRANSFER_IN",
          meta: { senderId: sender.id, source: "transfer" },
          createdAt: getBangladeshNow(),
        },
      });

      return {
        success: true,
        message:
          receiver.role === "shoper"
            ? "Deposit sent to shoper successfully."
            : "Points transferred successfully.",
      };
    });

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("💥 Deposit Error:", error);
    return NextResponse.json(
      { error: "Something went wrong while processing the transaction." },
      { status: 500 }
    );
  }
}
