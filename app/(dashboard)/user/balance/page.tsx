"use client";

import Breadcrumb from "@/components/breadcumb";
import { Withdraw } from "@prisma/client";
import {
  Award,
  BanknoteIcon,
  Clock,
  Crown,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from "lucide-react";
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
  console.log(error);
  const user = data?.user;

  const [liveClubIncome, setLiveClubIncome] = useState(0);
  const [liveTotalBalance, setLiveTotalBalance] = useState(0);

  // ⏱️ Smooth per-second income update
  useEffect(() => {
    if (!user) return;

    let currentClubIncome = user?.clubsIncome + user.perSecondIncome;
    let currentTotalBalance = user.totalBalance + user.perSecondIncome;

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
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Failed to Load
          </h3>
          <p className="text-gray-600">Please try refreshing the page.</p>
        </div>
      </div>
    );

  if (isLoading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="  mx-auto px-4 py-6 max-w-4xl">
        <Breadcrumb items={[{ label: "Income Dashboard" }]} variant="default" />

        {/* Header Section */}
        {/* <div className="mt-8 mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-2xl shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Income Dashboard
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Track your earnings and manage your balance in real-time
          </p>
        </div> */}

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 mt-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
              {data?.user?.teamIncome || 0}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-xl">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Units Income
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {liveClubIncome.toFixed(6)}
            </p>
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-xs text-green-600 font-medium">Active</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
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
              {user?.clubsBonus || "0.00"}
            </p>
            <div className="text-xs text-gray-500 mt-2">Bonus Earnings</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-xl">
                <BanknoteIcon className="w-6 h-6 text-orange-600" />
              </div>
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Royalty Income
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {user?.royaltyIncome || "0.00"}
            </p>
            <div className="text-xs text-gray-500 mt-2">Passive Income</div>
          </div>
        </div>

        <div className="grid grid-cols-1  ">
          {/* Balance Summary */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Balance Summary
                </h2>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      Total Income
                    </h3>
                    <p className="text-sm text-gray-600">All-time earnings</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-gray-900">
                      {liveTotalBalance.toFixed(6)}
                    </p>
                    <div className="flex items-center justify-end space-x-1">
                      <Clock className="w-3 h-3 text-blue-500" />
                      <span className="text-xs text-blue-600">Live</span>
                    </div>
                  </div>
                </div>

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

                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-5 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-lg">Available Balance</h3>
                      <p className="text-green-100 text-sm">
                        Ready for withdrawal
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {liveTotalBalance.toFixed(6)}
                      </p>
                      <div className="flex items-center justify-end space-x-1">
                        <Zap className="w-4 h-4 text-yellow-300" />
                        <span className="text-xs text-yellow-300">Active</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Withdraw Button */}
                <div className="flex justify-center pt-4">
                  <WithdrawButton />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Income Indicator */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Zap className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  Live Income Tracking
                </h3>
                <p className="text-sm text-gray-600">
                  Your balance updates in real-time every second
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
