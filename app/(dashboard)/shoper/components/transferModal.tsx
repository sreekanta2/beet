"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";

import { useEffect, useState } from "react";

interface UserInfo {
  id: string;
  name: string;
  serialNumber: string;
  role: "user" | "admin" | "shoper";
}

export default function DepositModal() {
  const [open, setOpen] = useState(false);
  const [sId, setSid] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingUser, setFetchingUser] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const { data: session } = useSession();
  // ✅ Fetch user info dynamically based on role
  const fetchUserInfo = async (id: string) => {
    if (!id) return;

    setFetchingUser(true);
    setUserInfo(null);
    try {
      // Hit a universal endpoint that detects user role
      const res = await fetch(`/api/shoper/user/${id}`);
      if (!res.ok) throw new Error("User not found");

      const data = await res.json();

      if (data.success && data.user) {
        setUserInfo(data.user);
      } else {
        setMessage("❌ User not found");
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setMessage("❌ Failed to fetch user");
    } finally {
      setFetchingUser(false);
    }
  };

  // ⏱ Debounce fetching user info
  useEffect(() => {
    if (!sId) {
      setUserInfo(null);
      return;
    }
    const timer = setTimeout(() => {
      fetchUserInfo(sId);
    }, 500);
    return () => clearTimeout(timer);
  }, [sId]);

  // 💰 Deposit handler
  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (!sId && !amount && !session?.user?.id) {
        setMessage("❌ Please fill in all fields.");
        setLoading(false);
        return;
      }

      // Select correct deposit URL based on user role

      const res = await fetch("/api/shoper/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sId,
          amount: Number(amount),
          role: userInfo?.role,
          userId: session?.user?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.error || "Failed to update deposit."}`);
      } else {
        setMessage("✅ Deposit updated successfully!");
        setSid("");
        setAmount("");
        setUserInfo(null);
        setTimeout(() => {
          setOpen(false);
          setMessage(null);
        }, 1500);
      }
    } catch (err) {
      console.error(err as unknown);
      setMessage("❌ Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          💰 Add Deposit
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Deposit</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleDeposit} className="space-y-4 mt-4">
          {/* User ID Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">User ID</label>
            <Input
              placeholder="Enter user ID"
              value={sId}
              onChange={(e) => setSid(e.target.value)}
              required
            />
          </div>

          {/* Show Fetched Info */}
          {fetchingUser ? (
            <p className="text-sm text-gray-500">🔍 Searching user...</p>
          ) : userInfo ? (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p>
                <strong>Name:</strong> {userInfo.name}
              </p>
              <p>
                <strong>Serial:</strong> {userInfo.serialNumber}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span
                  className={`font-medium ${
                    userInfo.role === "shoper"
                      ? "text-blue-600"
                      : "text-green-600"
                  }`}
                >
                  {userInfo.role}
                </span>
              </p>
            </div>
          ) : (
            sId && <p className="text-sm text-red-500">User not found</p>
          )}

          {/* Amount Input */}
          <div>
            <label className="text-sm font-medium mb-1 block">Amount</label>
            <Input
              type="number"
              placeholder="Enter deposit amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          {/* Message */}
          {message && (
            <div
              className={`text-sm p-2 rounded ${
                message.startsWith("✅")
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Submit */}
          <DialogFooter className="mt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? "Processing..." : "Confirm Deposit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
