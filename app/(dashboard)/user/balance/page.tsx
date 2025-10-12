"use client";

import Breadcrumb from "@/components/breadcumb";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import WithdrawButton from "./components/withdraw-button";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function PointsDashboard() {
  const { data: session } = useSession();
  const telephone = session?.user?.telephone;

  const { data, error, isLoading, mutate } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const user = data?.user;

  const [liveClubIncome, setLiveClubIncome] = useState(0);
  const [liveTotalBalance, setLiveTotalBalance] = useState(0);

  // ⏱️ Smooth per-second income update
  useEffect(() => {
    if (!user) return;

    const lastUpdate = new Date(user.lastIncomeUpdate).getTime();
    const now = Date.now();
    const elapsedSeconds = (now - lastUpdate) / 1000;

    // Start with balance including missed income
    let currentClubIncome =
      user.clubsIncome + user.perSecondIncome * elapsedSeconds;
    let currentTotalBalance =
      user.totalBalance + user.perSecondIncome * elapsedSeconds;

    setLiveClubIncome(currentClubIncome);
    setLiveTotalBalance(currentTotalBalance);

    const interval = setInterval(() => {
      currentClubIncome += user.perSecondIncome;
      currentTotalBalance += user.perSecondIncome;
      setLiveClubIncome(currentClubIncome);
      setLiveTotalBalance(currentTotalBalance);
    }, 1000);

    return () => clearInterval(interval);
  }, [user]);

  if (error)
    return <div className="p-6 text-red-600">Failed to load data.</div>;
  if (isLoading)
    return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[
          { label: "Home", href: "/user/dashboard" },
          { label: "Dashboard" },
        ]}
      />

      <div className="space-y-6 max-w-4xl mx-auto w-full">
        {/* Income Items */}
        <div className="border rounded shadow-sm bg-white">
          <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
            Income Items
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left px-4 py-2">Item Name</th>
                <th className="text-right px-4 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Team Income</td>
                <td className="text-right px-4 py-2">0</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Club Income</td>
                <td className="text-right px-4 py-2">
                  {liveClubIncome.toFixed(6)}
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Club Bonus</td>
                <td className="text-right px-4 py-2">{user?.clubsBonus}</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Royalty</td>
                <td className="text-right px-4 py-2">{user?.royaltyIncome}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Balance Summary */}
        <div className="border rounded shadow-sm bg-white max-w-md">
          <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
            Balance Summary
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left">Balance Item</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Total Income</td>
                <td className="text-right px-4 py-2">
                  {liveTotalBalance.toFixed(6)}
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">Total Withdrawed</td>
                <td className="text-right px-4 py-2">0</td>
              </tr>
              <tr className="bg-green-600 text-white font-semibold">
                <td className="px-4 py-2">Balance</td>
                <td className="text-right px-4 py-2">
                  {liveTotalBalance.toFixed(6)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="flex w-full items-center justify-end">
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
}
