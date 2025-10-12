"use client";

import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

// 🔹 SWR Fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function TransactionHistory() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: session } = useSession();

  // 🔹 Build URL dynamically (using path param)
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (fromDate) query.append("from", fromDate);
  if (toDate) query.append("to", toDate);

  const url = session?.user?.id
    ? `/api/transections/${session.user.id}?${query.toString()}`
    : null;

  // 🪄 Fetch with SWR
  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const transactions = data?.transactions || [];
  const pagination = data?.pagination || {
    total: 0,
    page: 1,
    totalPages: 0,
  };

  const totalAmount = transactions.reduce(
    (sum: number, t: any) => sum + t.amount,
    0
  );

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Transaction History" },
        ]}
      />

      <div className="w-full max-w-4xl mt-4 bg-white rounded-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Transaction History
        </h2>

        {/* 🔍 Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">From Date</label>
            <Input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="border-gray-300 rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">To Date</label>
            <Input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="border-gray-300 rounded-sm"
            />
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* 🧾 Table */}
        <div className="overflow-x-auto">
          <Table className="border border-gray-200 text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100 text-xs">
                <TableHead className="text-center font-semibold text-gray-700">
                  SL
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Customer ID
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Amount
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Date Time
                </TableHead>
                <TableHead className="text-center font-semibold text-gray-700">
                  Type
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-gray-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}
              {error && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-red-500"
                  >
                    Failed to load data.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && transactions.length === 0 && !error && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-4 text-gray-500"
                  >
                    No transactions found.
                  </TableCell>
                </TableRow>
              )}
              {transactions.map((tx: any, index: number) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-center">
                    {(page - 1) * limit + index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    {tx?.user?.serialNumber}
                  </TableCell>
                  <TableCell className="text-center">{tx.amount}</TableCell>
                  <TableCell className="text-center">
                    {new Date(tx.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-center">{tx.type}</TableCell>
                </TableRow>
              ))}

              {/* Total Row */}
              {!isLoading && transactions.length > 0 && (
                <TableRow>
                  <TableCell className="text-center font-semibold">
                    Total:
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center font-semibold">
                    {totalAmount}
                  </TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 📄 Pagination */}
        <div className="flex justify-between items-center text-xs text-gray-600 mt-3">
          <div>
            Showing {transactions.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
            {(page - 1) * limit + transactions.length} of {pagination.total}{" "}
            entries
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
