import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// GET single ad
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ad = await prisma.ad.findUnique({
      where: { id: params.id },
    });

    if (!ad) {
      return NextResponse.json(
        { success: false, message: "Ad not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: ad });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// UPDATE ad
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, url } = body;

    const updated = await prisma.ad.update({
      where: { id: params.id },
      data: { name, url },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// DELETE ad
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.ad.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: "Ad deleted" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
