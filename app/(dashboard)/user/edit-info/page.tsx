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

// 🧩 Zod Schema
const shopperSchema = z.object({
  country: z.string().nonempty("Country is required"),
  firstName: z.string().nonempty("First name is required"),
  lastName: z.string().nonempty("Last name is required"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().nonempty("Telephone is required"),
  nid: z.string().nonempty("NID is required"),
  nomineId: z.string().optional(),
  nomineName: z.string().optional(),
  nominiRelation: z.string().optional(),
  division: z.string().nonempty("Division is required"),
  district: z.string().nonempty("District is required"),
  upazila: z.string().nonempty("Upazila is required"),
  category: z.string().optional(),
  location: z.string().optional(),
});

export default function ShopperAccount() {
  const { data: session } = useSession();
  const [isPending, startTransition] = useTransition();

  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<string[]>([]);

  const form = useForm<ShopperForm>({
    resolver: zodResolver(shopperSchema),
    defaultValues: {
      country: "",
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

  // SWR fetcher
  const fetcher = async (userId: string) => getShopperProfile(userId);
  const { data: profile, isLoading } = useSWR(
    session?.user?.id ? `shopper-${session.user.id}` : null,
    () => fetcher(session!.user!.id)
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
      const lastName = nameParts[1];

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

  // Submit handler
  const onSubmit = async (data: ShopperForm) => {
    if (!session?.user?.id) return;
    startTransition(async () => {
      try {
        await upsertShopperProfile({ ...data, userId: session.user.id });
        toast.success("Profile updated successfully!");
      } catch (err) {
        console.error(err);
        alert("Failed to update profile");
      }
    });
  };

  if (isLoading) return <p>Loading profile...</p>;

  return (
    <div className="p-4 md:p-8">
      <Breadcrumb items={[{ label: "Edit Information" }]} />

      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-md mt-6 p-6 md:p-8 text-[14px] font-sans">
        <p className="text-sm text-gray-600 mb-6">
          If you already have an account, please{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            login
          </Link>
          .
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 md:space-y-8"
          >
            {/* Personal Info */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="firstName"
                label="First Name"
                placeholder="First Name"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="lastName"
                label="Last Name"
                placeholder="Last Name"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                label="Email"
                type="email"
                placeholder="Email"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="telephone"
                label="Telephone"
                placeholder="Telephone"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nid"
                label="NID"
                placeholder="NID"
                required
              />
            </section>

            {/* Nominee Info */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nomineId"
                label="Nominee NID"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nomineName"
                label="Nominee Name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nominiRelation"
                label="Relation with Nominee"
              />
            </section>

            {/* Location Info */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Division */}
              <div>
                <label className="block mb-1 font-medium">Division</label>
                <select
                  {...form.register("division")}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
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

              {/* District */}
              <div>
                <label className="block mb-1 font-medium">District</label>
                <select
                  {...form.register("district")}
                  disabled={!watchDivision}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
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

              {/* Upazila */}
              <div>
                <label className="block mb-1 font-medium">Upazila</label>
                <select
                  {...form.register("upazila")}
                  disabled={!watchDistrict}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
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
            </section>

            {/* Category & Location */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["category", "location"].map((field) => (
                <CustomFormField
                  key={field}
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name={field as keyof ShopperForm}
                  label={field.charAt(0).toUpperCase() + field.slice(1)}
                  placeholder={field}
                />
              ))}
            </section>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isPending}
                className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm disabled:opacity-50"
              >
                {isPending ? "Saving..." : "Continue"}
              </button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
