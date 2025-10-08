"use client";

import Breadcrumb from "@/components/breadcumb";
import {
  allDivision,
  districtsOf,
  upazilasOf,
} from "@bangladeshi/bangladesh-address";
import { useEffect, useState } from "react";

interface ShopperForm {
  selfCustomerId: string;
  introducerCustomerId: string;
  branch: string;
  shopName: string;
  ownerName: string;
  nidNumber: string;
  division: string;
  district: string;
  upazila: string;
  telephone: string;
  calculationType: string;
  password: string;
  confirmPassword: string;
  agree: boolean;
  calculationAmmount: string;
}

export default function ShopperAccount() {
  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<
    { upazila: string; district: string; division: string }[]
  >([]);

  const [form, setForm] = useState<ShopperForm>({
    selfCustomerId: "",
    introducerCustomerId: "",
    branch: "",
    shopName: "",
    ownerName: "",
    nidNumber: "",
    division: "",
    district: "",
    upazila: "",
    telephone: "",
    calculationType: "",
    password: "",
    confirmPassword: "",
    agree: false,
    calculationAmmount: "",
  });

  // Load divisions
  useEffect(() => {
    setDivisions(allDivision());
  }, []);

  // Update districts when division changes
  useEffect(() => {
    if (form.division) {
      setDistricts(districtsOf(form.division as any));
      setForm((prev) => ({ ...prev, district: "", upazila: "" }));
      setUpazilas([]);
    } else {
      setDistricts([]);
      setUpazilas([]);
    }
  }, [form.division]);

  // Update upazilas when district changes
  // Update upazilas when district changes
  useEffect(() => {
    if (form.district) {
      const upz = upazilasOf(form.district);
      setUpazilas(upz);
      setForm((prev) => ({ ...prev, upazila: "" }));
    } else {
      setUpazilas([]);
    }
  }, [form.district]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Determine if the target is a checkbox
    const val =
      type === "checkbox" && "checked" in e.target ? e.target.checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: val,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div>
      <Breadcrumb
        items={[
          { label: "dashboard", href: "/dashboard" },
          { label: "edit info" },
        ]}
      />
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
        {/* Breadcrumb */}

        <h1 className="text-2xl font-semibold mb-2">Shopper Account</h1>
        <p className="text-sm text-gray-600 mb-6">
          If you already have an account with us, please{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            login at the login page
          </a>
          .
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Reference Customer */}
          <section>
            <h2 className="font-semibold mb-2 text-base">Reference Customer</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Self Customer ID
                </label>
                <input
                  type="text"
                  name="selfCustomerId"
                  placeholder="Self Customer ID"
                  value={form.selfCustomerId}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Introducer Customer ID
                </label>
                <input
                  required
                  type="text"
                  name="introducerCustomerId"
                  placeholder="Introducer Customer ID"
                  value={form.introducerCustomerId}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Shop Details */}
          <section>
            <h2 className="font-semibold mb-2 text-base">Your Shop Details</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Branch
                </label>
                <select
                  required
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                >
                  <option value="">[Please Select]</option>
                  <option>Dhaka</option>
                  <option>Chittagong</option>
                  <option>Khulna</option>
                  <option>Rajshahi</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Shop Name
                </label>
                <input
                  required
                  type="text"
                  name="shopName"
                  placeholder="Shop Name"
                  value={form.shopName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Owner Name
                </label>
                <input
                  required
                  type="text"
                  name="ownerName"
                  placeholder="Owner Name"
                  value={form.ownerName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">NID Number</label>
                <input
                  type="text"
                  name="nidNumber"
                  placeholder="NID Number"
                  value={form.nidNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Personal Details */}
          <section>
            <h2 className="font-semibold mb-2 text-base">
              Your Personal Details
            </h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              {/* Division */}
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Division
                </label>
                <select
                  name="division"
                  required
                  value={form.division}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                >
                  <option value="">[Select Division]</option>
                  {divisions.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* District */}
              {districts?.length > 0 && (
                <div>
                  <label className="block mb-1 font-medium">
                    <span className="text-red-500">*</span> District
                  </label>
                  <select
                    required
                    name="district"
                    value={form.district}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                    disabled={!form.division}
                  >
                    <option value="">[Select District]</option>
                    {districts.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Upazila */}
              {upazilas?.length > 0 && (
                <div>
                  <label className="block mb-1 font-medium">
                    {" "}
                    <span className="text-red-500">*</span> Upazila
                  </label>
                  <select
                    required
                    name="upazila"
                    value={form.upazila}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                    disabled={!form.district}
                  >
                    <option value="">[Select Upazila]</option>
                    {upazilas.map((u) => (
                      <option key={u.upazila} value={u.upazila}>
                        {u?.upazila}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              {/* Telephone */}
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Telephone
                </label>
                <input
                  type="text"
                  required
                  name="telephone"
                  placeholder="Telephone"
                  value={form.telephone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Contract */}
          <section>
            <h2 className="font-semibold mb-2 text-base">Contract</h2>
            <div className="border-t border-gray-200 pt-3">
              <label className="block mb-1 font-medium">
                {" "}
                <span className="text-red-500">*</span> Calculation Type
              </label>
              <select
                name="calculationType"
                required
                value={form.calculationType}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              >
                <option value="">[Please select]</option>
                <option>Fixed</option>
                <option>Percent</option>
              </select>
            </div>
            {form?.calculationType === "Percent" && (
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Calculation Amount
                </label>
                <input
                  required
                  type="text"
                  name="calculationAmmount"
                  placeholder=""
                  value={form.calculationAmmount}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            )}
          </section>

          {/* Password */}
          <section>
            <h2 className="font-semibold mb-2 text-base">Your Password</h2>
            <div className="border-t border-gray-200 pt-3 space-y-4">
              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password
                </label>
                <input
                  required
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  <span className="text-red-500">*</span> Password Confirm
                </label>
                <input
                  type="password"
                  required
                  name="confirmPassword"
                  placeholder="Password Confirm"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* Agreement + Submit */}
          <div className="flex flex-col md:flex-row justify-between items-center border-t border-gray-200 pt-3">
            <label className="flex items-center text-sm space-x-2 mb-3 md:mb-0">
              <input
                type="checkbox"
                name="agree"
                checked={form.agree}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>
                I have read and agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>
              </span>
            </label>

            <button
              type="submit"
              className="bg-[#1E90FF] text-white px-5 py-2 rounded-sm hover:bg-blue-700 text-sm"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
