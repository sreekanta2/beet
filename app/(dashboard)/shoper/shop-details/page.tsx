"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BadgeCheck,
  Building,
  Calculator,
  Calendar,
  Edit3,
  FileCheck,
  Loader2,
  MapPin,
  Plus,
  Shield,
  Store,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Shop {
  id: string;
  shopName: string;
  branch?: string;
  division: string;
  district: string;
  upazila: string;
  calculationType: string;
  calculationAmmount: string;
  agree: boolean;
  updatedAt?: string;
}

export default function ShopDetails() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const [form, setForm] = useState({
    shopName: "",
    userId: session?.user?.id,
    branch: "",
    division: "",
    district: "",
    upazila: "",
    calculationType: "",
    calculationAmmount: "",
    agree: false,
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 🧠 Fetch shop data
  useEffect(() => {
    (async () => {
      if (!session?.user?.id) {
        setFetching(false);
        return;
      }

      try {
        setFetching(true);
        const res = await fetch(`/api/shop?userId=${session.user.id}`);
        if (res.ok) {
          const data = await res.json();
          if (data.shops && data.shops.length > 0) {
            const shop = data.shops[0];
            setShop(shop);
            setForm({
              userId: session.user.id,
              shopName: shop.shopName || "",
              branch: shop.branch || "",
              division: shop.division || "",
              district: shop.district || "",
              upazila: shop.upazila || "",
              calculationType: shop.calculationType || "",
              calculationAmmount: shop.calculationAmmount || "",
              agree: shop.agree || false,
            });
          } else {
            setShop(null);
          }
        }
      } catch (error) {
        console.error("Failed to fetch shop:", error);
      } finally {
        setFetching(false);
      }
    })();
  }, [session?.user?.id]);

  // 🧾 Submit add/update form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let url = "/api/shop";
      let method: "POST" | "PUT" = "POST";

      if (shop?.id) {
        url = `/api/shop/${shop.id}`;
        method = "PUT";
      }

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setShop(data.shop);
        setOpen(false);
      } else {
        alert(data.error || "Failed to save shop info");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred while saving shop information");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading shop details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Shop Details
            </h1>
            <p className="text-gray-600">
              {shop
                ? "Manage your shop information and settings"
                : "Add your shop details to get started"}
            </p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg px-6 py-3 rounded-xl">
                {shop ? (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Shop
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Shop
                  </>
                )}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-gray-900">
                  {shop ? "Update Shop Details" : "Add New Shop"}
                </DialogTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {shop
                    ? "Update your shop information"
                    : "Enter your shop details to get started"}
                </p>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                {/* Shop Basic Info */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Store className="w-4 h-4" />
                    Basic Information
                  </h3>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Shop Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      value={form.shopName}
                      onChange={(e) =>
                        setForm({ ...form, shopName: e.target.value })
                      }
                      placeholder="Enter shop name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-700 mb-2">
                      Branch
                    </Label>
                    <Input
                      value={form.branch}
                      onChange={(e) =>
                        setForm({ ...form, branch: e.target.value })
                      }
                      placeholder="Enter branch name (optional)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location Details
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Division <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={form.division}
                        onChange={(e) =>
                          setForm({ ...form, division: e.target.value })
                        }
                        placeholder="Division"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        District <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={form.district}
                        onChange={(e) =>
                          setForm({ ...form, district: e.target.value })
                        }
                        placeholder="District"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Upazila <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={form.upazila}
                        onChange={(e) =>
                          setForm({ ...form, upazila: e.target.value })
                        }
                        placeholder="Upazila"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Calculator className="w-4 h-4" />
                    Calculation Settings
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Calculation Type <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        value={form.calculationType}
                        onChange={(e) =>
                          setForm({ ...form, calculationType: e.target.value })
                        }
                        placeholder="e.g., Percentage, Fixed"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2">
                        Calculation Amount{" "}
                        <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="number"
                        value={form.calculationAmmount}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            calculationAmmount: e.target.value,
                          })
                        }
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {shop ? "Updating..." : "Creating..."}
                    </>
                  ) : (
                    <>{shop ? "Update Shop" : "Create Shop"}</>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Shop Information Cards */}
        {shop ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Shop Information Card */}
            <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-blue-600 text-white pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Store className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">
                      Shop Information
                    </p>
                    <p className="text-lg font-bold">{shop.shopName}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Building className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Branch</p>
                    <p className="font-semibold text-gray-900">
                      {shop.branch || "Not specified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="font-semibold text-gray-900">
                      {shop.upazila}, {shop.district}, {shop.division}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Calculation Card */}
            <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-green-500 to-green-600 text-white pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">
                      Calculation Settings
                    </p>
                    <p className="text-lg font-bold">{shop.calculationType}</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <Calculator className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Calculation Type</p>
                    <p className="font-semibold text-gray-900">
                      {shop.calculationType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <BadgeCheck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Calculation Amount</p>
                    <p className="font-semibold text-gray-900 text-xl">
                      {shop.calculationAmmount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-600 text-white pb-4">
                <CardTitle className="flex items-center gap-3 text-white">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium opacity-90">
                      Shop Status
                    </p>
                    <p className="text-lg font-bold">Active</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                  <FileCheck className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Agreement Status</p>
                    <div
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        shop.agree
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shop.agree ? "✅ Agreed" : "❌ Not Agreed"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                  <Calendar className="w-5 h-5 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Last Updated</p>
                    <p className="font-semibold text-gray-900">
                      {shop.updatedAt
                        ? new Date(shop.updatedAt).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Verification</p>
                    <p className="font-semibold text-gray-900">Verified</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          // Empty State
          <Card className="border-0 shadow-lg rounded-2xl bg-white overflow-hidden">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Store className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Shop Added Yet
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                You haven't added any shop details yet. Add your shop
                information to start managing your business profile.
              </p>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Shop
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        {shop && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Shop Status</p>
                <p className="text-lg font-bold text-blue-700">Active</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Calculation Type</p>
                <p className="text-lg font-bold text-green-700">
                  {shop.calculationType}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="text-lg font-bold text-purple-700">
                  {shop.district}
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-gray-600 mb-1">Agreement</p>
                <p
                  className={`text-lg font-bold ${
                    shop.agree ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {shop.agree ? "Accepted" : "Pending"}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
