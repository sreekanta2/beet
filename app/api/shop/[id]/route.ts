import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// Fetch single shop
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shop = await prisma.shop.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, email: true, telephone: true },
        },
      },
    });

    if (!shop)
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });

    return NextResponse.json({ success: true, shop });
  } catch (error) {
    console.error("Error fetching shop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Update existing shop
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    const {
      branch,
      shopName,
      division,
      district,
      upazila,
      calculationType,
      calculationAmmount,
      agree,
    } = data;

    const updatedShop = await prisma.shop.update({
      where: { id: params.id },
      data: {
        branch,
        shopName,
        division,
        district,
        upazila,
        calculationType,
        calculationAmmount,
        agree,
      },
    });

    return NextResponse.json({ success: true, shop: updatedShop });
  } catch (error) {
    console.error("Error updating shop:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
