"use client";

import { createUser } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import { countryList } from "@/lib/utils/utils";
import { RegisterFormData, registerSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function RegisterAccount() {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: "Bangladesh",
      subscribe: "no",
      agree: false,
      reference: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await createUser(data);
        if (result?.success) {
          toast.success("Registration successful!  ", {
            duration: 4000,
          });
        } else {
          toast.error(
            result?.message || "Registration failed. Please try again."
          );
        }
      } catch {
        toast.error("Network error. Please try again.");
      }
    });
  };

  return (
    <div>
      <Breadcrumb items={[{ label: "", href: "/" }, { label: "signup" }]} />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
        <h1 className="text-2xl font-semibold mb-2">Register Account</h1>
        <p className="text-sm text-gray-600 mb-6">
          If you already have an account with us, please{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            login at the login page
          </a>
          .
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Localization */}
          <div>
            <h2 className="font-semibold mb-2 text-base">Localization</h2>
            <div className="border-t border-gray-200 pt-3">
              <label className="block mb-1 font-medium">
                <span className="text-red-500">*</span> Country
              </label>
              <select
                {...register("country")}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              >
                {countryList.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
              {errors.country && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Reference */}
          <div>
            <h2 className="font-semibold mb-2 text-base">Your Reference</h2>
            <div className="border-t border-gray-200 pt-3">
              <input
                type="text"
                placeholder="Reference"
                {...register("reference")}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Personal Details */}
          <div>
            <h2 className="font-semibold mb-2 text-base">
              Your Personal Details
            </h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> First Name
                </label>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Telephone
                </label>
                <input
                  type="tel"
                  placeholder="Telephone"
                  {...register("telephone")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.telephone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.telephone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <h2 className="font-semibold mb-2 text-base">Your Password</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password
                </label>
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password Confirm
                </label>
                <input
                  type="password"
                  placeholder="Password Confirm"
                  {...register("confirmPassword")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
                {errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h2 className="font-semibold mb-2 text-base">Newsletter</h2>
            <div className="border-t border-gray-200 pt-3 flex items-center space-x-6">
              <span>Subscribe</span>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  value="yes"
                  {...register("subscribe")}
                  className="accent-blue-600"
                />
                <span>Yes</span>
              </label>
              <label className="flex items-center space-x-1">
                <input
                  type="radio"
                  value="no"
                  {...register("subscribe")}
                  className="accent-blue-600"
                />
                <span>No</span>
              </label>
            </div>
          </div>

          {/* Agreement and Button */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-3">
            <label className="flex items-center text-sm space-x-2 mb-3 md:mb-0">
              <input
                type="checkbox"
                {...register("agree")}
                className="accent-blue-600"
              />
              <span>
                I have read and agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>
            {errors.agree && (
              <p className="text-red-500 text-xs mt-1">
                {errors.agree.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {isPending ? "Submitting..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
