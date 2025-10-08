"use client";
import Breadcrumb from "@/components/breadcumb";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginForm() {
  const [form, setForm] = useState({ identifier: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", form);
  };

  return (
    <div className=" bg-background  py-4 px-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "login" }]} />
      <div className="  flex items-center justify-center mt-8 ">
        <div className="w-full max-w-md    rounded-md p-6 shadow-sm bg-gray-100">
          {/* Breadcrumb */}

          <h1 className="text-2xl font-semibold mb-2">Returning Customer</h1>
          <p className="text-sm text-gray-600 mb-6">
            I am a returning customer
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">
                Email / Telephone
              </label>
              <input
                type="text"
                name="identifier"
                placeholder="Telephone / E-Mail Address"
                value={form.identifier}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <Link
                href="/auth/forget-password"
                className="text-sm text-blue-600 mt-1 cursor-pointer hover:underline"
              >
                Forgotten Password
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
