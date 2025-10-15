"use client";

import { createUser } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import { countryList } from "@/lib/utils/utils";
import { RegisterFormData, registerSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  User,
  Users,
  XCircle,
} from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      role: "user",
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
  const passwordValue = watch("password");

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
          toast.success(
            "🎉 Registration successful! Welcome to our platform!",
            {
              duration: 5000,
            }
          );
        } else {
          toast.error(
            result?.message ||
              "Registration failed. Please check your information and try again."
          );
        }
      } catch {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      }
    });
  };

  const clearReference = () => {
    setValue("reference", "");
    setReferrerInfo(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Breadcrumb items={[{ label: "signup" }]} />

        {/* Main Registration Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 mt-8 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-8 text-white">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <Users className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Create Your Account</h1>
                <p className="text-blue-100  mt-1">
                  Join our community and start your journey today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-blue-100 text-xs">
              <Shield className="w-4 h-4" />
              <span>Your information is secured with SSL encryption</span>
            </div>
          </div>

          <div className="p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-6 text-xs">
              <span>Already have an account?</span>
              <a
                href="/auth/sign-in"
                className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </a>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Localization Section */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Location Settings
                    </h2>
                    <p className="text-xs text-gray-600">Select your country</p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
                  >
                    {countryList.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      {errors.country.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Reference Section */}
              <div className="bg-purple-50 rounded-2xl p-4 border border-purple-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                    <BadgeCheck className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Reference Code
                    </h2>
                    <p className="text-xs text-gray-600">
                      Enter if you were invited (optional)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Reference Code
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        placeholder="Enter reference code..."
                        {...register("reference")}
                        className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 bg-white group-hover:border-purple-300"
                      />
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      {referenceValue && (
                        <button
                          type="button"
                          onClick={clearReference}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <XCircle className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Referrer Status */}
                  {isLoadingReferrer && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                        <div>
                          <p className="text-blue-800 font-medium">
                            Verifying reference code
                          </p>
                          <p className="text-blue-600 text-xs">
                            Please wait while we check the code...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {referrerInfo && !isLoadingReferrer && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <p className="text-green-600 text-xs">
                            You'll be connected with your referrer
                          </p>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center gap-2 p-2 bg-green-100/50 rounded-lg">
                          <User className="w-4 h-4 text-green-600" />
                          <span className="text-green-800">
                            <strong>Referrer:</strong> {referrerInfo.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 p-2 bg-green-100/50 rounded-lg">
                          <BadgeCheck className="w-4 h-4 text-green-600" />
                          <span className="text-green-800">
                            <strong>Member ID:</strong>{" "}
                            {referrerInfo.serialNumber}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {referenceValue && !referrerInfo && !isLoadingReferrer && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <XCircle className="w-5 h-5 text-yellow-600" />
                        <div>
                          <p className="text-yellow-800 font-medium">
                            Reference Not Found
                          </p>
                          <p className="text-yellow-600 text-xs">
                            Please check the code and try again
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white rounded-2xl p-4 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Personal Information
                    </h2>
                    <p className="text-xs text-gray-600">
                      Tell us about yourself
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      {...register("firstName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      {...register("lastName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-700 mb-2">
                    Telephone <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      {...register("telephone")}
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                      {errors.telephone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                    <Lock className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Security Settings
                    </h2>
                    <p className="text-xs text-gray-600">
                      Create a secure password
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...register("password")}
                        className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white group-hover:border-red-300"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        className="w-full pl-11 pr-10 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 bg-white group-hover:border-red-300"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    {passwordValue &&
                      !errors.confirmPassword &&
                      watch("confirmPassword") === passwordValue && (
                        <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          Passwords match
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Newsletter Preferences
                    </h2>
                    <p className="text-xs text-gray-600">
                      Stay updated with our latest news
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-xs font-medium text-gray-700">
                    Subscribe to newsletter:
                  </span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        value="yes"
                        {...register("subscribe")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-xs text-gray-700 group-hover:text-gray-900">
                        Yes, please
                      </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="radio"
                        value="no"
                        {...register("subscribe")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="text-xs text-gray-700 group-hover:text-gray-900">
                        No, thanks
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Agreement and Submit */}
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      {...register("agree")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-gray-700 group-hover:text-gray-900">
                      I have read and agree to the{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                      >
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a
                        href="#"
                        className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                      >
                        Terms of Service
                      </a>
                    </span>
                    {errors.agree && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        {errors.agree.message}
                      </p>
                    )}
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                  <div className="relative z-10 flex items-center justify-center gap-2">
                    {isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="text-lg">Creating Account...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm">Create My Account</span>
                      </>
                    )}
                  </div>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Security Note */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 bg-white/50 backdrop-blur-sm px-4 py-3 rounded-full border border-gray-200 text-xs text-gray-600">
            <Shield className="w-4 h-4 text-green-500" />
            <span>
              Your personal information is protected and never shared with third
              parties
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
