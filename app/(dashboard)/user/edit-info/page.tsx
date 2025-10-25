"use client";

import { getShopperProfile, upsertShopperProfile } from "@/action/auth.action";
import Breadcrumb from "@/components/breadcumb";
import CustomFormField, { FormFieldType } from "@/components/custom-form-field";
import { Form } from "@/components/ui/form";
import {
  allDivision,
  districtsOf,
  DivisonName,
  upazilasOf,
} from "@bangladeshi/bangladesh-address";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWR from "swr";
import { z } from "zod";

interface ShopperForm {
  userId: string;
  country: string;
  firstName: string;
  lastName: string;
  email: string;
  telephone: string;
  nid: string;
  nomineId?: string;
  nomineName?: string;
  nominiRelation?: string;
  division: string;
  district: string;
  upazila: string;
  category?: string;
  location?: string;
}

// Enhanced Zod Schema with better validation
const shopperSchema = z.object({
  country: z.string().min(1, "Country is required"),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
  email: z.string().email("Invalid email address"),
  telephone: z
    .string()
    .min(1, "Telephone is required")
    .regex(/^[0-9+\-\s()]+$/, "Invalid telephone format"),
  nid: z
    .string()
    .min(1, "NID is required")
    .min(10, "NID must be at least 10 characters"),
  nomineId: z.string().optional(),
  nomineName: z.string().optional(),
  nominiRelation: z.string().optional(),
  division: z.string().min(1, "Division is required"),
  district: z.string().min(1, "District is required"),
  upazila: z.string().min(1, "Upazila is required"),
  category: z.string().optional(),
  location: z.string().optional(),
});

