import { Shield, Smartphone, Zap } from "lucide-react";

export default function StatsCards({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {[
        { icon: Zap, label: "Total Services", value: count, color: "blue" },
        {
          icon: Shield,
          label: "Active Accounts",
          value: count,
          color: "green",
        },
        {
          icon: Smartphone,
          label: "Quick Access",
          value: "24/7",
          color: "purple",
        },
      ].map((item, i) => (
        <div
          key={i}
          className={`bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300`}
        >
          <div className="flex items-center">
            <div className={`bg-${item.color}-100 p-3 rounded-xl mr-4`}>
              <item.icon className={`w-6 h-6 text-${item.color}-600`} />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{item.label}</p>
              <p className="text-2xl font-bold text-gray-900">{item.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
