import { serverActionErrorResponse } from "@/lib/actions/server-actions-response";

export const getAllDoctors = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/speciality`,

      {
        method: "GET",
      }
    );
    return await res.json();
  } catch (error) {
    return serverActionErrorResponse(error);
  }
};