export default function ShopperAccount() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");

  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  const form = useForm<ShopperForm>({
    resolver: zodResolver(shopperSchema),
    mode: "onChange",
    defaultValues: {
      country: "Bangladesh",
      firstName: "",
      lastName: "",
      email: "",
      telephone: "",
      nid: "",
      nomineId: "",
      nomineName: "",
      nominiRelation: "",
      division: "",
      district: "",
      upazila: "",
      category: "",
      location: "",
    },
  });

  const watchDivision = form.watch("division");
  const watchDistrict = form.watch("district");

  // SWR fetcher with error handling
  const fetcher = async (userId: string) => {
    try {
      return await getShopperProfile(userId);
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      throw error;
    }
  };

  const {
    data: profile,
    isLoading,
    error,
  } = useSWR(
    session?.user?.id ? `shopper-${session.user.id}` : null,
    () => fetcher(session!.user!.id),
    {
      revalidateOnFocus: false,
      onError: (err) => {
        toast.error("Failed to load profile");
      },
    }
  );

  // Load divisions
  useEffect(() => {
    setDivisions(allDivision());
  }, []);

  // Set form values when profile loads
  useEffect(() => {
    if (profile) {
      const fullName = profile.name?.trim() || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      form.reset({
        country: profile.additionalInfo?.country || "Bangladesh",
        firstName,
        lastName,
        email: profile.email || "",
        telephone: profile.telephone || "",
        nid: profile.additionalInfo?.nid || "",
        nomineId: profile.additionalInfo?.nomineId || "",
        nomineName: profile.additionalInfo?.nomineName || "",
        nominiRelation: profile.additionalInfo?.nominiRelation || "",
        division: profile.additionalInfo?.division || "",
        district: profile.additionalInfo?.district || "",
        upazila: profile.additionalInfo?.upazila || "",
        category: profile.additionalInfo?.category || "",
        location: profile.additionalInfo?.location || "",
      });

      // Load dependent selects
      if (profile.additionalInfo?.division) {
        const districtNames = districtsOf(
          profile.additionalInfo.division as DivisonName
        );
        setDistricts(districtNames);
      }
      if (profile.additionalInfo?.district) {
        const upazilaNames = upazilasOf(profile.additionalInfo.district).map(
          (u: any) => u.upazila
        );
        setUpazilas(upazilaNames);
      }
    }
  }, [profile, form]);

  // Handle dependent selects
  useEffect(() => {
    if (watchDivision) {
      const districtNames = districtsOf(watchDivision as DivisonName);
      setDistricts(districtNames);
      form.setValue("district", "");
      form.setValue("upazila", "");
      setUpazilas([]);
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [watchDivision, form]);

  useEffect(() => {
    if (watchDistrict) {
      const upazilaNames = upazilasOf(watchDistrict).map((u: any) => u.upazila);
      setUpazilas(upazilaNames);
      form.setValue("upazila", "");
    } else {
      setUpazilas([]);
    }
  }, [watchDistrict, form]);

  // Enhanced submit handler with better feedback
  const onSubmit = async (data: ShopperForm) => {
    if (!session?.user?.id) {
      toast.error("Please log in to update your profile");
      return;
    }

    setSaveStatus("saving");
    startTransition(async () => {
      try {
        await upsertShopperProfile({ ...data, userId: session.user.id });
        setSaveStatus("success");
        toast.success("Profile updated successfully!");

        // Reset status after delay
        setTimeout(() => setSaveStatus("idle"), 3000);
      } catch (err) {
        setSaveStatus("error");
        console.error("Profile update error:", err);
        toast.error("Failed to update profile. Please try again.");

        // Reset error status after delay
        setTimeout(() => setSaveStatus("idle"), 3000);
      }
    });
  };

  // Loading state with skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="space-y-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-12 bg-gray-100 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h3 className="text-lg font-medium text-red-800 mb-2">
              Failed to Load Profile
            </h3>
            <p className="text-red-600 mb-4">
              There was an error loading your profile data.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumb items={[{ label: "Edit Profile" }]} />
          <div className="mt-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Profile Information
              </h1>
              <p className="text-gray-600 mt-1">
                Update your personal and contact information
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {saveStatus === "success" && (
                <span className="flex items-center text-green-600 text-sm">
                  <svg
                    className="w-4 h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Saved successfully
                </span>
              )}
              {saveStatus === "error" && (
                <span className="text-red-600 text-sm">Save failed</span>
              )}
            </div>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Form Header */}
          <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Details
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Manage your personal information and how others see you
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="p-6 space-y-8"
            >
              {/* Personal Information Section */}
              <section>
                <h3 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="firstName"
                    label="First Name"
                    placeholder="Enter your first name"
                    required
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="lastName"
                    label="Last Name"
                    placeholder="Enter your last name"
                    required
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="your.email@example.com"
                    required
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="telephone"
                    label="Phone Number"
                    placeholder="+880 XXX-XXXXXX"
                    required
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="nid"
                    label="National ID (NID)"
                    placeholder="Enter your NID number"
                    required
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="country"
                    label="Country"
                    placeholder="Country"
                    required
                  />
                </div>
              </section>

              {/* Nominee Information Section */}
              <section>
                <h3 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Nominee Information{" "}
                  <span className="text-sm font-normal text-gray-500">
                    (Optional)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="nomineId"
                    label="Nominee NID"
                    placeholder="Nominee's NID number"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="nomineName"
                    label="Nominee Full Name"
                    placeholder="Nominee's full name"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="nominiRelation"
                    label="Relationship"
                    placeholder="e.g., Spouse, Child, Parent"
                  />
                </div>
              </section>

              {/* Location Information Section */}
              <section>
                <h3 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Location Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Division Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Division <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register("division")}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    >
                      <option value="">Select Division</option>
                      {divisions.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.division && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.division.message}
                      </p>
                    )}
                  </div>

                  {/* District Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      District <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register("district")}
                      disabled={!watchDivision}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !watchDivision ? "bg-gray-50 text-gray-500" : ""
                      }`}
                    >
                      <option value="">Select District</option>
                      {districts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.district && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.district.message}
                      </p>
                    )}
                  </div>

                  {/* Upazila Select */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Upazila <span className="text-red-500">*</span>
                    </label>
                    <select
                      {...form.register("upazila")}
                      disabled={!watchDistrict}
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        !watchDistrict ? "bg-gray-50 text-gray-500" : ""
                      }`}
                    >
                      <option value="">Select Upazila</option>
                      {upazilas.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </select>
                    {form.formState.errors.upazila && (
                      <p className="text-red-500 text-sm mt-1">
                        {form.formState.errors.upazila.message}
                      </p>
                    )}
                  </div>
                </div>
              </section>

              {/* Additional Information Section */}
              <section>
                <h3 className="text-md font-medium text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  Additional Information{" "}
                  <span className="text-sm font-normal text-gray-500">
                    (Optional)
                  </span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="category"
                    label="Business Category"
                    placeholder="e.g., Retail, Wholesale"
                  />
                  <CustomFormField
                    fieldType={FormFieldType.INPUT}
                    control={form.control}
                    name="location"
                    label="Specific Location"
                    placeholder="e.g., Market name, Street address"
                  />
                </div>
              </section>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-gray-200 space-y-4 sm:space-y-0">
                <p className="text-sm text-gray-600">
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Contact support
                  </Link>
                </p>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => form.reset()}
                    disabled={isPending}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !form.formState.isValid}
                    className="px-8 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                  >
                    {isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
