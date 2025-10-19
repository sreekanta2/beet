import { ArrowUpCircle, Edit, Plus, Smartphone, Trash2 } from "lucide-react";
import {
  AwaitedReactNode,
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
} from "react";
// import type { BankService } from "../page";

export default function ServiceList({
  services,
  openDialog,
  setEditingService,
  setDeleteConfirm,
  setWithdrawOpen,
  setSelectedService,
}: any) {
  const getServiceIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("bkash")) return "🔵";
    if (lower.includes("nagad")) return "🟢";
    if (lower.includes("rocket")) return "🔴";
    if (lower.includes("upay")) return "🟣";
    return "📱";
  };

  if (services.length === 0)
    return (
      <div className="text-center py-12 bg-white rounded-3xl shadow-lg">
        <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Smartphone className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          No services added yet
        </h3>
        <p className="text-gray-500 mb-6">Start by adding your first service</p>
        <button
          onClick={() => openDialog(true)}
          className="flex items-center mx-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Service
        </button>
      </div>
    );

  return (
    <div className="grid gap-4 mt-6">
      <button
        onClick={() => openDialog(true)}
        className="flex items-center mx-auto bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all"
      >
        <Plus className="w-5 h-5 mr-2" /> Add Service
      </button>
      {services.map(
        (
          service: {
            id: Key | null | undefined;
            name:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | Promise<AwaitedReactNode>
              | null
              | undefined;
            number: string;
          },
          index: number
        ) => (
          <div
            key={service.id}
            className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                {/* <span className="text-2xl">{getServiceIcon(service.name)}</span> */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {service.number.replace(/(\d{4})(\d{3})(\d{4})/, "$1***$3")}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setWithdrawOpen(true);
                    setSelectedService(service);
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-green-600 border border-green-200 rounded-xl hover:bg-green-50"
                >
                  <ArrowUpCircle className="w-4 h-4" /> Withdraw
                </button>
                <button
                  onClick={() => {
                    setEditingService(service);
                    openDialog(true);
                  }}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setDeleteConfirm(service.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
}
