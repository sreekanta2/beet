"use client";

import { Button } from "@/components/ui/button";
import { Home, LogIn, LogOut, Menu, User, Video, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-and-conditions" },
  { label: "Contact", href: "/contact" },
  { label: "Outlet", href: "/outlet" },
  { label: "Shopping", href: "#" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const handleRoute = (url: string) => {
    router.push(url);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" }); // redirect to home after logout
  };

  return (
    <header className="bg-[#e9e9e9] shadow-sm z-40 border-b border-gray-300">
      {/* Top Action Buttons */}
      <div className="flex justify-end gap-3 container p-3">
        {!session?.user ? (
          <div className="hidden md:flex justify-end gap-3 container  p-3  ">
            <Button
              className="bg-[#1e96c8] hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
              onClick={() => handleRoute("/auth/sign-up")}
            >
              <User size={16} /> Register
            </Button>
            <Button
              onClick={() => handleRoute("/auth/shoper")}
              className="bg-[#1e96c8] hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
            >
              <Home size={16} /> Register Shopper
            </Button>
            <Button
              onClick={() => handleRoute("/auth/sign-in")}
              className="bg-[#1e96c8] hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
            >
              <LogIn size={16} /> Login
            </Button>
            <Button
              onClick={() => handleRoute("/auth/sign-in")}
              className="bg-[#1e96c8] hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
            >
              <LogIn size={16} /> Login Co-Ordinator
            </Button>
            <Button className="bg-[#1e96c8] hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm">
              <Video size={16} /> Watch Video Tutorial
            </Button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 md:flex justify-end  gap-2">
            <Button
              onClick={() => handleRoute(`/${role}/dashboard`)}
              className="bg-[#1e96c8] w-full md:w-fit hover:bg-[#187aa5] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
            >
              <User size={16} /> My Account
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#e63946] w-full md:w-fit hover:bg-[#c53030] text-white font-medium rounded-sm px-4 py-2 flex items-center gap-2 shadow-sm"
            >
              <LogOut size={16} /> Logout
            </Button>
          </div>
        )}
      </div>

      {/* Logo + Mobile Menu */}
      <div className="bg-background">
        <div className="container flex items-center justify-between py-4 px-4 md:px-0">
          <div
            className="font-bold text-xl cursor-pointer"
            onClick={() => handleRoute("/")}
          >
            EASYTECH
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block w-full bg-black">
        <nav className="container text-white text-sm font-medium border-b border-gray-800">
          <ul className="flex items-center justify-start">
            <li
              className={`flex items-center gap-1 px-4 py-3 border-r border-gray-700 transition cursor-pointer ${
                pathname === "/" ? "bg-orange-600" : "hover:bg-gray-900"
              }`}
            >
              <Link href="/">
                <Home size={16} className="text-white" />
              </Link>
            </li>
            {NAV_LINKS.map((link) => (
              <li
                key={link.href}
                className={`px-4 py-3 border-r border-gray-700 transition cursor-pointer ${
                  pathname === link.href ? "bg-orange-600" : "hover:bg-gray-900"
                }`}
              >
                <Link href={link.href} className="text-white whitespace-nowrap">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden bg-black text-white overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col px-4 py-2 gap-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-sm px-3 py-2 border-b transition ${
                pathname === link.href ? "bg-orange-600" : "hover:bg-orange-600"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {session?.user && (
            <button
              onClick={() => {
                setMenuOpen(false);
                handleLogout();
              }}
              className="text-sm px-3 py-2 border-b text-left hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
