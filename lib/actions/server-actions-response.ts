// lib/actions/server-action-response.ts

import { ErrorSource, PaginationMeta } from "@/lib/types/common"; // Import shared types
import { globalErrorHandler } from "./actions-error-response";

// -----------------------------
// Type Definitions
// -----------------------------

export type ErrorActionResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors: ErrorSource[];
};

export type SuccessActionMeta = {
  message?: string;
  pagination?: PaginationMeta;
  [key: string]: unknown;
};

export type SuccessActionResponse<T = unknown> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
  meta?: SuccessActionMeta;
};

export type ServerActionResponse<T = unknown> =
  | SuccessActionResponse<T>
  | ErrorActionResponse;

// -----------------------------
// Success Response Helpers for Server Actions
// -----------------------------

const createActionResponse = <T>(
  data: T,
  statusCode: number,
  message: string,
  meta?: SuccessActionMeta
): SuccessActionResponse<T> => ({
  success: true,
  statusCode,
  message,
  data,
  ...(meta && { meta }),
});

export const serverActionCreatedResponse = <T>(
  data: T,
  options?: { message?: string; meta?: Omit<SuccessActionMeta, "message"> }
): SuccessActionResponse<T> => {
  return createActionResponse(
    data,
    201,
    options?.message || "Resource created successfully",
    options?.meta
  );
};

export const serverActionSuccessResponse = <T>(
  data: T,
  options?: {
    message?: string;
    meta?: Omit<SuccessActionMeta, "message" | "pagination">;
  }
): SuccessActionResponse<T> => {
  return createActionResponse(
    data,
    200,
    options?.message || "Request successful",
    options?.meta
  );
};

export const serverActionPaginationResponse = <T>(
  data: T[],
  pagination: { total: number; page: number; limit: number },
  options?: {
    message?: string;
    additionalMeta?: Omit<SuccessActionMeta, "pagination" | "message">;
  }
): SuccessActionResponse<T[]> => {
  const totalPages = Math.ceil(
    pagination.total / Math.max(pagination.limit, 1)
  );
  const currentPage = Math.max(pagination.page, 1);

  return createActionResponse(
    data,
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
};

export const serverActionErrorResponse = (
  err: unknown
): ErrorActionResponse => {
  const result = globalErrorHandler(err);
  return result;
};
