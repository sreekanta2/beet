"use client";

import { Button } from "@/components/ui/button";
import { Home, LogIn, Menu, User, Video, X } from "lucide-react";
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
  const pathname = usePathname(); // ✅ Get current route

  const handleRoute = (url: string = "#") => {
    router.push(url);
  };

  return (
    <header className="bg-[#e9e9e9] shadow-sm z-40  border-b border-gray-300">
      {/* Top Action Buttons */}
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

      {/* Logo and Mobile Menu Toggle */}
      <div className="bg-background">
        <div className=" container flex   items-center justify-between py-4 px-4 md:px-0 ">
          <div className="font-bold text-xl">LOGO</div>
          {/* Mobile Menu Button */}
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
            {NAV_LINKS.map((link, i) => (
              <li
                key={i}
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
        </nav>
      </div>
    </header>
  );
}
