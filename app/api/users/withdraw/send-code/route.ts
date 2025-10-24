import { formatBangladeshPhone } from "@/lib/utils";
import { User } from "@prisma/client";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import twilio from "twilio";
export const dynamic = "force-dynamic";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceId = process.env.TWILLO_SERVICE_ID!;

const client = twilio(accountSid, authToken);

export async function GET(request: NextRequest) {
  try {
    const getSession = async (req: NextRequest) => {
      const session = await getToken({ req });
      return session;
    };

    const session = await getSession(request);
    console.log(session?.telephone);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = session as User;
    console.log(user);
    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found!",
      });
    }

    const formattedPhone = formatBangladeshPhone(user.telephone!);
    console.log(formattedPhone);
    // Send OTP
    const twillioResponse = await client.verify.v2
      .services(serviceId)
      .verifications.create({
        to: `+${formattedPhone}`,
        channel: "sms",
      });

    if (twillioResponse.status === "pending") {
      return NextResponse.json({ sent: true }, { status: 200 });
    } else {
      return NextResponse.json({ sent: false }, { status: 500 });
    }
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
