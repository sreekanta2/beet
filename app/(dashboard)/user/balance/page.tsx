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

  // SWR for fetching user info from API
  const { data, error, isLoading } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher,
    {
      refreshInterval: 100, // fetch fresh data every 10 seconds
      revalidateOnFocus: false,
    }
  );

  const user: any | undefined = data?.user;

  // State for smooth per-second income growth
  const [displayBalance, setDisplayBalance] = useState<number>(0);
  useEffect(() => {
    const updateBalance = async () => {
      const a = await fetch("/api/corn");
    };
    updateBalance();
  }, [1000]);

  useEffect(() => {
    if (!user) return;

    // Base data from API
    const initialBalance = Number(user.totalBalance ?? 0);
    const clubsCount = Number(user.clubCount ?? 0) || 0;
    const clubRatePerDay = 0.1 * clubsCount; // 0.1 per club per day

    setDisplayBalance(initialBalance);

    // Increase balance every second in real-time
    const interval = setInterval(() => {
      const perSecondIncrease = clubRatePerDay / 86400; // 86400 seconds in a day
      setDisplayBalance((prev) => prev + perSecondIncrease);
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
        {/* Header */}
        <div className="flex items-center justify-between md:justify-start md:gap-28">
          <h1 className="text-xl font-semibold">
            My Point:{" "}
            <span className="font-bold text-gray-800">
              {displayBalance.toFixed(6)}
            </span>
          </h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded">
            Team Point
          </button>
        </div>

        {/* Income Items */}
        <div className="grid md:grid-cols-2 gap-6">
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
                {[
                  ["Team Income", user?.teamIncome ?? 0],
                  ["Club Income", user?.clubsIncome.toFixed(6) ?? 0],
                  ["Club Bonus", user?.clubsBonus ?? 0],
                  ["Royalty", user?.royaltyIncome ?? 0],
                ].map(([name, amount], i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{name}</td>
                    <td className="text-right px-4 py-2">{Number(amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Withdraw History */}
          <div className="border rounded shadow-sm bg-white">
            <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
              Withdraw History (Mobile Banking)
            </h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">Withdraw Date</th>
                  <th className="px-4 py-2 text-left">Mobile Number</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-gray-500">—</td>
                  <td className="px-4 py-2 text-gray-500">—</td>
                  <td className="px-4 py-2 text-right text-gray-500">—</td>
                  <td className="px-4 py-2 text-center text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
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
              {[
                ["Total Income", displayBalance.toFixed(6)],
                ["Total Withdrawed", 0],
              ].map(([name, amount], i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{name}</td>
                  <td className="text-right px-4 py-2">
                    {Number(amount).toFixed(4)}
                  </td>
                </tr>
              ))}
              <tr className="bg-green-600 text-white font-semibold">
                <td className="px-4 py-2">Balance</td>
                <td className="text-right px-4 py-2">
                  {displayBalance.toFixed(6)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Withdraw Button */}
        <div className="flex w-full items-center justify-end">
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
}
