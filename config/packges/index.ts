import { SearchParams } from "@/types/common";

export const allPackagesPage = async (filterOptions?: SearchParams) => {
  const query = new URLSearchParams({
    sortOrder: filterOptions?.sortOrder || "desc",

    page: filterOptions?.page !== undefined ? String(filterOptions.page) : "0",

    limit:
      filterOptions?.limit !== undefined ? String(filterOptions.limit) : "10",
  });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/packages?${query.toString()}`
  );

  return await res.json();
};
