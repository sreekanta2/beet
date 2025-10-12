"use client";

import { updatePassword } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { z } from "zod";

// ✅ Zod schema for password validation
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(50, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

export default function Page() {
  const { data: session } = useSession();
  const [form, setForm] = useState<PasswordForm>({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PasswordForm, string>>
  >({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Ensure we have userId from session
  const userId = session?.user?.id;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMsg(null);

    if (!userId) {
      setErrors({ password: "User is not logged in" });
      return;
    }

    const result = passwordSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof PasswordForm, string>> = {};
      result.error.errors.forEach((err) => {
        const fieldName = err.path[0] as keyof PasswordForm;
        fieldErrors[fieldName] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      setLoading(true);
      const res = await updatePassword({ userId, password: form.password });

      if (res.success) {
        setSuccessMsg("Password updated successfully!");
        setForm({ password: "", confirmPassword: "" });
      } else {
        setErrors({ password: res.error || "Failed to update password" });
      }
    } catch (error) {
      console.error(error);
      setErrors({ password: "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "Change password" },
        ]}
      />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
        <form onSubmit={handleSubmit} className="space-y-8">
          <section>
            <h2 className="font-semibold mb-2 text-base">Your Password</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              {/* Password */}
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Enter new password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Confirm Password
                </label>
                <input
                  required
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </section>

          <button
            type="submit"
            disabled={loading}
            className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm disabled:opacity-70"
          >
            {loading ? "Updating..." : "Submit"}
          </button>

          {successMsg && (
            <p className="text-green-600 text-sm mt-2">{successMsg}</p>
          )}
        </form>
      </div>
    </div>
  );
}
