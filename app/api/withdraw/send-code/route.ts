import prisma from "@/lib/db";
import { NextResponse } from "next/server";

const GREENWEB_API_TOKEN = process.env.GREENWEB_API_TOKEN!;

export async function POST(req: Request) {
  try {
    const { userId, amount, phone } = await req.json();

    if (!userId || !phone || !amount)
      return NextResponse.json({ success: false, message: "Invalid input" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ Save OTP to DB (expires in 2 mins)
    await prisma.otp.create({
      data: {
        userId,
        otp,
        amount,
        expiresAt: new Date(Date.now() + 2 * 60 * 1000),
      },
    });

    // ✅ Send OTP SMS using GreenWeb
    const message = `Your withdrawal verification code is ${otp}. It will expire in 2 minutes.`;
    const response = await fetch("https://api.greenweb.com.bd/api.php", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        token: GREENWEB_API_TOKEN,
        to: phone,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to send SMS");
    }

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Server error" });
  }
}
