import { SearchParams } from "@/types/common";

export const getAllUsers = async (filterOptions: SearchParams = {}) => {
  const query = new URLSearchParams({
    sortOrder: filterOptions.sortOrder || "desc",
    page: filterOptions?.page !== undefined ? String(filterOptions.page) : "0",
    limit:
      filterOptions?.limit !== undefined ? String(filterOptions.limit) : "10",
  });

  if (filterOptions.search) {
    query.set("search", filterOptions.search);
  }
  if (filterOptions.sortBy) {
    query.set("sortBy", filterOptions.sortBy);
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users?${query.toString()}`
  );

  return await res.json();
};

export const getUser = async (email: string) => {
  try {
    const res = fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${email}`);
    const data = (await res).json();
    return data;
  } catch (error) {
    console.log(error);
  }
};
