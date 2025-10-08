import prisma from "@/lib/db"; // adjust path if needed
import { NextResponse } from "next/server";

// GET all ads
export async function GET() {
  try {
    const ads = await prisma.ad.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: ads });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// CREATE new ad
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, url } = body;

    if (!url) {
      return NextResponse.json(
        { success: false, message: "Ad URL is required" },
        { status: 400 }
      );
    }

    const ad = await prisma.ad.create({
      data: { name, url },
    });

    return NextResponse.json({ success: true, data: ad });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
