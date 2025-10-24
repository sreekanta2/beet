import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

interface TransactionMeta {
  clubId?: string;
  clubOwnerId?: string;
  level?: number;
  [key: string]: any;
}

// Convert UTC → BD Time
const toBangladeshTime = (date: Date) => {
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc + 6 * 60 * 60 * 1000);
};

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page") ?? 1);
    const limit = Number(searchParams.get("limit") ?? 10);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const type = searchParams.get("type"); // ✅ Added type filter

    if (!userId) throw new AppError("Missing userId parameter.", 400);

    const skip = (page - 1) * limit;

    // ✅ Date Filter
    const dateFilter: any = {};
    if (from || to) {
      dateFilter.createdAt = {};
      if (from) dateFilter.createdAt.gte = new Date(from);
      if (to) {
        const toDate = new Date(to);
        toDate.setHours(23, 59, 59, 999);
        dateFilter.createdAt.lte = toDate;
      }
    }

    // ✅ Type Filter
    const typeFilter = type ? { type } : {};

    // ✅ Main Query
    const [transactions, total] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: {
          userId,
          ...dateFilter,
          ...typeFilter, // applied here
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          meta: true,
          createdAt: true,
          user: { select: { serialNumber: true } },
        },
      }),
      prisma.pointTransaction.count({
        where: { userId, ...dateFilter, ...typeFilter },
      }),
    ]);

    const clubOwnerIds = [
      ...new Set(
        transactions
          .map((t) => (t.meta as TransactionMeta)?.clubOwnerId)
          .filter((id): id is string => Boolean(id))
      ),
    ];

    const clubOwners = await prisma.user.findMany({
      where: { id: { in: clubOwnerIds } },
      select: { id: true, serialNumber: true, name: true },
    });

    const clubOwnerMap = Object.fromEntries(clubOwners.map((u) => [u.id, u]));

    const formattedTransactions = transactions.map((t) => {
      const owner =
        clubOwnerMap[(t.meta as TransactionMeta)?.clubOwnerId ?? ""];
      return {
        id: t.id,
        amount: t.amount,
        type: t.type,
        createdAt: toBangladeshTime(t.createdAt),
        serialNumber: t.user.serialNumber,
        clubOwnerId: owner?.id || null,
        clubOwnerSerial: owner?.serialNumber || null,
        clubOwnerName: owner?.name || null,
      };
    });

    return NextResponse.json({
      success: true,
      message: "Transactions retrieved successfully.",
      transactions: formattedTransactions,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return errorResponse(error);
  }
}
