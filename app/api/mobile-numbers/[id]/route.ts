import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET single
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const number = await prisma.mobileNumbers.findUnique({
      where: { id: params.id },
    });
    if (!number) {
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: number });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

// ✅ PUT update
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { number, type, bankName } = body;

    const updated = await prisma.mobileNumbers.update({
      where: { id: params.id },
      data: { number, type, bankName },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update" },
      { status: 500 }
    );
  }
}

// ✅ DELETE
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.mobileNumbers.delete({
      where: { id: params.id },
    });
    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete" },
      { status: 500 }
    );
  }
}
