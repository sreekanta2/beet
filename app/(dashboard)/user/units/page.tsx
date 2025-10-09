"use client";

import Breadcrumb from "@/components/breadcumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

interface Units {
  id: string;
  name: string;
  serial: string;
  date: string;
}

interface Bonus {
  id: string;
  bonusName: string;
  amount: number;
  status: "Complete" | "Canceled" | "Processing";
  date: string;
}

const demoUnitss: Units[] = [
  {
    id: "1",
    name: "1st Units",
    serial: "1321462",
    date: "2025-10-05 17:46:50",
  },
  {
    id: "2",
    name: "2nd Units",
    serial: "1321463",
    date: "2025-10-05 17:46:52",
  },
  {
    id: "3",
    name: "3rd Units",
    serial: "1321464",
    date: "2025-10-05 17:46:54",
  },
];

const bonuses = [
  {
    id: 1,
    bonus: "1st Bonus",
    amount: "$120",
    status: "Completed",
    date: "2025-10-05 18:46:50",
  },
  {
    id: 2,
    bonus: "2nd Bonus",
    amount: "$80",
    status: "Processing",
    date: "2025-10-06 12:30:00",
  },
  {
    id: 3,
    bonus: "3rd Bonus",
    amount: "$50",
    status: "Cancelled",
    date: "2025-10-07 10:12:22",
  },
];

export default function MyUnits() {
  const [selectedUnits, setSelectedUnits] = useState<Units | null>(null);

  return (
    <div className="p-4">
      <Breadcrumb
        items={[{ label: "Home", href: "/user/dashboard" }, { label: "Units" }]}
      />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-4">My Units</h1>

        <div className=" ">
          <table className="w-full  text-xs">
            <thead className="bg-primary text-white">
              <tr>
                <th className="border border-gray-300 py-2 px-3 text-left">
                  Units
                </th>
                <th className="border border-gray-300 py-2 px-3 text-left">
                  Serial
                </th>
                <th className="border border-gray-300 py-2 px-3 text-left">
                  Date
                </th>
                <th className="border border-gray-300 py-2 px-3 text-left">
                  More
                </th>
              </tr>
            </thead>
            <tbody>
              {demoUnitss.map((unit) => (
                <tr key={unit.id} className="hover:bg-gray-50">
                  <td className="border border-gray-300 py-2 px-3">
                    {unit.name}
                  </td>
                  <td className="border border-gray-300 py-2 px-3">
                    {unit.serial}
                  </td>
                  <td className="border border-gray-300 py-2 px-3">
                    {unit.date}
                  </td>
                  <td className="border border-gray-300 py-2 px-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUnits(unit)}
                        >
                          Details
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-lg">
                        <DialogHeader>
                          <DialogTitle>{unit.name} - Bonus Details</DialogTitle>
                        </DialogHeader>

                        <table className="w-full border-collapse text-xs mt-2">
                          <thead className="bg-blue-100">
                            <tr>
                              <th className="border border-gray-300 py-2 px-3 text-left">
                                Bonus
                              </th>
                              <th className="border border-gray-300 py-2 px-3 text-left">
                                Amount
                              </th>
                              <th className="border border-gray-300 py-2 px-3 text-left">
                                Status
                              </th>
                              <th className="border border-gray-300 py-2 px-3 text-left">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {bonuses.map((bonus) => (
                              <tr key={bonus.id} className="hover:bg-gray-50">
                                <td className="border border-gray-300 py-2 px-3">
                                  {bonus.bonus}
                                </td>
                                <td className="border border-gray-300 py-2 px-3">
                                  {bonus.amount}
                                </td>
                                <td
                                  className={`border border-gray-300 py-2 px-3 font-medium ${
                                    bonus.status === "Completed"
                                      ? "text-green-600"
                                      : bonus.status === "Processing"
                                      ? "text-yellow-600"
                                      : "text-red-600"
                                  }`}
                                >
                                  {bonus.status}
                                </td>
                                <td className="border border-gray-300 py-2 px-3">
                                  {bonus.date}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </DialogContent>
                    </Dialog>
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
