import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { status } = await req.json();
    const { id } = params;

    if (!["COMPLETED", "REJECTED"].includes(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const withdraw = await prisma.withdraw.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, withdraw });
  } catch (error) {
    console.error("Withdraw update error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update withdraw" },
      { status: 500 }
    );
  }
}
