"use client";
import Breadcrumb from "@/components/breadcumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import {
  Banknote,
  Check,
  Coins,
  Copy,
  CreditCardIcon,
  DollarSign,
  Facebook,
  FileText,
  Key,
  MessageCircle,
  Share2,
  Star,
  Trophy,
  Twitter,
  User,
  UserPlus,
  Users,
  X,
  Zap,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function AccountDashboard() {
  const [referralUrl, setReferralUrl] = useState("");
  const { data: session } = useSession();
  const telephone = session?.user?.telephone;
  const { data, error, isLoading } = useSWR(
    telephone ? `/api/users/${telephone}` : null,
    fetcher
  );

  const router = useRouter();
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRoute = (url: string) => {
    router.push(url);
  };

  // Generate referral URL
  const referralCode = data?.user?.referralCode || data?.user?.serialNumber;
  useEffect(() => {
    if (typeof window !== "undefined") {
      setReferralUrl(
        `${window.location.origin}/auth/sign-up?ref=${referralCode}`
      );
    }
  }, [referralCode]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleShare = (platform: string) => {
    const text = `Join me on this amazing platform! Use my referral code: ${referralCode}`;

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            referralUrl
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${encodeURIComponent(referralUrl)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(text + " " + referralUrl)}`,
          "_blank"
        );
        break;
      default:
        break;
    }
  };

  // Quick actions data
  const quickActions = [
    {
      icon: Banknote,
      label: "Balance",
      route: "/user/balance",
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-gradient-to-br",
    },
    {
      icon: FileText,
      label: "Transactions",
      route: "/user/transections-history",
      color: "from-blue-500 to-cyan-600",
      bgColor: "bg-gradient-to-br",
    },
    {
      icon: User,
      label: "Edit Profile",
      route: "/user/edit-info",
      color: "from-purple-500 to-indigo-600",
      bgColor: "bg-gradient-to-br",
    },
    {
      icon: Key,
      label: "Security",
      route: "/user/change-password",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-gradient-to-br",
    },
    {
      icon: CreditCardIcon,
      label: "Cards",
      route: "/user/card-registration",
      color: "from-pink-500 to-rose-600",
      bgColor: "bg-gradient-to-br",
    },
    {
      icon: DollarSign,
      label: "E-Wallet",
      route: "/user/upay",
      color: "from-teal-500 to-green-600",
      bgColor: "bg-gradient-to-br",
    },
  ];

  const teamActions = [
    {
      icon: Users,
      label: "My Team",
      route: "/user/teams",
      color: "from-indigo-500 to-purple-600",
      description: "Manage your network",
    },
    {
      icon: UserPlus,
      label: "Invite Friends",
      route: "#",
      color: "from-amber-500 to-orange-600",
      description: "Earn rewards",
      action: () => setShareModalOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 font-sans">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Breadcrumb items={[{ label: "Dashboard" }]} />

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mt-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {data?.user?.name?.charAt(0) || "U"}
                </div>
                <div>
                  <h1 className="text-2xl font-bold">
                    Welcome back,{" "}
                    <span className="text-blue-200">{data?.user?.name}</span>!
                  </h1>
                  <p className="text-slate-300">Good to see you again</p>
                </div>
              </div>
            </div>

            <div className="flex  w-full items-center justify-between gap-4">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 shadow-xl">
                <CardContent className="p-4 text-center">
                  <p className="text-white/80 text-sm font-medium">Your ID</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    #{data?.user?.serialNumber}
                  </p>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-4">
                <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-default-700 border-0 px-3 py-1 text-sm">
                  <Coins className="w-3 h-3 mr-1" />
                  My Point: {data?.user?.deposit}
                </Badge>
                {data?.user?.cachedClubsCount > 0 && (
                  <Button
                    onClick={() => handleRoute("/user/units")}
                    className={`  text-white   flex flex-col gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0`}
                  >
                    Units
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 mt-8">
        {/* Stats Grid */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Balance
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {data?.user?.totalBalance +
                      data?.user?.royaltyIncome +
                      data?.user?.royaltyIncome +
                      data?.user?.royaltyIncome +
                      data?.user?.teamIncome}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">
                    Team Members
                  </p>
                  <p className="text-3xl font-bold mt-2">
                    {data?.user?.referrals?.length}
                  </p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-2xl border-0 transform hover:scale-105 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100 text-sm font-medium">
                    Your Level
                  </p>
                  <p className="text-3xl font-bold mt-2">Starter</p>
                </div>
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Trophy className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={() => handleRoute(action.route)}
                    className={`${action.bgColor} ${action.color} text-white h-24 flex flex-col gap-3 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0`}
                  >
                    <action.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Team Section */}
            <Card className="shadow-2xl border-0 overflow-hidden mt-6">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-indigo-900 to-purple-700 px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-indigo-300" />
                    <h2 className="text-xl font-semibold text-white">
                      Team & Network
                    </h2>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {teamActions.map((action, index) => (
                      <Button
                        key={index}
                        onClick={
                          action.action || (() => handleRoute(action.route))
                        }
                        className={`bg-gradient-to-br ${action.color} text-white h-20 flex flex-col gap-2 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border-0`}
                      >
                        <action.icon className="h-5 w-5" />
                        <div>
                          <span className="text-sm font-medium block">
                            {action.label}
                          </span>
                          <span className="text-xs opacity-90">
                            {action.description}
                          </span>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Promo & Referral */}
          <div className="space-y-6">
            {/* Referral Card */}
            <Card className="shadow-2xl border-0 overflow-hidden bg-gradient-to-br from-violet-600 to-purple-700 text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <h3 className="font-semibold text-lg">Invite & Earn</h3>
                </div>
                <p className="text-violet-100 text-sm mb-4">
                  Share your referral code and earn amazing rewards when friends
                  join!
                </p>
                <Button
                  onClick={() => setShareModalOpen(true)}
                  className="w-full bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Referral Link
                </Button>
              </CardContent>
            </Card>

            {/* Promo Cards
            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-white" />
                    <h3 className="font-semibold text-white text-sm">
                      Special Offer
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg mb-3 flex items-center justify-center">
                    <Image
                      src="/images/video-marketing (1).jpg"
                      alt="Promotional Video"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <p className="text-gray-600 text-sm text-center">
                    Discover new opportunities
                  </p>
                </div>
              </CardContent>
            </Card> */}

            <Card className="shadow-2xl border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-white" />
                    <h3 className="font-semibold text-white text-sm">
                      Featured
                    </h3>
                  </div>
                </div>
                <div className="p-4">
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg mb-3 flex items-center justify-center">
                    <Image
                      src="/images/online-img.jpg"
                      alt="Online Platform"
                      width={200}
                      height={120}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <p className="text-gray-600 text-sm text-center">
                    Explore our platform features
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setShareModalOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Modal Content */}
            <div className="bg-white rounded-3xl shadow-2xl transform animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
              {/* Header - Fixed */}
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-5 rounded-t-3xl flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-xl">
                      <Share2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        Share & Earn
                      </h2>
                      <p className="text-blue-100 text-sm">
                        Invite friends and get rewards
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShareModalOpen(false)}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6 space-y-6">
                  {/* Referral Code */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-2xl border border-purple-100">
                    <p className="text-sm text-gray-600 mb-3 font-medium">
                      Your Unique Code:
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 bg-white px-4 py-3 rounded-xl border-2 border-purple-200 shadow-sm">
                        <span className="text-2xl font-bold text-purple-600 font-mono">
                          {referralCode}
                        </span>
                      </div>
                      <Button
                        onClick={handleCopyLink}
                        size="sm"
                        className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg px-4 py-3"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Share Links */}
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">
                      Share via:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleShare("facebook")}
                        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white flex flex-col gap-2 py-4 h-auto shadow-lg rounded-xl"
                      >
                        <Facebook className="w-5 h-5" />
                        <span className="text-xs">Facebook</span>
                      </Button>
                      <Button
                        onClick={() => handleShare("twitter")}
                        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white flex flex-col gap-2 py-4 h-auto shadow-lg rounded-xl"
                      >
                        <Twitter className="w-5 h-5" />
                        <span className="text-xs">Twitter</span>
                      </Button>
                      <Button
                        onClick={() => handleShare("whatsapp")}
                        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white flex flex-col gap-2 py-4 h-auto shadow-lg rounded-xl"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-xs">WhatsApp</span>
                      </Button>
                    </div>
                  </div>

                  {/* Copy Link Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Or copy referral link:
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={referralUrl}
                        readOnly
                        className="flex-1 border border-gray-300 bg-gray-50 font-mono text-xs px-3 py-3 rounded-xl"
                      />
                      <Button
                        onClick={handleCopyLink}
                        className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white whitespace-nowrap shadow-lg px-4"
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-1" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Rewards Info */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-2xl border border-amber-200 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-4 h-4 text-amber-600" />
                      <p className="text-sm font-semibold text-amber-800">
                        Earn Amazing Rewards!
                      </p>
                    </div>
                    <p className="text-xs text-amber-700">
                      Get exclusive bonuses for every friend who joins using
                      your referral code
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
