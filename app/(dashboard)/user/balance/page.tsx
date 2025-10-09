import Breadcrumb from "@/components/breadcumb";
import WithdrawButton from "./components/withdraw-button";

export default function PointsDashboard() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6 font-sans">
      <Breadcrumb
        items={[
          { label: "Home", href: "/user/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between md:justify-start md:gap-28">
          <h1 className="text-xl font-semibold">
            My Point: <span className="font-bold text-gray-800">0</span>
          </h1>
          <button className="bg-blue-500 hover:bg-blue-600 text-white text-xs px-4 py-2 rounded">
            Team Point
          </button>
        </div>

        {/* Top Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Income Items */}
          <div className="border rounded shadow-sm bg-white">
            <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
              Income Items
            </h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-2">Item Name</th>
                  <th className="text-right px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Team Income", "0"],
                  ["Club Income", "0.0000000000"],
                  ["Club Bonus", "0"],
                  ["Royalty", "0"],
                  ["Referral", "0"],
                ].map(([name, amount], i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-2">{name}</td>
                    <td className="text-right px-4 py-2">{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Withdraw History Mobile Banking */}
          <div className="border rounded shadow-sm bg-white">
            <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
              Withdraw History Mobile Banking
            </h2>
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-4 py-2 text-left">Withdraw Date</th>
                  <th className="px-4 py-2 text-left">Mobile Number</th>
                  <th className="px-4 py-2 text-right">Amount</th>
                  <th className="px-4 py-2 text-center">Withdrawable</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="px-4 py-2 text-gray-500">—</td>
                  <td className="px-4 py-2 text-gray-500">—</td>
                  <td className="px-4 py-2 text-right text-gray-500">—</td>
                  <td className="px-4 py-2 text-center">
                    <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                      Withdrawable
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-gray-500">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Withdraw History from Branch */}
        <div className="border rounded shadow-sm bg-white">
          <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
            Withdraw History From Branch
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left">Withdraw Date</th>
                <th className="px-4 py-2 text-right">Amount</th>
                <th className="px-4 py-2 text-center">Withdrawable</th>
                <th className="px-4 py-2 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2 text-gray-500">—</td>
                <td className="px-4 py-2 text-right text-gray-500">—</td>
                <td className="px-4 py-2 text-center">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                    Withdrawable
                  </span>
                </td>
                <td className="px-4 py-2 text-center text-gray-500">—</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Balance Summary */}
        <div className="border rounded shadow-sm bg-white max-w-md">
          <h2 className="bg-gray-100 border-b px-4 py-2 font-semibold">
            Balance Summary
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="px-4 py-2 text-left">Balance Item</th>
                <th className="px-4 py-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Total Income", "0"],
                ["Total Withdrawed", "0"],
              ].map(([name, amount], i) => (
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{name}</td>
                  <td className="text-right px-4 py-2">{amount}</td>
                </tr>
              ))}
              <tr className="bg-green-600 text-white font-semibold">
                <td className="px-4 py-2">Balance</td>
                <td className="text-right px-4 py-2">0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Buttons */}
        <div className="flex w-full items-center justify-end  ">
          {/* <BackButton /> */}
          <WithdrawButton />
        </div>
      </div>
    </div>
  );
}
