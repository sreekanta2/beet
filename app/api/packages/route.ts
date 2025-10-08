import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { PackageSchema } from "@/zod-validation/package-zod";
import { NextResponse } from "next/server";
export const dynamic = "force-dynamic";
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validateData = PackageSchema.parse(body);

    const pkg = await prisma.package.create({
      data: {
        name: validateData.name,
        description: validateData.description,
        image: validateData.image,
        price: validateData.price,
        adLimit: validateData.adLimit,
        initialEarn: validateData?.initialEarn,
        rewardPerAd: validateData.rewardPerAd,
      },
    });

    return createSuccessResponse(pkg);
  } catch (error) {
    console.error("Package creation error:", error);
    return errorResponse(error);
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // Ensure valid values
    const pageNumber = Math.max(page, 1);
    const pageSize = Math.max(limit, 1);

    const skip = (pageNumber - 1) * pageSize;

    // Fetch packages
    const [packages, totalCount] = await Promise.all([
      prisma.package.findMany({
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.package.count(),
    ]);

    return NextResponse.json({
      packages,
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
