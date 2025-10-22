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

  const { data, error, isLoading } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher,
    { revalidateOnFocus: false }
  );

  const user = data?.user;

  const [liveClubIncome, setLiveClubIncome] = useState(0);
  const [liveRoyaltyIncome, setLiveRoyaltyIncome] = useState(0);
  const [liveTotalBalance, setLiveTotalBalance] = useState(0);

  // ⏱️ Smooth per-second update
  useEffect(() => {
    if (!user) return;

    let currentClubIncome = user.clubsIncome + user.perSecondClubIncome;
    let currentRoyaltyIncome = user.royaltyIncome + user.perSecondRoyaltyIncome;
    let currentTotalBalance =
      user.totalBalance +
      user.perSecondClubIncome +
      user.perSecondRoyaltyIncome;

    setLiveClubIncome(currentClubIncome);
    setLiveRoyaltyIncome(currentRoyaltyIncome);
    setLiveTotalBalance(currentTotalBalance);

    const interval = setInterval(() => {
      currentClubIncome += user.perSecondClubIncome;
      currentRoyaltyIncome += user.perSecondRoyaltyIncome;
      currentTotalBalance +=
        user.perSecondClubIncome + user.perSecondRoyaltyIncome;

      setLiveClubIncome(currentClubIncome);
      setLiveRoyaltyIncome(currentRoyaltyIncome);
      setLiveTotalBalance(currentTotalBalance);
    }, 1000);

    return () => clearInterval(interval);
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

          {/* Club Income */}
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
            <p className="text-2xl font-bold text-gray-900">
              {liveClubIncome.toFixed(6)}
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
            <p className="text-2xl font-bold text-gray-900">
              {liveRoyaltyIncome.toFixed(6)}
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
            <div className="bg-gradient-to-r flex justify-between from-green-500 to-emerald-600 text-white p-5 rounded-xl">
              <h3 className="font-bold text-lg">Available Balance</h3>
              <p className="text-2xl font-bold">
                {liveTotalBalance.toFixed(6)}
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
