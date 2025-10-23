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
// ✅ GET /api/transactions/:userId?from=YYYY-MM-DD&to=YYYY-MM-DD&page=1&limit=10
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

    if (!userId) throw new AppError("Missing userId parameter.", 400);
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1
    ) {
      throw new AppError("Invalid pagination parameters.", 400);
    }

    const skip = (page - 1) * limit;

    // ✅ Build date range filter
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

    // ✅ Fetch transactions (with user serial)
    const [transactions, total] = await Promise.all([
      prisma.pointTransaction.findMany({
        where: { userId, ...dateFilter },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          amount: true,
          type: true,
          meta: true, // get full JSON
          createdAt: true,
          user: {
            select: { serialNumber: true },
          },
        },
      }),
      prisma.pointTransaction.count({ where: { userId, ...dateFilter } }),
    ]);

    const clubOwnerIds = [
      ...new Set(
        transactions
          .map((t) => {
            const meta = t.meta as TransactionMeta; // ✅ cast to TransactionMeta
            return meta.clubOwnerId;
          })
          .filter((id): id is string => Boolean(id)) // ✅ filter out undefined
      ),
    ];

    const clubOwners = await prisma.user.findMany({
      where: { id: { in: clubOwnerIds } }, // ✅ now it's string[]
      select: {
        id: true,
        serialNumber: true,
        name: true,
      },
    });

    const clubOwnerMap = Object.fromEntries(
      clubOwners.map((u) => [
        u.id,
        { serialNumber: u.serialNumber, name: u.name },
      ])
    );

    // ✅ Merge data
    const formattedTransactions = transactions.map((t: TransactionMeta) => ({
      id: t.id,
      amount: t.amount,
      type: t.type,
      createdAt: t.createdAt,
      serialNumber: t.user.serialNumber,
      clubOwnerId: t.meta?.clubOwnerId || null,
      clubOwnerSerial: clubOwnerMap[t.meta?.clubOwnerId]?.serialNumber || null,
      clubOwnerName: clubOwnerMap[t.meta?.clubOwnerId]?.name || null,
    }));

    return NextResponse.json({
      success: true,
      message: "Transactions retrieved successfully.",
      transactions: formattedTransactions,
      pagination: { page, limit, total },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
