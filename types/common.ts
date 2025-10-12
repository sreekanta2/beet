// types/common.ts
export type UserRole = "user" | "admin" | "shoper";

export interface SearchParams {
  search?: string;

  sortBy?: "rating" | "experience" | "fee" | "name";
  sortOrder?: "asc" | "desc";
  page?: string;
  limit?: string;
}
export interface ShopperProfileInput {
  userId: string;
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  nid: string;
  nomineId?: string;
  nomineName?: string;
  nominiRelation?: string;
  division: string;
  district: string;
  upazila: string;
  category?: string;
  location?: string;
}
