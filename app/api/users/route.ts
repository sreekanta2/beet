import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Extract query params with sane defaults
    let page = parseInt(searchParams.get("page") || "1", 10);
    let limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search");

    if (page < 1) page = 1;
    if (limit < 1) limit = 10;

    const skip = (page - 1) * limit;

    // Build filtering condition
    const whereClause = search
      ? {
          OR: [
            {
              serialNumber: isNaN(Number(search)) ? undefined : Number(search),
            },
          ].filter(Boolean), // remove undefined entries
        }
      : {};

    // Count total filtered records
    const totalCount = await prisma.user.count({ where: whereClause });
    const totalPages = Math.ceil(totalCount / limit);

    // Prevent going past last page
    if (page > totalPages && totalPages > 0) {
      page = totalPages;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        serialNumber: true,
        telephone: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
      },
    });
  } catch (error) {
    console.error("User retrieval error:", error);
    return errorResponse(error);
  }
}
