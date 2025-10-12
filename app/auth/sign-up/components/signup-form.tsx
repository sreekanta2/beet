"use client";

import { createUser } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import { countryList } from "@/lib/utils/utils";
import { RegisterFormData, registerSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface ReferrerInfo {
  name: string;
  serialNumber: string;
}

export default function RegisterAccount() {
  const [isPending, startTransition] = useTransition();
  const [referrerInfo, setReferrerInfo] = useState<ReferrerInfo | null>(null);
  const [isLoadingReferrer, setIsLoadingReferrer] = useState(false);
  const searchParams = useSearchParams();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
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

  // Get reference from URL parameters
  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setValue("reference", ref);
      fetchReferrerInfo(ref);
    }
  }, [searchParams, setValue]);

  const fetchReferrerInfo = async (referenceCode: string) => {
    if (!referenceCode) return;

    setIsLoadingReferrer(true);
    try {
      const response = await fetch(
        `/api/users/referrer?reference=${referenceCode}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setReferrerInfo(data.referrer);
        }
      }
    } catch (error) {
      console.error("Error fetching referrer info:", error);
    } finally {
      setIsLoadingReferrer(false);
    }
  };

  const referenceValue = watch("reference");

  // Fetch referrer info when reference input changes (with debounce)
  useEffect(() => {
    if (referenceValue && referenceValue.length >= 3) {
      const timer = setTimeout(() => {
        fetchReferrerInfo(referenceValue);
      }, 500);

      return () => clearTimeout(timer);
    } else {
      setReferrerInfo(null);
    }
  }, [referenceValue]);

  const onSubmit = (data: RegisterFormData) => {
    startTransition(async () => {
      try {
        const result = await createUser(data);
        if (result?.success) {
          toast.success("Registration successful! ", {
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

  const clearReference = () => {
    setValue("reference", "");
    setReferrerInfo(null);
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
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Reference Section - Enhanced */}
          <div>
            <h2 className="font-semibold mb-2 text-base">Your Reference</h2>
            <div className="border-t border-gray-200 pt-3 space-y-3">
              <div className="relative">
                <label className="block mb-1 font-medium">
                  Reference Code (Optional)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Enter reference code if you have one"
                    {...register("reference")}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                  />
                  {referenceValue && (
                    <button
                      type="button"
                      onClick={clearReference}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Enter your referrer's code if you were invited by someone
                </p>
              </div>

              {/* Referrer Information Card */}
              {isLoadingReferrer && (
                <div className="bg-blue-50 border border-blue-200 rounded-sm p-3">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-blue-700 text-sm">
                      Verifying reference code...
                    </span>
                  </div>
                </div>
              )}

              {referrerInfo && !isLoadingReferrer && (
                <div className="bg-green-50 border border-green-200 rounded-sm p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-800 font-medium text-sm">
                      Valid Reference Code
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Referrer:</span>
                      <span className="font-medium ml-2 text-gray-800">
                        {referrerInfo.name}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Member ID:</span>
                      <span className="font-medium ml-2 text-gray-800">
                        {referrerInfo.serialNumber}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {referenceValue && !referrerInfo && !isLoadingReferrer && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-sm p-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-800 text-sm">
                      Reference code not found. Please check and try again.
                    </span>
                  </div>
                </div>
              )}

              {/* Reference Help Text */}
              <div className="bg-gray-50 border border-gray-200 rounded-sm p-3">
                <h4 className="font-medium text-gray-800 text-sm mb-1">
                  How to get a reference?
                </h4>
                <p className="text-xs text-gray-600">
                  If you were invited by an existing member, ask them for their
                  reference code. This helps connect you with your referrer in
                  our system.
                </p>
              </div>
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
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm disabled:opacity-50 transition-colors duration-200 font-medium"
            >
              {isPending ? "Submitting..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
