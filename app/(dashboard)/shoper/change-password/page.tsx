"use client";
import Breadcrumb from "@/components/breadcumb";
import React, { useState } from "react";
interface ShopperForm {
  password: string;
  confirmPassword: string;
}
export default function page() {
  const [form, setForm] = useState<ShopperForm>({
    password: "",
    confirmPassword: "",
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Determine if the target is a checkbox
    const val =
      type === "checkbox" && "checked" in e.target ? e.target.checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };
  return (
    <div className="p-6">
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "Change password" },
        ]}
      />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
        {/* Breadcrumb */}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Password */}
          <section>
            <h2 className="font-semibold mb-2 text-base">Your Password</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password Confirm
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Password Confirm"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>
          <button
            type="submit"
            className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
