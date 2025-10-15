"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface Withdraw {
  id: string;
  amount: number;
  status: string;
  method?: string;
  accountNo?: string;
  createdAt: string;
  user: { id: string; name: string; email: string };
}

export default function WithdrawPage() {
  const [withdraws, setWithdraws] = useState<Withdraw[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchWithdraws();
  }, []);

  const fetchWithdraws = async () => {
    setLoading(true);
    const res = await fetch("/api/users/withdraw");
    const data = await res.json();
    setWithdraws(data.withdraws || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/users/withdraw/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();

    if (data.success) {
      toast.success(`Withdraw ${status}`);
      fetchWithdraws();
    } else {
      toast.error(data?.message);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="p-6 space-y-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Withdraw Requests</h1>

      {withdraws.length === 0 && <p>No withdraw requests yet.</p>}

      <div className="grid gap-4">
        {withdraws.map((w: any) => (
          <Card key={w.id} className="border rounded-xl shadow-sm">
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{w.user.name}</h3>
                <p className="text-sm text-gray-600">{w.user.email}</p>
                <p className="text-sm text-gray-800 mt-1">
                  Amount: <span className="font-semibold">{w.amount}</span>
                </p>
                <p className="text-xs text-gray-500">
                  Method: {w.mobileBankingService?.name || "N/A"}
                </p>
                <p className="text-xs text-gray-500">
                  Number: {w.mobileBankingService?.number || "N/A"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Select
                  onValueChange={(value) => updateStatus(w.id, value)}
                  defaultValue={w.status}
                >
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="COMPLETED">Completed</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
