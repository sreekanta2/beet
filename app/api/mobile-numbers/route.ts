import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ GET all mobile numbers
export async function GET() {
  try {
    const numbers = await prisma.mobileNumbers.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, data: numbers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch" },
      { status: 500 }
    );
  }
}

// ✅ POST create new mobile number
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { number, type, bankName } = body;

    if (!number || !type || !bankName) {
      return NextResponse.json(
        { success: false, error: "All fields required" },
        { status: 400 }
      );
    }

    const newNumber = await prisma.mobileNumbers.create({
      data: { number, type, bankName },
    });

    return NextResponse.json(
      { success: true, data: newNumber },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to create" },
      { status: 500 }
    );
  }
}
