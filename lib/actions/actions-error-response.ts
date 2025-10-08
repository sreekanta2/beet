// lib/actions/action-error.ts
// Import shared type
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { ErrorSource } from "../types/common";

type GenericErrorResponse = {
  success: false;
  statusCode: number;
  message: string;
  errors: ErrorSource[];
};

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public errors: ErrorSource[] = [{ path: "", message }]
  ) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
  }
}

const handleZodError = (err: ZodError): GenericErrorResponse => ({
  success: false,
  statusCode: 400,
  message: "Validation Error",
  errors: err.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message,
  })),
});

const handlePrismaError = (
  err: Prisma.PrismaClientKnownRequestError
): GenericErrorResponse => {
  const defaultResponse: GenericErrorResponse = {
    success: false,
    statusCode: 500,
    message: "Database Error",
    errors: [{ path: "database", message: err.message }],
  };

  switch (err.code) {
    case "P2002":
      return {
        success: false,
        statusCode: 409,
        message: "Duplicate entry",
        errors: [
          {
            path: err.meta?.target?.toString() || "field",
            message: "This value already exists",
          },
        ],
      };
    case "P2025":
      return {
        success: false,
        statusCode: 404,
        message: "Not Found",
        errors: [
          {
            path: err.meta?.modelName?.toString() || "resource",
            message: "The requested resource was not found",
          },
        ],
      };
    default:
      return defaultResponse;
  }
};

export const globalErrorHandler = (err: unknown): GenericErrorResponse => {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", err);
  }

  if (err instanceof ZodError) return handleZodError(err);
  if (err instanceof Prisma.PrismaClientKnownRequestError)
    return handlePrismaError(err);
  if (err instanceof AppError)
    return {
      success: false,
      statusCode: err.statusCode,
      message: err.message,
      errors: err.errors,
    };

  return {
    success: false,
    statusCode: 500,
    message: "Internal Server Error",
    errors: [{ path: "server", message: "something went wrong!" }],
  };
};
