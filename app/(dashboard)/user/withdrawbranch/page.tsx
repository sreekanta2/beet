"use client";
import Breadcrumb from "@/components/breadcumb";
import BackButton from "@/components/landing-page/back-button";
import { useState } from "react";

export default function WithdrawFromBranch() {
  const [branch, setBranch] = useState("");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/user/dashboard" },
          { label: "Balance", href: "/user/balance" },
          { label: "Withdraw Request" },
        ]}
      />
      <div className="max-w-4xl mx-auto p-8 bg-white">
        <h1 className="text-3xl font-semibold mb-2">Withdraw From Branch</h1>
        <p className="text-sm mb-6">Withdraw Request</p>

        <div className="border-t mb-6"></div>

        <form className="space-y-5">
          {/* Branch Selection */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-2 text-sm text-red-600">
              * Withdraw From Branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="col-span-6 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            >
              <option value="">[Please Select]</option>
              <option value="branch1">Branch 1</option>
              <option value="branch2">Branch 2</option>
            </select>
          </div>

          {/* Amount */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-2 text-sm text-red-600">* Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
              className="col-span-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
            <span className="col-span-2 text-xs text-gray-500">Balance: 0</span>
          </div>

          {/* Phone Number */}
          <div className="grid grid-cols-12 items-center gap-2">
            <label className="col-span-2 text-sm text-red-600">
              * Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="col-span-4 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-between mt-6">
            <BackButton />
            <button
              type="submit"
              className="px-5 py-1.5 bg-sky-500 text-white text-sm rounded hover:bg-sky-600"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
