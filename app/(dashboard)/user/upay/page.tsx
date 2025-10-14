"use client";

import Breadcrumb from "@/components/breadcumb";
import { Edit, Plus, Shield, Smartphone, Trash2, X, Zap } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { z } from "zod";

const serviceSchema = z.object({
  name: z.string().min(1, "Service name is required"),
  number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number too long")
    .regex(/^[0-9]+$/, "Phone number must contain only digits"),
});

interface BankService {
  id: number;
  name: string;
  number: string;
}

export default function UpayPage() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const [services, setServices] = useState<BankService[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<BankService | null>(
    null
  );
  const [form, setForm] = useState({ name: "", number: "" });
  const [errors, setErrors] = useState<{ name?: string; number?: string }>({});
  const [loading, setLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const fetchServices = async () => {
    if (!userId) return;
    const res = await fetch(`/api/mobile-banking?userId=${userId}`);
    const data = await res.json();
    setServices(data);
  };

  useEffect(() => {
    fetchServices();
  }, [userId]);

  const openDialog = (service?: BankService) => {
    if (service) {
      setEditingService(service);
      setForm({ name: service.name, number: service.number });
    } else {
      setEditingService(null);
      setForm({ name: "", number: "" });
    }
    setErrors({});
    setDialogOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setErrors({});
    const validation = serviceSchema.safeParse(form);
    if (!validation.success) {
      const fieldErrors: { name?: string; number?: string } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as "name" | "number";
        fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    if (!userId) return;
    setLoading(true);

    const payload = { ...form, userId };
    const url = "/api/mobile-banking";

    try {
      let res;
      if (editingService) {
        res = await fetch(url, {
          method: "PATCH",
          body: JSON.stringify({ ...payload, id: editingService.id }),
          headers: { "Content-Type": "application/json" },
        });
      } else {
        res = await fetch(url, {
          method: "POST",
          body: JSON.stringify(payload),
          headers: { "Content-Type": "application/json" },
        });
      }

      const data = await res.json();
      if (data.success) {
        fetchServices();
        setDialogOpen(false);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    setLoading(true);
    await fetch("/api/mobile-banking", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: { "Content-Type": "application/json" },
    });
    fetchServices();
    setLoading(false);
    setDeleteConfirm(null);
  };

  const getServiceIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("bkash")) return "🔵";
    if (lowerName.includes("nagad")) return "🟢";
    if (lowerName.includes("rocket")) return "🔴";
    if (lowerName.includes("upay")) return "🟣";
    return "📱";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col items-center p-4 md:p-6 font-sans">
      <div className="w-full max-w-4xl">
        <Breadcrumb items={[{ label: "E-wallet" }]} />

        {/* Header Section */}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-blue-100 p-3 rounded-xl mr-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Total Services
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-green-100 p-3 rounded-xl mr-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Active Accounts
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {services.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center">
              <div className="bg-purple-100 p-3 rounded-xl mr-4">
                <Smartphone className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 font-medium">
                  Quick Access
                </p>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/70 overflow-hidden">
          {/* Header with CTA */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Your Banking Services
                </h2>
                <p className="text-blue-100">
                  Add and manage your mobile banking accounts
                </p>
              </div>
              <button
                onClick={() => openDialog()}
                className="mt-4 sm:mt-0 flex items-center bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5 mr-2" /> Add New Service
              </button>
            </div>
          </div>

          {/* Services List */}
          <div className="p-6">
            {services.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Smartphone className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No services added yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by adding your first mobile banking service
                </p>
                <button
                  onClick={() => openDialog()}
                  className="flex items-center mx-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Your First Service
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {services.map((service, index) => (
                  <div
                    key={service.id}
                    className="group bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getServiceIcon(service.name)}
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-700 font-bold rounded-full w-8 h-8 flex items-center justify-center text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-gray-600 text-sm">
                              {service.number.replace(
                                /(\d{4})(\d{3})(\d{4})/,
                                "$1***$3"
                              )}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openDialog(service)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 group/edit"
                          title="Edit service"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(service.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/delete"
                          title="Delete service"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      {dialogOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">
                  {editingService ? "Update Service" : "Add New Service"}
                </h2>
                <button
                  onClick={() => setDialogOpen(false)}
                  className="text-white/80 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Name
                </label>
                <select
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="">Select a service</option>
                  <option value="bKash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket (DBBL)</option>
                </select>

                {errors.name && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    ⚠️ {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  name="number"
                  placeholder="01XXXXXXXXX"
                  value={form.number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                {errors.number && (
                  <p className="text-red-500 text-xs mt-2 flex items-center">
                    ⚠️ {errors.number}
                  </p>
                )}
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-70 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Processing...
                  </span>
                ) : editingService ? (
                  "Update Service"
                ) : (
                  "Add Service"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transform transition-all duration-300 scale-100">
            <div className="p-6 text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Delete Service?
              </h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this service? This action cannot
                be undone.
              </p>

              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  disabled={loading}
                  className="flex-1 bg-red-600 text-white px-4 py-3 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-70 transition-all duration-200"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
