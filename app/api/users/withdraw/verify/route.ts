import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

const otpStore: Record<string, { code: string; expiresAt: number }> = {};

export async function POST(req: Request) {
  try {
    const { phone, code } = await req.json();
    if (!phone || !code)
      return NextResponse.json(
        { success: false, message: "Phone and code required" },
        { status: 400 }
      );

    const otpEntry = otpStore[phone];
    if (!otpEntry)
      return NextResponse.json(
        { success: false, message: "OTP not found or expired" },
        { status: 400 }
      );

    if (otpEntry.expiresAt < Date.now()) {
      delete otpStore[phone];
      return NextResponse.json(
        { success: false, message: "OTP expired" },
        { status: 400 }
      );
    }

    if (otpEntry.code !== code)
      return NextResponse.json(
        { success: false, message: "Invalid code" },
        { status: 400 }
      );

    // OTP verified successfully, delete it
    delete otpStore[phone];

    return NextResponse.json({ success: true, message: "Phone verified" });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}
