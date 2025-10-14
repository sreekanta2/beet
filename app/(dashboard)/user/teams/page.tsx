"use client";

import Breadcrumb from "@/components/breadcumb";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "@prisma/client";
import { Loader2, Star, Trophy, UserCheck, Users } from "lucide-react";
import { useSession } from "next-auth/react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page() {
  const { data: session } = useSession();
  const { data, error, isLoading, mutate } = useSWR(
    `/api/users/referrer/${session?.user?.id}`,
    fetcher
  );

  const referredUsers = data?.referredUsers || [];
  const totalReferrals = referredUsers.length;

  const getStatusBadge = (index: number) => {
    if (index === 0)
      return (
        <Badge className="bg-gradient-to-r from-amber-500 to-orange-500">
          New
        </Badge>
      );
    if (index > 0)
      return (
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-600">
          Active
        </Badge>
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb items={[{ label: "Referred Users" }]} />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
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

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Active Users
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {
                      referredUsers.filter((u: User) => u.cachedClubsCount > 0)
                        .length
                    }
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <UserCheck className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-lg border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Your Rank
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    #{totalReferrals + 1}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-full">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
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
                      People who joined through your referral link
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

              {!isLoading && referredUsers.length === 0 && (
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

              {!isLoading && referredUsers.length > 0 && (
                <div className="rounded-lg border border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-gray-50/80">
                      <TableRow className="hover:bg-gray-50/80">
                        <TableHead className="font-semibold text-gray-700 py-4">
                          <div className="flex items-center space-x-2 text-xs">
                            <span>#</span>
                            <span>ID</span>
                          </div>
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 text-xs">
                          User Details
                        </TableHead>
                        <TableHead className="font-semibold text-gray-700 py-4 text-right text-xs">
                          Status
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {referredUsers.map((user: User, index: number) => (
                        <TableRow
                          key={user.id}
                          className="hover:bg-gray-50/50 transition-colors border-b text-xs border-gray-100 last:border-b-0"
                        >
                          <TableCell className="py-4 text-xs">
                            <div className="flex  items-center space-x-3">
                              {user?.cachedClubsCount > 0 ? (
                                <div className="flex items-center justify-center w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full">
                                  <Star className="h-3 w-3 text-white fill-white" />
                                </div>
                              ) : (
                                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              )}
                              <span className="font-medium text-gray-600">
                                {user?.serialNumber}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex flex-col md:flex-row items-center space-x-3 text-xs">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                                {user.name?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.name || "Anonymous User"}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Created:{" "}
                                  {new Date(user?.createdAt).toDateString()}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-4 text-right">
                            {getStatusBadge(user?.cachedClubsCount)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
