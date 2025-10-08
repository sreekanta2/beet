// types/common.ts
export type UserRole = "user" | "admin";

export interface SearchParams {
  search?: string;

  sortBy?: "rating" | "experience" | "fee" | "name";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
