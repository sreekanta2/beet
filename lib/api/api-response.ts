// lib/api/api-response.ts

import { ErrorSource, PaginationMeta } from "@/lib/types/common"; // Import shared types
import { NextResponse } from "next/server";
import { globalErrorHandler } from "../actions/actions-error-response";

// -----------------------------
// Type Definitions
// -----------------------------

type ErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors: ErrorSource[];
};

type SuccessMeta = {
  message?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
};

type SuccessResponse<T = unknown> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: SuccessMeta;
};

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse;

// -----------------------------
// Success Response Helpers for API Routes
// -----------------------------

const createResponse = <T>(
  data: T,
  statusCode: number,
  message: string,
  meta?: SuccessMeta
): SuccessResponse<T> => ({
  success: true,
  statusCode,
  message,
  data,
  ...(meta && { meta }),
});

export const createSuccessResponse = <T>(
  data: T,
  options?: { message?: string; meta?: Omit<SuccessMeta, "message"> }
) => {
  const response = createResponse(
    data,
    201,
    options?.message || "Resource created successfully",
    options?.meta
  );
  return NextResponse.json(response, { status: 201 });
};

export const successResponse = <T>(
  data: T,
  options?: {
    message?: string;
    meta?: Omit<SuccessMeta, "message" | "pagination">;
  }
) => {
  const response = createResponse(
    data,
    200,
    options?.message || "Request successful",
    options?.meta
  );
  return NextResponse.json(response);
};

export const successPaginationResponse = <T>(
  items: T[],
  pagination: { total: number; page: number; limit: number },
  options?: {
    message?: string;
    additionalMeta?: Omit<SuccessMeta, "pagination" | "message">;
  }
) => {
  const totalPages = Math.ceil(
    pagination.total / Math.max(pagination.limit, 1)
  );
  const currentPage = Math.max(pagination.page, 1);

  const response = createResponse(
    items,
    200,
    options?.message || "Data retrieved successfully",
    {
      ...options?.additionalMeta,
      pagination: {
        total: pagination.total,
        page: currentPage,
        limit: pagination.limit,
        totalPages,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1,
      },
    }
  );

  return NextResponse.json(response);
};

export const errorResponse = (err: unknown) => {
  const result = globalErrorHandler(err);
  return NextResponse.json(result, { status: result.statusCode });
};
