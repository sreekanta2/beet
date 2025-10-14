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
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  User,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

// 🔹 SWR Fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

// 🔹 Export to CSV function
const exportToCSV = (transactions: any[], filename: string) => {
  if (transactions.length === 0) return;

  const headers = [
    "SL",
    "Customer ID",
    "Amount",
    "Date",
    "Time",
    "Type",
    "Status",
  ];

  const csvContent = [
    headers.join(","),
    ...transactions.map((tx, index) =>
      [
        index + 1,
        `"${tx?.user?.serialNumber || "N/A"}"`,
        tx.amount,
        `"${new Date(tx.createdAt).toLocaleDateString()}"`,
        `"${new Date(tx.createdAt).toLocaleTimeString()}"`,
        `"${tx.type}"`,
        `"${tx.status || "completed"}"`,
      ].join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// 🔹 Export to PDF function (simplified - in real app, use a library like jsPDF)
const exportToPDF = (transactions: any[], filename: string) => {
  // This is a simplified version. In a real application, you would use jsPDF
  // or another PDF generation library to create a proper PDF document.

  const printContent = `
    <html>
      <head>
        <title>${filename}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f5f5f5; }
          .total { font-weight: bold; background-color: #f9f9f9; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Transaction History</h1>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Customer ID</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            ${transactions
              .map(
                (tx, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${tx?.user?.serialNumber || "N/A"}</td>
                <td>$${tx.amount}</td>
                <td>${new Date(tx.createdAt).toLocaleDateString()}</td>
                <td>${tx.type}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  }
};

export default function TransactionHistory() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [exportLoading, setExportLoading] = useState(false);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const limit = 10;
  const { data: session } = useSession();

  // 🔹 Build URL dynamically
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (fromDate) query.append("from", fromDate);
  if (toDate) query.append("to", toDate);
  if (searchTerm) query.append("search", searchTerm);
  if (typeFilter !== "all") query.append("type", typeFilter);

  const url = session?.user?.id
    ? `/api/transections/${session.user.id}?${query.toString()}`
    : null;

  // 🪄 Fetch with SWR
  const { data, error, isLoading, mutate } = useSWR(url, fetcher, {
    revalidateOnFocus: false,
  });

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

  const incomeAmount = transactions
    .filter((t: any) => t.type === "income")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const expenseAmount = transactions
    .filter((t: any) => t.type === "withdrawal")
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  // 🔄 Enhanced Refresh Function
  const handleRefresh = async () => {
    setRefreshLoading(true);
    try {
      await mutate();
      // Show success feedback
      setTimeout(() => setRefreshLoading(false), 1000);
    } catch (error) {
      console.error("Refresh failed:", error);
      setRefreshLoading(false);
    }
  };

  // 📤 Enhanced Export Function
  const handleExport = async (format: "csv" | "pdf") => {
    if (transactions.length === 0) return;

    setExportLoading(true);
    setExportSuccess(false);

    try {
      // Simulate API call delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const timestamp = new Date().toISOString().split("T")[0];
      const filename = `transactions-${timestamp}.${format}`;

      if (format === "csv") {
        exportToCSV(transactions, filename);
      } else {
        exportToPDF(transactions, filename);
      }

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setExportLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "income":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <FileText className="w-4 h-4 text-blue-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case "income":
        return "text-green-600 bg-green-50 border-green-200";
      case "withdrawal":
        return "text-red-600 bg-red-50 border-red-200";
      default:
        return "text-blue-600 bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 font-sans">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Breadcrumb items={[{ label: "Transaction History" }]} />

        {/* Header Section */}
        <div className="mt-8 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Transaction History
              </h1>
              <p className="text-gray-600">
                Track and manage all your financial transactions
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Export Dropdown */}
              <div className="relative group">
                <Button
                  disabled={exportLoading || transactions.length === 0}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  {exportLoading ? "Exporting..." : "Export"}
                </Button>

                {/* Export Options Dropdown */}
                <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                  <button
                    onClick={() => handleExport("csv")}
                    disabled={exportLoading || transactions.length === 0}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
                  >
                    Export as CSV
                  </button>
                  <button
                    onClick={() => handleExport("pdf")}
                    disabled={exportLoading || transactions.length === 0}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed first:rounded-t-lg last:rounded-b-lg"
                  >
                    Export as PDF
                  </button>
                </div>
              </div>

              {/* Refresh Button */}
              <Button
                onClick={handleRefresh}
                disabled={refreshLoading || isLoading}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                <RefreshCw
                  className={`w-4 h-4 ${refreshLoading ? "animate-spin" : ""}`}
                />
                {refreshLoading ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
        </div>

        {/* Success Notification */}
        {exportSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top duration-500">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-green-800 font-medium">Export successful!</p>
              <p className="text-green-600 text-sm">
                Your file has been downloaded.
              </p>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Balance
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Income
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  ${incomeAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Withdrawals
                </p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {expenseAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-red-100 p-3 rounded-xl">
                <TrendingDown className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div> */}

        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Date Filters */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="pl-10 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="pl-10 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Type Filter */}
            {/* <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction Type
              </label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>

                <optgroup label="Income">
                  <option value="MANUAL">Manual Credit</option>
                  <option value="REFERRAL_TEAM_INCOME">
                    Referral Team Income
                  </option>
                  <option value="REFERRAL_CLUB_INCOME">
                    Referral Club Income
                  </option>
                  <option value="REFERRAL_SIGNUP_BONUS">Signup Bonus</option>
                  <option value="CLUB_BONUS">Club Bonus</option>
                  <option value="ROYALTY_DAILY">Royalty Daily</option>
                  <option value="TRANSFER_IN">Transfer In</option>
                  <option value="SHOPER_FEE_EARNED">Shopper Fee Earned</option>
                </optgroup>

                <optgroup label="Spend / Withdrawal">
                  <option value="CLUB_CREATION_SPEND">
                    Club Creation Spend
                  </option>
                  <option value="TRANSFER_OUT">Transfer Out</option>
                </optgroup>
              </select>
            </div> */}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-white">
                  Transaction Records
                </h2>
              </div>
              <div className="text-white/80 text-sm">
                {transactions.length} records
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 hover:bg-transparent">
                    <TableHead className="font-semibold text-gray-700 text-center">
                      #
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700">
                      Customer ID
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Amount
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Date & Time
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Type
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {isLoading && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-2" />
                          <p className="text-gray-600">
                            Loading transactions...
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {error && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-red-600">
                          <AlertCircle className="w-8 h-8 mb-2" />
                          <p>Failed to load transactions</p>
                          <Button
                            onClick={handleRefresh}
                            variant="outline"
                            className="mt-2"
                          >
                            Try Again
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {!isLoading && transactions.length === 0 && !error && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <FileText className="w-12 h-12 mb-3 opacity-50" />
                          <p className="text-lg font-medium mb-1">
                            No transactions found
                          </p>
                          <p className="text-sm">
                            Try adjusting your filters or search terms
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {transactions.map((tx: any, index: number) => (
                    <TableRow
                      key={tx.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <TableCell className="text-center font-medium text-gray-900">
                        {(page - 1) * limit + index + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="bg-blue-100 p-1.5 rounded-lg">
                            <User className="w-3 h-3 text-blue-600" />
                          </div>
                          <span className="font-medium">
                            {tx?.user?.serialNumber}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        {(() => {
                          // Define which types are income vs spend
                          const incomeTypes = [
                            "MANUAL",
                            "REFERRAL_TEAM_INCOME",
                            "REFERRAL_CLUB_INCOME",
                            "REFERRAL_SIGNUP_BONUS",
                            "CLUB_BONUS",
                            "ROYALTY_DAILY",
                            "TRANSFER_IN",
                            "SHOPER_FEE_EARNED",
                          ];

                          const spendTypes = [
                            "CLUB_CREATION_SPEND",
                            "TRANSFER_OUT",
                          ];

                          // Determine if this transaction is income or spend
                          const isIncome = incomeTypes.includes(tx.type);
                          const sign = isIncome ? "+" : "-";
                          const color = isIncome
                            ? "text-green-600"
                            : "text-red-600";

                          return (
                            <span className={`font-semibold ${color}`}>
                              {sign}
                              {tx.amount}
                            </span>
                          );
                        })()}
                      </TableCell>

                      <TableCell className="text-center text-gray-600">
                        <div className="flex flex-col items-center">
                          <span className="font-medium">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(tx.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full border text-xs font-medium ${getTypeColor(
                            tx.type
                          )}`}
                        >
                          {getTypeIcon(tx.type)}
                          <span className="capitalize">{tx.type}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing{" "}
                <span className="font-semibold">{(page - 1) * limit + 1}</span>{" "}
                to{" "}
                <span className="font-semibold">
                  {(page - 1) * limit + transactions.length}
                </span>{" "}
                of <span className="font-semibold">{pagination.total}</span>{" "}
                entries
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="flex items-center gap-1 border-gray-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.min(5, pagination.totalPages) },
                    (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "soft" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className={`w-8 h-8 p-0 ${
                            page === pageNum
                              ? "bg-blue-600 text-white"
                              : "border-gray-300 text-gray-700"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    }
                  )}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex items-center gap-1 border-gray-300"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
