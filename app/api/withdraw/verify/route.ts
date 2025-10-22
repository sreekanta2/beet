import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, otp } = await req.json();

    if (!userId || !otp)
      return NextResponse.json({ success: false, message: "Invalid input" });

    const record = await prisma.otp.findFirst({
      where: { userId, otp },
    });

    if (!record)
      return NextResponse.json({ success: false, message: "Invalid code" });

    if (new Date() > record.expiresAt)
      return NextResponse.json({ success: false, message: "Code expired" });

    // ✅ Optionally delete after verification
    await prisma.otp.delete({ where: { id: record.id } });

    return NextResponse.json({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
