import { ChevronRight } from "lucide-react";
import { useState } from "react";

type ReferralUser = {
  id: string;
  name?: string;
  serialNumber?: number;
  cachedClubsCount?: number;
  badgeLevel?: string;
  createdAt?: string;
  referrals?: ReferralUser[];
};

export default function ReferralTree({ users }: { users: ReferralUser[] }) {
  return (
    <div className="space-y-3">
      {users.map((user, index) => (
        <ReferralNode key={user.id} user={user} level={1} />
      ))}
    </div>
  );
}

function ReferralNode({ user, level }: { user: ReferralUser; level: number }) {
  const [open, setOpen] = useState(false);
  const hasChildren = user.referrals && user.referrals.length > 0;

  const levelColors = [
    "border-l-blue-500",
    "border-l-green-500",
    "border-l-amber-500",
    "border-l-pink-500",
  ];

  return (
    <div
      className={`ml-${(level - 1) * 4} border-l-2 ${
        levelColors[level - 1] || "border-l-gray-300"
      } pl-2 py-2`}
    >
      <div
        className="flex flex-col md:flex-row   justify-between bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div className="flex items-center space-x-3">
          {hasChildren && (
            <ChevronRight
              className={`w-4 h-4 text-gray-400 transition-transform ${
                open ? "rotate-90" : ""
              }`}
            />
          )}
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-xs">
            {user.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-xs">
              {user.name || "Anonymous"}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Units: {user.cachedClubsCount ?? 0} | Badge: {user.badgeLevel}
            </p>
          </div>
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          Joined: {new Date(user.createdAt || "").toLocaleDateString()}
        </div>
      </div>

      {open && hasChildren && (
        <div className="mt-2 space-y-2">
          {user.referrals?.map((child) => (
            <ReferralNode key={child.id} user={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
