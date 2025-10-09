import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Cog, Mail, Phone, ShoppingCart, User } from "lucide-react";

export default function ShopDetails() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6  font-sans">
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "Shop Details" },
        ]}
      />
      <div className="w-full max-w-4xl   bg-white ">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Shop Details */}
          <Card className="border border-gray-300">
            <CardHeader className="bg-gray-100 border-b border-gray-300 p-3">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center p-0 gap-2">
                <ShoppingCart className="w-4 h-4 text-gray-700" /> Shop Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-200">
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Bogura Sadar</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <Calendar className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Mrk</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Mrk</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <ShoppingCart className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Mrk</span>
              </div>
            </CardContent>
          </Card>

          {/* Personal Details */}
          <Card className="border border-gray-300">
            <CardHeader className="bg-gray-100 border-b border-gray-300 p-3">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <User className="w-4 h-4 text-gray-700" /> Personal Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-200">
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <User className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Mrk</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <Calendar className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">Mrk</span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <Mail className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">
                  01788487098@gmail.com
                </span>
              </div>
              <div className="flex items-center gap-3 p-3">
                <Button className="bg-[#d9534f] hover:bg-[#c9302c] text-white p-2 rounded-sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <span className="text-gray-700 text-sm">01788487098</span>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card className="border border-gray-300">
            <CardHeader className="bg-gray-100 border-b border-gray-300 p-3">
              <CardTitle className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Cog className="w-4 h-4 text-gray-700" /> Options
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-gray-200 text-sm">
              <div className="flex justify-between p-3">
                <span className="text-gray-700">Calculation Type</span>
                <span className="text-gray-800 font-medium">Percent</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-gray-700">Calculation Amount</span>
                <span className="text-gray-800 font-medium">10</span>
              </div>
              <div className="flex justify-between p-3">
                <span className="text-gray-700">Approval Status</span>
                <span className="text-gray-800 font-medium">Approved</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button
            variant="outline"
            className="text-gray-700 border-gray-300 shadow-sm text-sm px-4 py-1 rounded-sm"
          >
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}
