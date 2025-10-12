import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { success: false, message: "Reference code is required" },
      { status: 400 }
    );
  }

  try {
    const referrer = await prisma.user.findFirst({
      where: {
        OR: [{ referralCode: reference }],
      },
      select: {
        name: true,

        serialNumber: true,
        referralCode: true,
      },
    });

    if (!referrer) {
      return NextResponse.json(
        { success: false, message: "Reference code not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      referrer: {
        name: `${referrer.name}  `,
        serialNumber: referrer.serialNumber,
        referralCode: referrer.referralCode,
      },
    });
  } catch (error) {
    console.error("Error fetching referrer:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
