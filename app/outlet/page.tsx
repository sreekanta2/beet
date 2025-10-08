"use client";

import {
  allDivision,
  districtsOf,
  upazilasOf,
} from "@bangladeshi/bangladesh-address";
import { useEffect, useState } from "react";

interface ShopperForm {
  division: string;
  district: string;
  upazila: string;
}

interface Shop {
  name: string;
  area: string;
  location?: string | null;
}

const shopData: Shop[] = [
  {
    name: "আলম স্টোর",
    area: "চট্টগ্রাম বিভাগ,কক্সবাজার, রামু, রাজারকুল ইউনিয়ন, রাজারকুল, বিন্নারচর",
    location: null,
  },
  {
    name: "Samaya Store",
    area: "চট্টগ্রাম বিভাগ,চন্দনাইশ, বরকলদী",
    location: null,
  },
  {
    name: "Shakil Shopping",
    area: "চট্টগ্রাম বিভাগ,ব্রাহ্মণবাড়িয়া, কসবাপাড়া, গোপালগঞ্জ",
    location: null,
  },
  {
    name: "অন ব্রিজ সেলুন",
    area: "চট্টগ্রাম বিভাগ,ব্রাহ্মণবাড়িয়া, সরাইল উপজেলা, আনোয়ারপুর",
    location: "https://maps.app.goo.gl/HokpdeQSTp38L6nH6",
  },
  {
    name: "Pakmon Ayurvedic pharmacy",
    area: "চট্টগ্রাম বিভাগ,কুমিল্লা, মুরাদনগর, কাঁঠালগাছ",
    location: "Pakmon ayurvedic pharmacy",
  },
  {
    name: "Ritika Jewellers",
    area: "চট্টগ্রাম বিভাগ",
    location: null,
  },
  {
    name: "Rayhan Shop",
    area: "চট্টগ্রাম বিভাগ",
    location: null,
  },
];

export default function Outlet() {
  const [divisions, setDivisions] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [upazilas, setUpazilas] = useState<
    { upazila: string; district: string; division: string }[]
  >([]);

  const [form, setForm] = useState<ShopperForm>({
    division: "",
    district: "",
    upazila: "",
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
      <div className="max-w-5xl mx-auto bg-white border border-gray-200 rounded-md mt-10 p-6 text-[14px] font-sans">
        <form onSubmit={handleSubmit} className="space-y-8">
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
            </div>
          </section>
        </form>
      </div>
      <div className="max-w-5xl mx-auto px-6 py-10 bg-white text-gray-800">
        <h1 className="text-2xl font-semibold mb-6">Search Result</h1>

        <div className="overflow-x-auto border border-gray-300 rounded-md">
          <table className="min-w-full border-collapse text-xs">
            <thead className="bg-gray-100 border-b border-gray-300">
              <tr>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 border-r">
                  Shop Name
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700 border-r">
                  Area
                </th>
                <th className="text-left px-4 py-3 font-semibold text-gray-700">
                  Location
                </th>
              </tr>
            </thead>
            <tbody>
              {shopData.map((shop, index) => (
                <tr
                  key={index}
                  className={`border-b hover:bg-gray-50 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 border-r">{shop.name}</td>
                  <td className="px-4 py-3 border-r">{shop.area}</td>
                  <td className="px-4 py-3">
                    {shop.location ? (
                      shop.location.startsWith("http") ? (
                        <a
                          href={shop.location}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {shop.location}
                        </a>
                      ) : (
                        <span>{shop.location}</span>
                      )
                    ) : (
                      <span className="text-gray-400">null</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
