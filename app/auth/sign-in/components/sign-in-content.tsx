"use client";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { UserRole } from "@/types/common";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

const LoginSchema = z.object({
  email: z
    .string()
    .email("Please enter a valid email")
    .min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export function LoginPageContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setIsLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
        callbackUrl: callbackUrl || undefined,
      });

      if (res?.error) {
        toast.error("Invalid credentials!");
      } else {
        toast.success("Login successful");
        const session = await getSession();
        const role = session?.user?.role as UserRole;

        if (callbackUrl) router.push(callbackUrl);
        else if (role) router.push(`/${role}/dashboard`);
        else router.push("/");
      }
    } catch (err) {
      toast.error("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-tr from-purple-700 via-indigo-600 to-pink-500 p-4">
      <div className="w-full max-w-md rounded-3xl p-8 shadow-2xl bg-gradient-to-br from-white/80 via-gray-100/70 to-white/70 backdrop-blur-md border border-white/20">
        {/* Header */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-500 text-center">
            Sign In
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300">
            Access your account to continue
          </p>
        </div>

        <Separator className="my-6 border-t-2 border-indigo-300/50" />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="email"
              label="Email"
              placeholder="your@gmail.com"
              required
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              label="Password"
              placeholder="********"
              type="password"
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  required
                />
                <Label htmlFor="remember" className="text-sm text-gray-600">
                  Remember me
                </Label>
              </div>
              <Link
                href="/auth/forget-password"
                className="text-sm text-purple-700 hover:underline"
              >
                Forget Password
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-purple-600 via-indigo-500 to-pink-500 text-white font-semibold py-3 shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Don't have an account?{" "}
          <Link
            href="/auth/sign-up"
            className="font-semibold text-purple-600 hover:text-indigo-500 hover:underline"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
