"use client";

import Breadcrumb from "@/components/breadcumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@prisma/client";
import { Coins, Loader2, Trophy, UserCheck, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";
import ReferralTree from "./components/refuser";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data: session } = useSession();

  const { data, error, isLoading, mutate } = useSWR(
    session?.user?.id ? `/api/users/referrer/${session.user.id}` : null,
    fetcher
  );

  // 🧩 Recursive flatten function for all 4 levels
  const flattenReferrals = (users: any[]): any[] => {
    let result: any[] = [];
    for (const user of users) {
      result.push(user);
      if (user.referrals && user.referrals.length > 0) {
        result = result.concat(flattenReferrals(user.referrals));
      }
    }
    return result;
  };

  // ✅ Flatten all nested referrals (up to 4 levels)
  const allReferredUsers = data?.referredUsers
    ? flattenReferrals(data.referredUsers)
    : [];

  // 🧮 Calculate totals
  const totalReferrals = allReferredUsers.length;
  const totalTeamPoints = allReferredUsers.reduce(
    (sum: number, user: any) => sum + (user.cachedClubsCount || 0) * 100,
    0
  );

  // 🧠 Active users (those with nonzero club count)
  const activeUsers = allReferredUsers.filter(
    (u: User) => u.cachedClubsCount > 0
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: "Referred Users" }]} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {/* Total Referrals */}
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Referrals
                  </p>
                  <p className="text-3xl font-bold mt-2">{totalReferrals}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Users */}
          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold mt-2">{activeUsers}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Team Points */}
          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Total Team Points
                  </p>
                  <p className="text-3xl font-bold mt-2">{totalTeamPoints}</p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Coins className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Rank + Badge */}
          <Card className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">Your Rank</p>
                  <p className="text-3xl font-bold mt-2">
                    #{totalReferrals + 1}
                  </p>
                  <p className="text-sm mt-1 font-medium text-teal-50">
                    {data?.badgeLevel || "None"}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="shadow-xl border-0 mt-8 overflow-hidden">
          <CardContent className="p-0">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-700 px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-white">
                      Your Referred Users
                    </h2>
                    <p className="text-slate-300 text-xs">
                      Includes up to 4 referral levels
                    </p>
                  </div>
                </div>
                <Badge
                  variant="soft"
                  className="bg-white/20 text-white border-0 w-24 h-8"
                >
                  {totalReferrals} users
                </Badge>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {isLoading && (
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="relative">
                    <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                    <div className="absolute inset-0 border-4 border-blue-200 rounded-full animate-ping"></div>
                  </div>
                  <p className="text-gray-500 mt-4 font-medium">
                    Loading referred users...
                  </p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Failed to load referred users
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Please try refreshing the page
                  </p>
                  <button
                    onClick={() => mutate()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {!isLoading && allReferredUsers.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No referred users yet
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto">
                    Share your referral link to start earning rewards and grow
                    your network!
                  </p>
                </div>
              )}

              {!isLoading && allReferredUsers.length > 0 && (
                <div className="p-4">
                  <h2 className="text-lg font-semibold mb-4">
                    Referral Network
                  </h2>
                  <ReferralTree users={data.referredUsers || []} />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
