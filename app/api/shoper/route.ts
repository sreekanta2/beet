import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      selfCustomerId,
      introducerCustomerId,
      branch,
      shopName,
      ownerName,
      nidNumber,
      division,
      district,
      upazila,
      telephone,
      calculationType,
      calculationAmmount,
      password,
      confirmPassword,
      agree,
    } = body;

    // Validate required fields
    if (
      !selfCustomerId ||
      !shopName ||
      !ownerName ||
      !nidNumber ||
      !division ||
      !district ||
      !upazila ||
      !password
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const referralCode = `REF${Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase()}`;
    // Create new user with role 'shoper'
    const user = await prisma.user.create({
      data: {
        name: ownerName,
        telephone,
        password: hashedPassword,
        role: "shoper",
        referralCode: referralCode,
        // referredBy: introducerCustomerId
        //   ? { connect: { referralCode: introducerCustomerId } }
        //   : undefined,
      },
    });

    // Create corresponding shopper record
    const shopper = await prisma.shopper.create({
      data: {
        selfCustomerId,
        introducerCustomerId,
        branch,
        shopName,
        nidNumber,
        division,
        district,
        upazila,
        calculationType,
        calculationAmmount,
        agree,
      },
    });

    return NextResponse.json({
      message: "Shopper account created successfully",
      user,
      shopper,
    });
  } catch (error: any) {
    console.error("Error creating shopper:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
