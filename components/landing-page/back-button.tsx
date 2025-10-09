"use client";

import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();

  const handleBack = () => {
    router.back(); // 👈 goes to previous page
  };

  return (
    <button
      onClick={handleBack}
      className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
    >
      Back
    </button>
  );
}
