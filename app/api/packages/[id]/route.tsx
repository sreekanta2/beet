import { AppError } from "@/lib/actions/actions-error-response";
import { createSuccessResponse, errorResponse } from "@/lib/api/api-response";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";
import { NextRequest } from "next/server";

// ✅ PUT - update a package
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Parse request body
    const body = await req.json();
    const { name, description, image, price, initialEarn, rewardPerAd } = body;
    // Validate with zod
    if (!name || !price) {
      throw new AppError("Name and Price are required");
    }
    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        name,
        description,
        price: parseFloat(price),
        image: image || null,
        rewardPerAd,
        initialEarn,
      },
    });
    revalidatePath("/admin/products");
    return createSuccessResponse(updatedPackage);
  } catch (error: any) {
    console.error("Package update error:", error);
    return errorResponse(error || "Failed to update package");
  }
}

// ✅ DELETE - delete a package
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    await prisma.package.delete({
      where: { id },
    });

    return createSuccessResponse({});
  } catch (error: any) {
    console.error("Package deletion error:", error);
    return errorResponse(error || "Failed to delete package");
  }
}
