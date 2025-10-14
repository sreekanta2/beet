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
import { Award, Minus, Plus, RefreshCw, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
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
  });

  useEffect(() => {
    fetchUsers();
  }, [filterId]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers({ search: filterId });
      setUsers(data?.data || []);

      // Calculate stats
      if (data?.data) {
        const totalPoints = data.data.reduce(
          (sum: number, user: User) => sum + (user.deposit || 0),
          0
        );
        setStats({
          totalUsers: data.data.length,
          totalPoints,
          averagePoints:
            data.data.length > 0
              ? Math.round(totalPoints / data.data.length)
              : 0,
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
      if (type === "deposit") {
        const result = await fetch("/api/earn", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: selectedUser.id, earned: points }),
        });

        const data = await result.json();

        if (data.success) {
          toast.success(`Deposited ${points} points to ${selectedUser.name}`);
          fetchUsers(); // Refresh data
        } else {
          toast.error(data?.message || "Failed to deposit points");
        }
      } else {
        // Withdraw logic would go here
        toast.error("Withdraw functionality not implemented yet");
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
    if (points >= 1000) return "text-green-600 font-semibold";
    if (points >= 500) return "text-blue-600";
    return "text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage user accounts and points
            </p>
          </div>
          <Button onClick={fetchUsers} disabled={loading} className="gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.totalPoints.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Across all users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Points
              </CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.averagePoints.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Per user</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>Search and manage user accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by Customer ID, Name, or Telephone..."
                  value={filterId}
                  onChange={(e) => setFilterId(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setFilterId("")}
                disabled={!filterId}
              >
                Clear
              </Button>
            </div>

            {/* Users Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead className="text-right">Points</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2 text-gray-500">
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          Loading users...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-gray-500"
                      >
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50/50">
                        <TableCell className="font-mono text-xs text-gray-600">
                          {user.serialNumber}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-gray-500">
                              ID: {user.id.slice(0, 8)}...
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs">
                          {user.telephone}
                        </TableCell>
                        <TableCell className="text-right text-xs">
                          <Badge
                            variant="outline"
                            className={`text-xs ${getPointsColor(
                              user.deposit || 0
                            )}`}
                          >
                            {user.deposit?.toLocaleString() || 0}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDialog("deposit");
                              }}
                              className="gap-1 bg-green-600 hover:bg-green-700 text-xs"
                            >
                              <Plus className="h-3 w-3 " />
                              Add
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedUser(user);
                                setOpenDialog("withdraw");
                              }}
                              className="gap-1 text-red-600 text-xs border-red-200 hover:bg-red-50 hover:text-red-700"
                            >
                              <Minus className="h-3 w-3" />
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

      {/* Points Dialog */}
      <Dialog open={!!openDialog} onOpenChange={() => setOpenDialog(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {openDialog === "deposit" ? (
                <>
                  <Plus className="h-5 w-5 text-green-600" />
                  Deposit Points
                </>
              ) : (
                <>
                  <Minus className="h-5 w-5 text-red-600" />
                  Withdraw Points
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {selectedUser && (
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Customer:</span>
                  <span className="text-sm">{selectedUser.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Current Points:</span>
                  <span className="text-sm font-semibold">
                    {selectedUser.deposit?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Telephone:</span>
                  <span className="text-sm">{selectedUser.telephone}</span>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <label htmlFor="points" className="text-sm font-medium">
                Points to {openDialog === "deposit" ? "deposit" : "withdraw"}
              </label>
              <Input
                id="points"
                type="number"
                min="1"
                placeholder={`Enter points to ${
                  openDialog === "deposit" ? "deposit" : "withdraw"
                }`}
                value={points || ""}
                onChange={(e) => setPoints(Number(e.target.value))}
                className="text-lg font-medium"
              />
            </div>

            {openDialog === "withdraw" &&
              selectedUser &&
              points > (selectedUser.deposit || 0) && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600 font-medium">
                    Insufficient points! User only has{" "}
                    {selectedUser.deposit?.toLocaleString() || 0} points.
                  </p>
                </div>
              )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => handleSendPoints(openDialog!)}
              disabled={
                points <= 0 ||
                (openDialog === "withdraw" &&
                  points > (selectedUser?.deposit || 0))
              }
              className={
                openDialog === "deposit"
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-red-600 hover:bg-red-700"
              }
            >
              {openDialog === "deposit" ? "Deposit Points" : "Withdraw Points"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
