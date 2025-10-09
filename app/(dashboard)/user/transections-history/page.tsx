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
import { useState } from "react";

export default function TransactionHistory() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [customerId, setCustomerId] = useState("");

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "Change password" },
        ]}
      />
      <div className="w-full max-w-4xl mt-4 bg-white rounded-md p-6 border border-gray-200">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Transaction History
        </h2>

        {/* Filters */}
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
          <div className="flex flex-col">
            <label className="text-gray-600 mb-1">Customer ID</label>
            <Input
              type="text"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              placeholder=""
              className="border-gray-300 rounded-sm"
            />
          </div>
          <div className="flex items-end">
            <Button className="bg-[#007bff] hover:bg-[#0069d9] text-white px-4 py-2 rounded-sm text-sm shadow-sm">
              Show History
            </Button>
          </div>
        </div>

        <hr className="border-gray-300 mb-6" />

        {/* Table */}
        <div className="overflow-x-auto">
          <Table className="border border-gray-200 text-sm">
            <TableHeader>
              <TableRow className="bg-gray-100 text-xs">
                <TableHead className="text-gray-700  text-xs font-semibold text-center">
                  SL
                </TableHead>
                <TableHead className="text-gray-700 text-xs font-semibold text-center">
                  Customer ID
                </TableHead>
                <TableHead className="text-gray-700 text-xs font-semibold text-center">
                  Amount
                </TableHead>
                <TableHead className="text-gray-700 text-xs font-semibold text-center">
                  Date Time
                </TableHead>
                <TableHead className="text-gray-700 text-xs font-semibold text-center">
                  Earned Point
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="text-center text-xs text-gray-700">
                  Total:
                </TableCell>
                <TableCell></TableCell>
                <TableCell className="text-center text-xs text-gray-800 font-medium">
                  0
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>

        <div className="text-right text-xs text-gray-600 mt-2">
          Showing 0 to 0 of 0 (0 Pages)
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
