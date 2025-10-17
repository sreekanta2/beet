import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { otp } = await req.json();
  // verify OTP with stored code
  const valid = otp === "123456"; // for testing only

  if (!valid)
    return NextResponse.json(
      { success: false, message: "Invalid verification code" },
      { status: 400 }
    );

  return NextResponse.json({ success: true });
}
