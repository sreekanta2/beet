import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);

    const skip = (pageNumber - 1) * pageSize;

    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: {
          OR: [{ status: "pending" }, { pendingOrder: { gt: 0 } }],
        },
        include: {
          package: true,
          user: {
            include: {
              transaction: true,
            },
          },
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({
        where: {
          status: "pending",
          pendingOrder: { gt: 0 },
        },
      }),
    ]);

    return NextResponse.json({
      orders,
      pagination: {
        total: totalCount,
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Package retrieval error:", error);
    return errorResponse(error);
  }
}
