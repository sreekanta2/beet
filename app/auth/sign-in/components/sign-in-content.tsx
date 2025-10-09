"use client";

import Breadcrumb from "@/components/breadcumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { z } from "zod";

const LoginSchema = z.object({
  identifier: z.string().min(3, "Email or Telephone is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.identifier, // identifier can be email or phone
        password: values.password,
        callbackUrl: callbackUrl || undefined,
      });

      if (res?.error) {
        toast.error("Invalid credentials!");
      } else {
        toast.success("Login successful!");
        const session = await getSession();
        const role = session?.user?.role || "user";

        if (callbackUrl) router.push(callbackUrl);
        else router.push(`/${role}/dashboard`);
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background py-4 px-4">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Login" }]} />

      <div className="flex items-center justify-center mt-8">
        <div className="w-full max-w-md rounded-md p-6 shadow-sm bg-gray-100">
          <h1 className="text-2xl font-semibold mb-2">Returning Customer</h1>
          <p className="text-sm text-gray-600 mb-6">
            I am a returning customer
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Email or Telephone */}
            <div>
              <label className="block mb-1 font-medium">
                Email / Telephone
              </label>
              <input
                type="text"
                {...form.register("identifier")}
                placeholder="Telephone / E-Mail Address"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {form.formState.errors.identifier && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                {...form.register("password")}
                placeholder="Password"
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              {form.formState.errors.password && (
                <p className="text-sm text-red-500 mt-1">
                  {form.formState.errors.password.message}
                </p>
              )}

              <Link
                href="/auth/forget-password"
                className="text-sm text-blue-600 mt-1 inline-block hover:underline"
              >
                Forgotten Password
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition disabled:opacity-60"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
