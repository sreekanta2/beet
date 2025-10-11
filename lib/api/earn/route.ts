import { processPointsAndClubs } from "@/lib/refral";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, earned } = await req.json();
    if (!userId || !earned)
      return NextResponse.json({ error: "Missing params" }, { status: 400 });

    await processPointsAndClubs(userId, earned);

    return NextResponse.json({
      success: true,
      message: "Points processed successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process points" },
      { status: 500 }
    );
  }
}
