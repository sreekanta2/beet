"use client";
import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Banknote,
  CreditCardIcon,
  DollarSign,
  FileText,
  Key,
  User,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AccountDashboard() {
  const router = useRouter();
  const handleRoute = (url: string) => {
    router.push(url);
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
          Welcome <span className="font-semibold text-primary">Mrk</span> !
        </div>
        <div className="flex justify-between items-center mb-6">
          <Card className="w-32 border border-gray-300 shadow-none">
            <CardContent className="p-3 text-center">
              <p className="text-gray-600 text-sm font-medium "> ID</p>
              ...........................
              <p className="text-2xl font-bold text-primary">11749</p>
            </CardContent>
          </Card>
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
            onClick={() => handleRoute("#")}
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
        </div>
        <h1 className="text-xl  mt-4">Team:</h1>
        <div className=" grid grid-cols-2 md:grid-cols-4  gap-4">
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
      </div>
    </div>
  );
}
