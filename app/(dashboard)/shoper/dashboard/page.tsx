"use client";
import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Banknote, FileText, Info, Key, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AccountDashboard() {
  const router = useRouter();
  const handleRoute = (url: string) => {
    router.push(url);
  };
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6  font-sans">
      <Breadcrumb
        items={[
          { label: "Home", href: "/shoper/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div className="w-full max-w-4xl   text-sm bg-white rounded-md  ">
        <div className="text-sm text-gray-700 mb-1">
          Welcome <span className="font-semibold text-primary">Mrk</span> !
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Shop Name: <span className="font-semibold text-primary">Mrk</span>
        </div>

        <div className="flex gap-3 mb-6 justify-between items-center">
          <div className="bg-gray-200 border p-3 rounded-md">
            <Button
              onClick={() => handleRoute("#")}
              size="xs"
              className="bg-primary   text-white px-4   rounded-md shadow-sm text-xs"
            >
              Transaction
            </Button>
          </div>
          <Button
            onClick={() => handleRoute("#")}
            size="xs"
            className="bg-primary  text-white px-4   rounded-md shadow-sm text-xs flex items-center gap-2"
          >
            <Banknote size={16} />
            <span>Balance</span>
          </Button>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">My Account</h2>

        <div className="flex justify-between items-center mb-6">
          <Card className="w-32 border border-gray-300 shadow-none">
            <CardContent className="p-3 text-center leading-[.1]">
              <p className="text-gray-600 text-sm font-medium ">Shopper ID</p>
              ...........................
              <p className="text-2xl font-bold text-primary">11749</p>
            </CardContent>
          </Card>

          <Button
            onClick={() => handleRoute("#")}
            size="lg"
            className="bg-primary   justify-center  h-full   text-white px-5   rounded-md text-sm shadow-sm flex flex-col    items-center gap-2"
          >
            <Banknote size={24} />
            <span className="text-start">Transaction Income</span>
          </Button>
        </div>

        <div className=" grid grid-cols-2 md:grid-cols-4  gap-4">
          <Button
            onClick={() => handleRoute("/shoper/shop-details")}
            className="bg-primary text-xs   w-full  text-white py-3   rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Info size={24} /> Shop Details
          </Button>
          <Button
            onClick={() => handleRoute("/shoper/edit-info")}
            className="bg-primary  w-full text-white   flex-col h-full py-3 text-xs rounded-md flex items-center justify-center gap-2"
          >
            <User size={24} /> Edit Account
          </Button>
          <Button
            onClick={() => handleRoute("/shoper/change-password")}
            className="bg-primary   w-full    text-white py-3 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <Key size={24} /> Change Password
          </Button>
          <Button
            onClick={() => handleRoute("/shoper/transections-history")}
            className="bg-primary   w-full  text-white py-3 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2"
          >
            <FileText size={24} /> Transaction History
          </Button>
          {/* <Button
            onClick={() => handleRoute("#")}
            className="bg-primary min-w-[100px] max-w-[150px] w-full text-white py-3 text-xs rounded-md flex flex-col h-full items-center justify-center gap-2 col-span-full"
          >
            <MapPin size={24} /> Shop Area
          </Button> */}
        </div>
      </div>
    </div>
  );
}
