"use client";
import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { fetcher } from "@/lib/utils";
import {
  Banknote,
  Check,
  Copy,
  CreditCardIcon,
  DollarSign,
  Facebook,
  FileText,
  Key,
  MessageCircle,
  Share,
  Share2,
  Twitter,
  User,
  Users,
  X,
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

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[
          { label: "Home", href: "/user/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div className="w-full max-w-4xl mt-4 text-sm bg-white rounded-md  ">
        <div className="text-sm text-gray-700 mb-1">
          Welcome{" "}
          <span className="font-semibold text-primary">{data?.user?.name}</span>{" "}
          !
        </div>
        <div className="flex justify-between items-center mb-6">
          <Card className="w-32 border border-gray-300 shadow-none">
            <CardContent className="p-3 text-center leading-none">
              <p className="text-gray-600 text-sm font-medium "> ID</p>

              <p className="text-2xl font-bold text-gray-600   border-t border-dotted border-black">
                {data?.user?.serialNumber}
              </p>
            </CardContent>
          </Card>
          <Button
            onClick={() => handleRoute("/user/units")}
            size="xs"
            className="bg-primary max-w-[200px] w-full  text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Banknote size={24} />
            <span>Units</span>
          </Button>
        </div>
        <div className="block md:hidden space-y-6  my-6">
          <div className="border bg-primary p-2 rounded-md">
            <Image
              src="/images/video-marketing (1).jpg"
              alt="video "
              width={600}
              height={800}
            />
          </div>
          <div className="border bg-primary p-2 rounded-md">
            <Image
              src="/images/online-img.jpg"
              alt="video "
              width={600}
              height={600}
            />
          </div>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Account</h2>

        <div className=" grid grid-cols-2 md:grid-cols-4  gap-4">
          <Button
            onClick={() => handleRoute("/user/balance")}
            size="xs"
            className="bg-primary  w-full  text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Banknote size={24} />
            <span>Balance</span>
          </Button>
          <Button
            onClick={() => handleRoute("/user/transections-history")}
            className="bg-primary   w-full  text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <FileText size={24} /> Transaction History
          </Button>
          <Button
            onClick={() => handleRoute("/user/edit-info")}
            className="bg-primary   w-full text-white   flex-col h-full py-2 text-xs rounded-md flex items-center justify-center gap-2"
          >
            <User size={24} /> Edit Account
          </Button>
          <Button
            onClick={() => handleRoute("/user/change-password")}
            className="bg-primary   w-full    text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Key size={24} /> Change Password
          </Button>

          <Button
            onClick={() => handleRoute("/user/card-registration")}
            className="bg-primary  w-full    text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <CreditCardIcon size={24} /> Card Registration
          </Button>
          <Button
            onClick={() => handleRoute("/user/upay")}
            className="bg-primary   w-full    text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <DollarSign size={24} /> Upay
          </Button>
        </div>
        <h1 className="text-xl  mt-4">Team:</h1>
        <div className=" grid grid-cols-2 md:grid-cols-4  gap-4">
          <Button
            onClick={() => handleRoute("/user/team")}
            className="bg-primary  w-full    text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Users size={24} /> Teams
          </Button>
          <Button
            onClick={() => setShareModalOpen(true)}
            className="bg-primary w-full text-white py-2 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2 hover:bg-primary/90 transition-colors"
          >
            <Share size={24} /> Share
          </Button>
          {/* Custom Share Modal */}
          {shareModalOpen && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
                {/* Header */}
                <div className="bg-gradient-to-r from-primary to-blue-600 px-6 py-4 rounded-t-2xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-5 h-5 text-white" />
                      <h2 className="text-xl font-bold text-white">
                        Share Referral Link
                      </h2>
                    </div>
                    <button
                      onClick={() => setShareModalOpen(false)}
                      className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Referral Code */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl border border-blue-100">
                    <p className="text-sm text-gray-600 mb-2">
                      Your Referral Code:
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary bg-white px-3 py-2 rounded-lg border shadow-sm">
                        {referralCode}
                      </span>
                      <Button
                        onClick={handleCopyLink}
                        className="bg-primary hover:bg-primary/90 text-white shadow-sm"
                      >
                        {copied ? (
                          <Check className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Referral URL */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-gray-700">
                      Share this link:
                    </label>
                    <div className="flex gap-2">
                      <input
                        value={referralUrl}
                        readOnly
                        className="flex-1 border border-gray-300 bg-gray-50 font-mono text-sm px-3 py-2 rounded-lg"
                      />
                      <Button
                        onClick={handleCopyLink}
                        className="bg-primary hover:bg-primary/90 text-white whitespace-nowrap shadow-sm"
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

                  {/* Share Buttons */}
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">
                      Share on:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        onClick={() => handleShare("facebook")}
                        className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white flex items-center gap-2 py-2 shadow-sm"
                      >
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </Button>
                      <Button
                        onClick={() => handleShare("twitter")}
                        className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white flex items-center gap-2 py-2 shadow-sm"
                      >
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </Button>
                      <Button
                        onClick={() => handleShare("whatsapp")}
                        className="bg-[#25D366] hover:bg-[#25D366]/90 text-white flex items-center gap-2 py-2 shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        WhatsApp
                      </Button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="bg-gray-50 p-4 rounded-xl border text-center">
                    <p className="text-sm text-gray-600">
                      Invite friends and earn rewards! Share your referral link
                      to grow your team.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
