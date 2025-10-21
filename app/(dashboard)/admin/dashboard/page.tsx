"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllUsers } from "@/config/users";
import { User } from "@prisma/client";
import {
  Award,
  BarChart3,
  Download,
  Filter,
  Minus,
  Plus,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { data: session } = useSession();
  const [filterId, setFilterId] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<null | "deposit" | "withdraw">(
    null
  );

  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    averagePoints: 0,
    activeToday: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [filterId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ search: filterId });
      setUsers(data?.data || []);

      if (data?.data) {
        const totalPoints = data.data.reduce(
          (sum: number, user: User) => sum + (user.deposit || 0),
          0
        );
        const activeToday = data.data.filter(
          (user: { createdAt: string | number | Date }) => {
            const today = new Date();
            const userDate = new Date(user.createdAt);
            return userDate.toDateString() === today.toDateString();
          }
        ).length;

        setStats({
          totalUsers: data.data.length,
          totalPoints,
          averagePoints:
            data.data.length > 0
              ? Math.round(totalPoints / data.data.length)
              : 0,
          activeToday,
        });
      }
    } catch (error) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const handleSendPoints = async (type: "deposit" | "withdraw") => {
    if (!selectedUser || points <= 0) {
      toast.error("Please enter a valid points amount");
      return;
    }

    try {
      const userId = session?.user?.id; // ✅ Ensure admin/session userId is included

      if (!userId) {
        toast.error("Session expired. Please log in again.");
        return;
      }

      if (type === "deposit") {
        const result = await fetch("/api/shoper/transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sId: selectedUser?.serialNumber,
            amount: Number(points),
            role: selectedUser?.role,
            userId, // ✅ include here
          }),
        });

        const data = await result.json();
        console.log(data);
        if (data.success) {
          toast.success(`Deposited ${points} points to ${selectedUser.name}`);
          fetchUsers();
        } else {
          toast.error(data?.error || "Failed to deposit points");
        }
      } else {
        // Withdraw logic
        const result = await fetch("/api/admin/withdraw", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: selectedUser.id, // ✅ target user
            amount: points,
            adminId: userId, // ✅ send admin’s ID for audit
          }),
        });

        const data = await result.json();
        if (data.success) {
          toast.success(`Withdrew ${points} points from ${selectedUser.name}`);
          fetchUsers();
        } else {
          toast.error(data?.message || "Failed to withdraw points");
        }
      }
    } catch (error) {
      toast.error("Failed to process transaction");
    } finally {
      setOpenDialog(null);
      setPoints(0);
      setSelectedUser(null);
    }
  };

  const getPointsColor = (points: number) => {
    if (points >= 1000) return "text-green-600 bg-green-50 border-green-200";
    if (points >= 500) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  const getStatusColor = (user: User) => {
    const points = user.deposit || 0;
    if (points >= 1000) return "text-emerald-600";
    if (points >= 500) return "text-blue-600";
    return "text-gray-500";
  };

  const exportUsers = () => {
    toast.success("Exporting user data...");
    // Export logic would go here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100/30 p-4 lg:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 text-sm">
              Manage users, points distribution, and system operations
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={exportUsers} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Button onClick={fetchUsers} disabled={loading} className="gap-2">
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Navigation */}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-blue-900">
                Total Users
              </CardTitle>
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-4 w-4 text-blue-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">
                {stats.totalUsers}
              </div>
              <p className="text-xs text-blue-700/80 mt-1">
                +{stats.activeToday} today
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-green-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-emerald-900">
                Total Points
              </CardTitle>
              <div className="bg-emerald-100 p-2 rounded-lg">
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-900">
                {stats.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-700/80 mt-1">
                Across all accounts
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-amber-50 to-orange-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-amber-900">
                Avg. Points
              </CardTitle>
              <div className="bg-amber-100 p-2 rounded-lg">
                <BarChart3 className="h-4 w-4 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-900">
                {stats.averagePoints.toLocaleString()}
              </div>
              <p className="text-xs text-amber-700/80 mt-1">Per user average</p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-sm bg-gradient-to-br from-purple-50 to-violet-50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-medium text-purple-900">
                Active Today
              </CardTitle>
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">
                {stats.activeToday}
              </div>
              <p className="text-xs text-purple-700/80 mt-1">
                New registrations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Card */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">
                  User Management
                </CardTitle>
                <CardDescription>
                  Manage user accounts and point balances
                </CardDescription>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1 min-w-[280px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search users by ID, name, or phone..."
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="pl-10 border-gray-300 focus:border-blue-300"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setFilterId("")}
                    disabled={!filterId}
                    className="gap-2"
                  >
                    <Filter className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="border-t">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/80 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      User
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Contact
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Points
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3 text-gray-500">
                          <RefreshCw className="h-8 w-8 animate-spin" />
                          <p className="text-sm">Loading users...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-12">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <Users className="h-12 w-12 text-gray-300" />
                          <div className="text-center">
                            <p className="text-gray-500 font-medium">
                              No users found
                            </p>
                            <p className="text-gray-400 text-sm mt-1">
                              {filterId
                                ? "Try adjusting your search"
                                : "No users in the system"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow
                        key={user.id}
                        className="group hover:bg-blue-50/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg w-10 h-10 flex items-center justify-center">
                              <span className="font-semibold text-blue-700 text-sm">
                                {user.name?.charAt(0).toUpperCase() || "U"}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 group-hover:text-blue-900 transition-colors">
                                {user.name || "Unnamed User"}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                ID: {user.serialNumber}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {user.telephone}
                          </div>
                          <div className="text-xs text-gray-400">
                            {user.email}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={`font-mono text-sm font-semibold border-2 ${getPointsColor(
                              user.deposit || 0
                            )}`}
                          >
                            {user.deposit?.toLocaleString() || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`text-xs font-medium ${getStatusColor(
                              user
                            )}`}
                          >
                            {user?.role}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDialog("deposit");
                              }}
                              className="gap-1 bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md transition-all"
                            >
                              <Plus className="h-3.5 w-3.5" />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDialog("withdraw");
                              }}
                              className="gap-1 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 shadow-sm hover:shadow-md transition-all"
                            >
                              <Minus className="h-3.5 w-3.5" />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Points Management Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div
                className={`p-2 rounded-lg ${
                  openDialog === "deposit"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-600"
                }`}
              >
                {openDialog === "deposit" ? (
                  <Plus className="h-5 w-5" />
                ) : (
                  <Minus className="h-5 w-5" />
                )}
              </div>
              <div>
                <div className="font-semibold">
                  {openDialog === "deposit"
                    ? "Deposit Points"
                    : "Withdraw Points"}
                </div>
                <div className="text-sm font-normal text-gray-500 mt-1">
                  {openDialog === "deposit"
                    ? "Add points to user account"
                    : "Remove points from user account"}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-2">
            {selectedUser && (
              <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-4 space-y-3 border">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Customer:
                  </span>
                  <span className="text-sm font-semibold text-gray-900">
                    {selectedUser.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Current Balance:
                  </span>
                  <span className="text-sm font-bold text-blue-600">
                    {selectedUser.deposit?.toLocaleString() || 0} points
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">
                    Phone:
                  </span>
                  <span className="text-sm font-mono text-gray-600">
                    {selectedUser.telephone}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label
                htmlFor="points"
                className="text-sm font-medium text-gray-700"
              >
                Amount to {openDialog === "deposit" ? "deposit" : "withdraw"}
              </label>
              <div className="relative">
                <Input
                  id="points"
                  type="number"
                  min="1"
                  placeholder="0"
                  value={points || ""}
                  onChange={(e) => setPoints(Number(e.target.value))}
                  className="text-lg font-medium pl-4 pr-20 py-6 border-2 focus:border-blue-300 transition-colors"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <span className="text-gray-500 font-medium">points</span>
                </div>
              </div>
            </div>

            {openDialog === "withdraw" &&
              selectedUser &&
              points > (selectedUser.deposit || 0) && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <Minus className="h-4 w-4 text-red-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-red-800">
                        Insufficient Balance
                      </p>
                      <p className="text-sm text-red-600 mt-1">
                        User only has{" "}
                        {selectedUser.deposit?.toLocaleString() || 0} points
                        available.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenDialog(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleSendPoints(openDialog!)}
              disabled={
                points <= 0 ||
                (openDialog === "withdraw" &&
                  points > (selectedUser?.deposit || 0))
              }
              className={`flex-1 gap-2 ${
                openDialog === "deposit"
                  ? "bg-green-600 hover:bg-green-700 shadow-sm hover:shadow-md"
                  : "bg-red-600 hover:bg-red-700 shadow-sm hover:shadow-md"
              } transition-all`}
            >
              {openDialog === "deposit" ? (
                <>
                  <Plus className="h-4 w-4" />
                  Deposit Points
                </>
              ) : (
                <>
                  <Minus className="h-4 w-4" />
                  Withdraw Points
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
