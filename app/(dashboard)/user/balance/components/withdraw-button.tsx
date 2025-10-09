"use client";

import { useRouter } from "next/navigation";

export default function WithdrawButton() {
  const router = useRouter();

  const handleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) router.push(value); // Navigate only if a route is selected
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 items-center">
      <select
        onChange={handleSelect}
        className="border bg-primary border-gray-300 text-gray-800 px-4 py-2 rounded w-full sm:w-auto"
      >
        <option value="">Withdraw </option>
        <option value="/user/withdrawbranch">Branch</option>
        <option value="/user/mobile">Mobile</option>
      </select>
    </div>
  );
}
