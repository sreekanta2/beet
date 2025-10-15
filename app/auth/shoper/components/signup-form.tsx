"use client";

import { createUser } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import { countryList } from "@/lib/utils/utils";
import { RegisterFormData, registerSchema } from "@/zod-validation/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Loader2,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function ShoperRegisterAccount() {
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      country: "Bangladesh",
      subscribe: "no",
      agree: false,
      reference: "",
      role: "shoper",
    },
  });

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

  const passwordValue = watch("password");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "signup" }]} />

        <div className="max-w-2xl mx-auto">
          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h1>
              <p className="text-gray-600">
                Join thousands of shopers and start your journey today
              </p>
            </div>

            <div className="flex items-center justify-center text-sm text-gray-600 mb-8">
              <span>Already have an account?</span>
              <a
                href="/auth/sign-in"
                className="ml-2 text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
              >
                Sign in here
              </a>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Localization Section */}
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Location
                    </h2>
                    <p className="text-sm text-gray-600">Select your country</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("country")}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white"
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

              {/* Personal Details Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Personal Information
                    </h2>
                    <p className="text-sm text-gray-600">
                      Tell us about yourself
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your first name"
                      {...register("firstName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Enter your last name"
                      {...register("lastName")}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    />
                  </div>
                  {errors.telephone && (
                    <p className="text-red-500 text-xs mt-2">
                      {errors.telephone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Security
                    </h2>
                    <p className="text-sm text-gray-600">
                      Create a secure password
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        {...register("password")}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        {...register("confirmPassword")}
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-red-500 text-xs mt-2">
                        {errors.confirmPassword.message}
                      </p>
                    )}
                    {passwordValue &&
                      !errors.confirmPassword &&
                      watch("confirmPassword") === passwordValue && (
                        <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
                          ✓ Passwords match
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Newsletter Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-gray-900 text-lg">
                      Newsletter
                    </h2>
                    <p className="text-sm text-gray-600">
                      Stay updated with our latest news
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <span className="text-sm font-medium text-gray-700">
                    Subscribe to newsletter:
                  </span>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="yes"
                        {...register("subscribe")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Yes, please</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        value="no"
                        {...register("subscribe")}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">No, thanks</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Agreement and Submit */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="flex items-center h-5 mt-0.5">
                    <input
                      type="checkbox"
                      {...register("agree")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">
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
                      <p className="text-red-500 text-xs mt-2">
                        {errors.agree.message}
                      </p>
                    )}
                  </div>
                </label>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Security Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              🔒 Your information is secured with SSL encryption and we never
              share your data with third parties.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
