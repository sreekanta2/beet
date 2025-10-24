"use client";

import Breadcrumb from "@/components/breadcumb";
import { Withdraw } from "@prisma/client";
import {
  Award,
  BanknoteIcon,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
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

  // 🧩 SWR - fetch only once
  const { data, error, isLoading } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
      dedupingInterval: Infinity,
    }
  );
  console.log(data);
  const user = data?.user;
  const recentWithdraws = data?.recentWithdraws;

  // 🪄 Smooth live income counter without React re-renders
  useEffect(() => {
    if (!user) return;

    const clubRef = { current: user.clubsIncome };
    const royaltyRef = { current: user.royaltyIncome };
    const balanceRef = { current: user.totalBalance };

    const clubRate = user.perSecondClubIncome;
    const royaltyRate = user.perSecondRoyaltyIncome;

    const clubEl = document.getElementById("live-club-income");
    const royaltyEl = document.getElementById("live-royalty-income");
    const balanceEl = document.getElementById("live-total-balance");

    let lastTime = performance.now();

    const update = (now: number) => {
      const delta = (now - lastTime) / 1000; // seconds since last frame
      lastTime = now;

      clubRef.current += clubRate * delta;
      royaltyRef.current += royaltyRate * delta;
      balanceRef.current += (clubRate + royaltyRate) * delta;

      if (clubEl) clubEl.textContent = clubRef.current.toFixed(6).toString();
      if (royaltyEl)
        royaltyEl.textContent = royaltyRef.current.toFixed(6).toString();
      if (balanceEl)
        balanceEl.textContent = balanceRef.current.toFixed(6).toString();

      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  }, [user]);

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-medium">
        Failed to load data
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="mx-auto px-4 py-6 max-w-4xl">
        <Breadcrumb items={[{ label: "Income Dashboard" }]} variant="default" />

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          {/* Team Income */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Team Income
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {user?.teamIncome || 0}
            </p>
          </div>

          {/* Club Income (Live) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <Sparkles className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Units Income
            </h3>
            <p
              id="live-club-income"
              className="text-2xl font-bold text-gray-900"
            >
              {user?.clubsIncome.toFixed(6)}
            </p>
          </div>

          {/* Units Bonus */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-xl">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <Award className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Units Bonus
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {user?.clubsBonus || 0}
            </p>
          </div>

          {/* Royalty Income (Live) */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <BanknoteIcon className="w-6 h-6 text-orange-600" />
              </div>
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Royalty Income
            </h3>
            <p
              id="live-royalty-income"
              className="text-2xl font-bold text-gray-900"
            >
              {user?.royaltyIncome.toFixed(6)}
            </p>
            <div className="text-xs text-gray-500 mt-2">Passive Earnings</div>
          </div>
        </div>

        {/* Balance Summary */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4 text-white font-bold text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Balance Summary
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-col gap-4">
              {/* Total Withdrawn */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Total Withdrawn
                  </h3>
                  <p className="text-sm text-gray-600">
                    Amount successfully withdrawn
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {user?.withdraw
                      ?.filter((w: Withdraw) => w.status === "COMPLETED")
                      .reduce(
                        (sum: any, w: { amount: any }) => sum + w.amount,
                        0
                      ) || 0}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.withdraw?.length
                      ? `${
                          user.withdraw.filter(
                            (w: Withdraw) => w.status === "COMPLETED"
                          ).length
                        } completed`
                      : "No withdrawals"}
                  </p>
                </div>
              </div>

              {/* Pending Amount */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Pending Amount
                  </h3>
                  <p className="text-sm text-gray-600">
                    Withdrawals in processing
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">
                    {user?.withdraw
                      ?.filter((w: Withdraw) => w.status === "PENDING")
                      .reduce(
                        (sum: any, w: { amount: any }) => sum + w.amount,
                        0
                      ) || 0}
                  </p>
                  <p className="text-xs text-orange-400">
                    {user?.withdraw?.filter(
                      (w: Withdraw) => w.status === "PENDING"
                    ).length
                      ? `${
                          user.withdraw.filter(
                            (w: Withdraw) => w.status === "PENDING"
                          ).length
                        } pending`
                      : "No pending withdrawals"}
                  </p>
                </div>
              </div>
            </div>

            {recentWithdraws && recentWithdraws.length > 0 && (
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-wide">
                    Recent Withdrawals
                  </h3>
                  <div className="flex items-center space-x-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-gray-500">Live</span>
                  </div>
                </div>

                {/* Withdrawals List */}
                <div className="space-y-3">
                  {recentWithdraws.map((withdraw: any) => (
                    <div
                      key={withdraw.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-150 gap-2"
                    >
                      {/* Left Section - Service Info */}
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-semibold text-xs">
                            {withdraw.mobileBankingService.name.charAt(0)}
                          </span>
                        </div>

                        <div className="min-w-0  ">
                          <div className="flex   xs:items-center gap-1 xs:gap-2">
                            <span className="text-xs font-medium text-gray-900 truncate">
                              {withdraw.mobileBankingService.name}
                            </span>
                            <span className="text-xs w-fit text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full flex-shrink-0">
                              {withdraw.mobileBankingService.number}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              {new Date(withdraw.createdAt).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right Section - Status & Amount */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            withdraw.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : withdraw.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-800"
                              : withdraw.status === "FAILED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {withdraw.status}
                        </span>
                        <span className="text-xs font-bold text-gray-900 whitespace-nowrap">
                          {withdraw.amount}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Live Total Balance */}
            <div className="bg-gradient-to-r flex flex-col md:flex-row justify-between from-green-500 to-emerald-600 text-white p-5 rounded-xl">
              <h3 className="font-bold text-lg">Available Balance</h3>
              <p id="live-total-balance" className="text-2xl font-bold">
                {user?.totalBalance.toFixed(6)}
              </p>
            </div>

            <div className="flex justify-center">
              <WithdrawButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
