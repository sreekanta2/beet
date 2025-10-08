import { AppError } from "@/lib/actions/actions-error-response";
import { errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import {
  TransactionFormData,
  transactionSchema,
} from "@/zod-validation/transections";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const trnId = searchParams.get("trnId") || "";

    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);

    const skip = (pageNumber - 1) * pageSize;

    const whereClause: any = {};

    if (trnId) {
      whereClause.trnId = trnId;
    }

    const [transactions, totalCount] = await Promise.all([
      prisma.transaction.findMany({
        where: whereClause,
        include: {
          user: {
            select: { name: true, image: true },
          },
          mobileNumber: true,
        },
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.transaction.count({
        where: whereClause,
      }),
    ]);

    return NextResponse.json({
      data: transactions,
      pagination: {
        page: pageNumber,
        limit: pageSize,
        total: totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
      },
    });
  } catch (error) {
    console.error("Transaction retrieval error:", error);
    return errorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: TransactionFormData = await req.json();

    // Validate request
    const validated = transactionSchema.parse(body);

    // Check for duplicate
    const existing = await prisma.transaction.findFirst({
      where: {
        userId: validated.userId,
        trnId: validated.trnId,
        status: "pending",
      },
    });

    if (existing) {
      throw new AppError("Transaction with this ID is already pending.", 401);
    }

    // Create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId: validated.userId,
        type: validated.type,
        bankName: validated.bankName,
        number: validated.number,
        trnId: validated.trnId,
        purl: validated.purl,
        amount: validated.amount,
        status: "pending",
        mobileNumberId: validated?.mobileNumberId,
      },
    });

    return NextResponse.json({ success: true, transaction });
  } catch (err: any) {
    console.error(err);
    return errorResponse(err || "Failed to create transaction");
  }
}
