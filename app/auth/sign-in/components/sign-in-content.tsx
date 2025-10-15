"use client";

import Breadcrumb from "@/components/breadcumb";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Shield,
  Smartphone,
} from "lucide-react";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const LoginSchema = z.object({
  telephone: z.string().min(3, "Telephone is required").trim(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      telephone: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        telephone: values.telephone,
        password: values.password,
        callbackUrl: callbackUrl || undefined,
      });

      if (res?.error) {
        toast.error("Invalid credentials! Please check your details.");
      } else {
        toast.success("🎉 Login successful! Welcome back!");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <Breadcrumb items={[{ label: "Login" }]} />

      <div className="flex items-center justify-center mt-8">
        <div className="w-full max-w-lg">
          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
            {/* Card Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <LogIn className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Account Login
                  </h2>
                  <p className="text-blue-100 text-sm">
                    Enter your credentials to continue
                  </p>
                </div>
              </div>
            </div>

            {/* Card Body */}
            <div className="p-4">
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Telephone/Email Field */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Login Identifier
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                      type="text"
                      {...form.register("telephone")}
                      placeholder="Enter your telephone number or email"
                      className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300 focus:shadow-lg"
                    />
                  </div>
                  {form.formState.errors.telephone && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      {form.formState.errors.telephone.message}
                    </div>
                  )}
                </div>

                {/* Password Field */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-gray-700 uppercase tracking-wide flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Password
                    </label>
                    <Link
                      href="/auth/forget-password"
                      className="text-sm text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium hover:underline flex items-center gap-1"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      {...form.register("password")}
                      placeholder="Enter your secure password"
                      className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white/50 backdrop-blur-sm group-hover:border-blue-300 focus:shadow-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                  {form.formState.errors.password && (
                    <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl border border-red-200">
                      {form.formState.errors.password.message}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-5 px-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  {/* Button content */}
                  <div className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-lg">Authenticating...</span>
                      </>
                    ) : (
                      <>
                        <LogIn className="w-5 h-5" />
                        <span className="text-base">Sign In </span>
                      </>
                    )}
                  </div>

                  {/* Bottom border animation */}
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-white/40 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 border-t border-gray-200"></div>
                <div className="px-4 text-gray-500 text-sm font-medium">
                  New to our platform?
                </div>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Additional Links */}
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link
                    href="/auth/sign-up"
                    className="text-blue-600 hover:text-blue-700 font-bold hover:underline transition-colors duration-200"
                  >
                    Create new account
                  </Link>
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="bg-gray-50 px-8 py-4 border-t border-gray-200">
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="w-3 h-3 text-green-500" />
                <span>Your session is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
