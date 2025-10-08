"use client";
import { countryList } from "@/lib/utils/utils";
import Link from "next/link";
import { useState } from "react";

export default function RegisterAccount() {
  const [formData, setFormData] = useState({
    country: "Bangladesh",
    reference: "",
    firstName: "",
    lastName: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    subscribe: "no",
    agree: false,
  });
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;
    const name = target.name;

    // Narrow the type to HTMLInputElement for checkbox
    const value =
      target instanceof HTMLInputElement && target.type === "checkbox"
        ? target.checked
        : target.value;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
        <Link href="/" className="text-blue-500 hover:underline cursor-pointer">
          🏠 Home
        </Link>
        <span>/</span>
        {/* <span className="text-blue-500 hover:underline cursor-pointer">
          Account
        </span> */}
        {/* <span>/</span> */}
        <span>Register</span>
      </div>

      <h1 className="text-2xl font-semibold mb-2">Register Account</h1>
      <p className="text-sm text-gray-600 mb-6">
        If you already have an account with us, please{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          login at the login page
        </a>
        .
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Localization */}
        <div>
          <h2 className="font-semibold mb-2 text-base">Localization</h2>
          <div className="border-t border-gray-200 pt-3">
            <label className="block mb-1 font-medium">
              <span className="text-red-500">*</span> Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
            >
              {countryList.map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Reference */}
        <div>
          <h2 className="font-semibold mb-2 text-base">Your Reference</h2>
          <div className="border-t border-gray-200 pt-3">
            <input
              type="text"
              name="reference"
              placeholder="Reference"
              value={formData.reference}
              onChange={handleChange}
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
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                <span className="text-red-500">*</span> Last Name
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">
                <span className="text-red-500">*</span> Telephone
              </label>
              <input
                type="tel"
                name="telephone"
                placeholder="Telephone"
                value={formData.telephone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              />
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
                name="password"
                placeholder="Password"
                value={formData.password}
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
                name="confirmPassword"
                placeholder="Password Confirm"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-sm px-3 py-2 focus:outline-none"
              />
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
                name="subscribe"
                value="yes"
                checked={formData.subscribe === "yes"}
                onChange={handleChange}
                className="accent-blue-600"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="subscribe"
                value="no"
                checked={formData.subscribe === "no"}
                onChange={handleChange}
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
              name="agree"
              checked={formData.agree}
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
  );
}
