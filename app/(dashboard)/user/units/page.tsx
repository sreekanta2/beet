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

import { ClubWithBonus } from "@/types";
import { ClubsBonus } from "@prisma/client";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function MyUnits() {
  const [selectedUnit, setSelectedUnit] = useState<ClubWithBonus | null>(null);
  const { data: session } = useSession();

  const { data, error, isLoading } = useSWR(
    session?.user?.id ? `/api/units/${session.user.id}` : null,
    fetcher
  );

  const {
    data: bonusData,
    error: clubError,
    isLoading: clubLoading,
  } = useSWR(
    selectedUnit ? `/api/units-bonus/${selectedUnit.serialNumber}` : null,
    fetcher
  );

  const units: ClubWithBonus[] = data?.clubs || [];

  return (
    <div className="p-4">
      <Breadcrumb items={[{ label: "Units" }]} />

      <div className="max-w-4xl mx-auto">
        <h1 className="text-xl font-semibold mb-6">My Units</h1>

        {/* LOADING STATE */}
        {isLoading && (
          <div className="flex justify-center py-6">
            <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="text-center text-red-600 py-6">
            Failed to load your units. Please refresh or try again later.
          </div>
        )}

        {/* EMPTY STATE */}
        {!isLoading && !error && units.length === 0 && (
          <div className="text-center text-gray-500 py-6">
            You don’t have any units yet.
          </div>
        )}

        {/* UNITS TABLE */}
        {!isLoading && !error && units.length > 0 && (
          <div className="overflow-x-auto rounded-md border">
            <table className="w-full text-xs">
              <thead className="bg-primary text-white">
                <tr>
                  <th className="py-2 px-3 text-left">Units</th>
                  <th className="py-2 px-3 text-left">Serial</th>
                  <th className="py-2 px-3 text-left">Date</th>
                  <th className="py-2 px-3 text-left">More</th>
                </tr>
              </thead>
              <tbody>
                {units.map((unit, index) => (
                  <tr key={unit.id} className="hover:bg-gray-50 border-b">
                    <td className="border py-2 px-3">Unit #{index + 1}</td>
                    <td className="border py-2 px-3">{unit.serialNumber}</td>
                    <td className="border py-2 px-3">
                      {new Date(unit.createdAt).toLocaleDateString()}
                    </td>
                    <td className="border py-2 px-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => setSelectedUnit(unit)}
                            className="text-xs"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>
                              Unit # {selectedUnit?.serialNumber} — Bonus
                              Details
                            </DialogTitle>
                          </DialogHeader>

                          {/* BONUS TABLE */}
                          {clubLoading && (
                            <div className="flex justify-center py-6">
                              <Loader2 className="w-5 h-5 text-gray-500 animate-spin" />
                            </div>
                          )}

                          {clubError && (
                            <div className="text-center text-red-500 py-4">
                              Failed to load bonus data.
                            </div>
                          )}

                          {!clubLoading && !clubError && (
                            <>
                              <table className="w-full border-collapse text-xs mt-3">
                                <thead className="bg-blue-100">
                                  <tr>
                                    <th className="border py-2 px-3 text-left">
                                      #
                                    </th>
                                    <th className="border py-2 px-3 text-left">
                                      Amount
                                    </th>
                                    <th className="border py-2 px-3 text-left">
                                      Status
                                    </th>
                                    <th className="border py-2 px-3 text-left">
                                      Date
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {bonusData?.clubs?.map(
                                    (bonus: ClubsBonus, idx: number) => (
                                      <tr
                                        key={bonus.id}
                                        className="hover:bg-gray-50"
                                      >
                                        <td className="border py-2 px-3">
                                          {idx + 1}
                                        </td>
                                        <td className="border py-2 px-3">
                                          {200 * Math.pow(2, idx)} ৳
                                        </td>
                                        <td
                                          className={`border py-2 px-3 font-medium ${
                                            bonus.status === "Complete"
                                              ? "text-green-600"
                                              : bonus.status === "Processing"
                                              ? "text-yellow-600"
                                              : "text-red-600"
                                          }`}
                                        >
                                          {bonus.status}
                                        </td>
                                        <td className="border py-2 px-3">
                                          {new Date(
                                            bonus.createdAt
                                          ).toLocaleString()}
                                        </td>
                                      </tr>
                                    )
                                  )}

                                  {/* Pending Bonus Row */}
                                  {bonusData?.clubs?.length < 12 && (
                                    <tr className="hover:bg-gray-50">
                                      <td className="border py-2 px-3">
                                        {bonusData?.clubs?.length + 1}
                                      </td>
                                      <td className="border py-2 px-3">
                                        {200 *
                                          Math.pow(
                                            2,
                                            bonusData?.clubs?.length || 0
                                          )}{" "}
                                        ৳
                                      </td>
                                      <td className="border py-2 px-3 text-yellow-600">
                                        Pending
                                      </td>
                                      <td className="border py-2 px-3">-</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </>
                          )}
                        </DialogContent>
                      </Dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
