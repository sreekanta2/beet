"use client";
import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import {
  Banknote,
  Eye,
  EyeOff,
  FileText,
  Info,
  Key,
  Loader2,
  Shield,
  Store,
  TrendingUp,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";
import DepositModal from "../components/transferModal";

export default function AccountDashboard() {
  const { data: session } = useSession();
  const telephone = session?.user?.telephone;
  const { data, error, isLoading } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher
  );
  const router = useRouter();
  const [balanceVisible, setBalanceVisible] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);

  const handleRoute = (url: string) => {
    router.push(url);
  };

  const handleBalanceClick = () => {
    if (!balanceVisible && !balanceLoading) {
      setBalanceLoading(true);
      // Simulate 3-second loading delay
      setTimeout(() => {
        setBalanceLoading(false);
        setBalanceVisible(true);
      }, 500);
    } else {
      setBalanceVisible(!balanceVisible);
    }
  };

  // Reset balance visibility when data changes
  useEffect(() => {
    setBalanceVisible(false);
    setBalanceLoading(false);
  }, [data]);

  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 font-sans">
      <div className="container mx-auto px-4 max-w-4xl">
        <Breadcrumb items={[{ label: "Dashboard" }]} />

        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, <span className="text-primary">Mrk</span>! 👋
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <Store className="w-4 h-4" />
                <span className="text-sm">
                  Shop Name:{" "}
                  <span className="font-semibold text-primary">Mrk</span>
                </span>
              </div>
            </div>

            {/* Balance Card with Reveal Feature */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 min-w-[200px]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-100 text-sm font-medium">
                  Total Balance
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBalanceClick}
                  className="h-6 w-6 p-0 hover:bg-blue-400/20 text-blue-100"
                >
                  {balanceVisible ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                {balanceLoading ? (
                  <div className="flex items-center gap-2 text-blue-100">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading...</span>
                  </div>
                ) : balanceVisible ? (
                  <span className="text-2xl font-bold text-white">
                    {formatBalance(data?.user?.totalBalance)}
                  </span>
                ) : (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-2 h-6 bg-blue-300 rounded-full animate-pulse"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      />
                    ))}
                  </div>
                )}
                <Banknote className="w-6 h-6 text-blue-200" />
              </div>

              {!balanceVisible && !balanceLoading && (
                <p className="text-blue-200 text-xs mt-2 text-center">
                  Click eye icon to reveal
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Quick Actions & Shop Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={() => handleRoute("/shoper/shop-details")}
                    className="h-16 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 rounded-lg flex flex-col gap-1 transition-all duration-200"
                  >
                    <Info className="w-5 h-5" />
                    <span className="text-xs font-medium">Shop Details</span>
                  </Button>
                  <Button
                    onClick={() => handleRoute("/shoper/edit-info")}
                    className="h-16 bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 rounded-lg flex flex-col gap-1 transition-all duration-200"
                  >
                    <User className="w-5 h-5" />
                    <span className="text-xs font-medium">Edit Account</span>
                  </Button>
                  <Button
                    onClick={() => handleRoute("/shoper/change-password")}
                    className="h-16 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 rounded-lg flex flex-col gap-1 transition-all duration-200"
                  >
                    <Key className="w-5 h-5" />
                    <span className="text-xs font-medium">Change Password</span>
                  </Button>
                  <Button
                    onClick={() => handleRoute("/shoper/transections-history")}
                    className="h-16 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 rounded-lg flex flex-col gap-1 transition-all duration-200"
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-xs font-medium">
                      Transaction History
                    </span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Deposit Section */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Banknote className="w-5 h-5 text-primary" />
                  Deposit Funds
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <DepositModal />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stats & Info */}
          <div className="space-y-6">
            {/* Shopper ID Card */}
            <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Shopper ID
                  </h2>
                </div>
                <div className="text-center p-4 bg-gradient-to-br from-primary/10 to-blue-100 rounded-lg border border-primary/20">
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Your Unique ID
                  </p>
                  <p className="text-3xl font-bold text-primary font-mono tracking-wide">
                    {data?.user?.serialNumber || "---"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Income */}
            <Card className="border-gray-200 shadow-sm bg-gradient-to-br from-green-50 to-emerald-100">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h2 className="text-lg font-semibold text-gray-900">
                    Transaction Income
                  </h2>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-green-200 shadow-sm">
                  <p className="text-gray-600 text-sm font-medium mb-2">
                    Total Earnings
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {formatBalance(data?.user?.teamIncome)}
                  </p>
                  <div className="mt-2 text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                    + Active Income
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {/* <Card className="border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Stats
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Today's Sales</span>
                    <span className="font-semibold text-blue-700">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">This Month</span>
                    <span className="font-semibold text-green-700">$0.00</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">Total Orders</span>
                    <span className="font-semibold text-purple-700">0</span>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-xs text-gray-600">
              Your account is secured with advanced encryption
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
