"use client";

import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string;
}

export default function LogoutButton({ className }: LogoutButtonProps) {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`
        w-fit flex items-center justify-center gap-2
        px-4 py-4 rounded-lg font-semibold
        bg-gradient-to-r from-red-500 to-pink-500
        text-white shadow-md hover:shadow-lg
        hover:from-red-600 hover:to-pink-600
        transition-all duration-300
        ${className}
      `}
    >
      <LogOut size={18} className="text-white" />
      Logout
    </button>
  );
}
