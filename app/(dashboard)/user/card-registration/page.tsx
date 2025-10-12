"use client";

import Breadcrumb from "@/components/breadcumb";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// 🧠 Zod schema for validation
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  nid: z.string().min(1, "NID is required"),
  occupation: z.string().optional(),
  position: z.string().optional(),
  bloodGroup: z.string().optional(),
  mobileNumber: z.string().min(10, "Valid mobile number required"),
  email: z.string().email("Invalid email").optional(),
  dob: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nationality: z.string().optional(),
  religion: z.string().optional(),
  presentVillage: z.string().optional(),
  presentPost: z.string().optional(),
  presentDistrict: z.string().optional(),
  permanentVillage: z.string().optional(),
  permanentPost: z.string().optional(),
  permanentDistrict: z.string().optional(),
  refName: z.string().optional(),
  refMobile: z.string().optional(),
  photo: z.any().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function CardRegistration() {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "Card Registration" },
        ]}
      />

      <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-400 to-indigo-600 text-white rounded-lg shadow-lg flex flex-col items-center text-center space-y-4">
        {/* Icon */}
        <div className="bg-white/20 p-4 rounded-full">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold">Coming Soon</h1>

        {/* Short info */}
        <p className="max-w-xl text-sm md:text-base text-white/90">
          We are working hard to bring you something amazing! Stay tuned for the
          launch and be ready to experience it first.
        </p>

        {/* Call to action */}
        <button className="mt-6 bg-white text-blue-600 font-semibold px-6 py-2 rounded-full shadow hover:bg-white/90 transition">
          Notify Me
        </button>
      </div>
    </div>
  );
}
//  <Form {...form}>
//    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
{
  /* <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
              <h1 className="text-2xl font-semibold">Card Registration</h1>
              <div className="max-w-xl">
                <CustomFormField
                  fieldType={FormFieldType.FILE_UPLOAD}
                  control={form.control}
                  name="image"
                  label="Upload profile picture"
                  file
                  required
                />
              </div>
            </div> */
}

{
  /* Profile Section */
}
{
  /* <h2 className="text-sm font-semibold mb-2">Profile</h2>
            <div className="border-t mb-6"></div> */
}

{
  /* Name Fields */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="name"
                label="Name"
                placeholder="Name"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="fatherName"
                label="Father Name"
                placeholder="Father Name"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="motherName"
                label="Mother Name"
                placeholder="Mother Name"
                required
              />
            </div> */
}

{
  /* NID, Occupation, Position */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nid"
                label="NID"
                placeholder="NID"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                label="Occupation"
                placeholder="Occupation"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="position"
                label="Position"
                placeholder="position"
                required
              />
            </div> */
}

{
  /* Blood Group, Mobile, Email */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="bloodGroup"
                label="Blood Group"
                placeholder="Blood Group"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="mobileNumber"
                label="Mobile Number"
                placeholder="Mobile Number"
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
            </div> */
}

{
  /* DOB, Gender, Nationality, Religion */
}
{
  /* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="dob"
                label="Date of Birth"
                type="date"
                placeholder="Date of Birth"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="gender"
                label="Gender"
                options={[
                  { label: "Male", value: "male" },
                  { label: "Female", value: "female" },
                ]}
                placeholder="gender"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="nationality"
                label="Nationality"
                placeholder="Nationality"
                required
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="religion"
                label="Religion"
                placeholder="Religion"
                required
              />
            </div> */
}

{
  /* Present Address */
}
{
  /* <h2 className="text-sm font-semibold mt-6 mb-2">Present Address</h2>
            <div className="border-t mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="presentVillage"
                label="Village"
                placeholder="Village"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="presentPost"
                label="Post Office"
                placeholder="Post Office"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="presentDistrict"
                label="District"
                placeholder="District"
              />
            </div> */
}

{
  /* Permanent Address */
}
{
  /* <h2 className="text-sm font-semibold mt-6 mb-2">
              Permanent Address
            </h2>
            <div className="border-t mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="permanentVillage"
                label="Village"
                placeholder="Village"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="permanentPost"
                label="Post Office"
                placeholder="Post Office"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="permanentDistrict"
                label="District"
                placeholder="District"
              />
            </div> */
}

{
  /* Referral Details */
}
{
  /* <h2 className="text-sm font-semibold mt-6 mb-2">
              Referral Details
            </h2>
            <div className="border-t mb-4"></div> */
}

{
  /* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="refName"
                label="Name"
                placeholder="Name"
              />
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="refMobile"
                label="Mobile"
                placeholder="Mobile"
              />
            </div> */
}

{
  /* Buttons */
}
{
  /* <div className="flex justify-between mt-8">
              <button
                type="button"
                className="px-4 py-1 bg-gray-100 text-sm rounded border border-gray-300 hover:bg-gray-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 bg-sky-500 text-white text-sm rounded hover:bg-sky-600"
              >
                Save
              </button>
            </div> */
}
{
  /* </form>
 </Form>; */
}
