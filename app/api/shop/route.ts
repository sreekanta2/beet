import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const {
      userId,
      branch,
      shopName,
      division,
      district,
      upazila,
      calculationType,
      calculationAmmount,
      agree,
    } = data;

    if (!userId || !shopName)
      return NextResponse.json(
        { error: "userId and shopName are required." },
        { status: 400 }
      );

    // Ensure user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    // Create shop
    const shop = await prisma.shop.create({
      data: {
        userId,
        branch,
        shopName,
        division,
        district,
        upazila,
        calculationType,
        calculationAmmount,
        agree: agree ?? false,
      },
    });

    return NextResponse.json({ success: true, shop }, { status: 201 });
  } catch (error) {
    console.error("Error creating shop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Get all shops

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "User id required" }, { status: 403 });
    }
    const where = userId ? { userId } : {};

    const shops = await prisma.shop.findMany({
      where,
      distinct: ["userId"], // ensures unique shops per user
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            telephone: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (userId && shops.length === 0) {
      return NextResponse.json(
        { success: false, message: "No shop found for this user." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, shops });
  } catch (error) {
    console.error("Error fetching shops:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
