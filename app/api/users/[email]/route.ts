import prisma from "@/lib/db"; // your Prisma client
import { NextRequest, NextResponse } from "next/server";

import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user || !user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, image, password } = body;

    // ✅ make sure current user is the same as being updated
    const currentUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!currentUser || currentUser.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // ✅ prepare update data
    const updateData: any = {
      name,
      email,
      image: image || null,
    };

    // ✅ hash password if provided
    if (password && password.trim().length > 0) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(
      {
        message: "Profile updated successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          image: updatedUser.image,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const { email } = params;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        name: true,
        email: true,
        totalDeposits: true,
        totalEarnings: true,
        refBonusEarned: true,
        totalWithdrawals: true,
        refCode: true,
        transaction: true,
        pendingAmount: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const count = await prisma.user.count({
      where: { referredBy: user.refCode },
    });

    return NextResponse.json({
      success: true,
      user: { ...user, count },
    });
  } catch (error) {
    console.error("User fetch error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
