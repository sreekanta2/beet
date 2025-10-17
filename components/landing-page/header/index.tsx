"use client";

import { Home, Menu, X } from "lucide-react";
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

  const handleHomeClick = () => {
    if (session?.user) {
      // Redirect based on user role
      switch (role) {
        case "shoper":
          router.push("/shoper/dashboard");
          break;
        case "user":
          router.push("/user/dashboard");
          break;
        case "admin":
          router.push("/admin/dashboard");
          break;

        default:
          router.push("/");
      }
    } else {
      router.push("/");
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="bg-[#e9e9e9] shadow-sm z-40 border-b border-gray-300">
      {/* Logo + Mobile Menu */}
      <div className="bg-background">
        <div className="flex max-w-4xl mx-auto items-center justify-between py-4 px-4 md:px-0">
          <div
            className="font-medium text-5xl md:text-4xl cursor-pointer"
            onClick={handleHomeClick}
          >
            <span className="text-[#ff4800]">E</span>ASY
            <span className="text-[#ff4800]">T</span>ECH
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
        <nav className="max-w-4xl mx-auto text-white text-sm font-medium border-b border-gray-800">
          <ul className="flex items-center justify-start">
            <li
              className={`flex items-center gap-1 px-4 py-3 border-r border-gray-700 transition cursor-pointer ${
                pathname === "/" ? "bg-orange-600" : "hover:bg-gray-900"
              }`}
              onClick={handleHomeClick}
            >
              <Home size={16} className="text-white" />
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
