import { NextResponse } from "next/server";

// const client = twilio(process.env.TWILIO_SID!, process.env.TWILIO_AUTH!);

export async function POST(req: Request) {
  const { amount } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // store OTP in Redis or DB for verification later
  console.log("OTP sent:", otp);

  //   await client.messages.create({
  //     body: `Your withdraw verification code is ${otp}`,
  //     from: process.env.TWILIO_PHONE!,
  //     to: "+88017XXXXXXXX",
  //   });

  return NextResponse.json({ success: true });
}
