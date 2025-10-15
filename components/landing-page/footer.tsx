"use client";

import { Home, LogIn, LogOut, User, Video } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";

const Footer = () => {
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
    <>
      <div className="flex justify-end gap-3 max-w-4xl mx-auto p-3">
        {!session?.user ? (
          <div className="hidden md:flex justify-end gap-4 container p-3">
            {/* Register Button */}
            <button
              onClick={() => handleRoute("/auth/sign-up")}
              className="relative group bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <User size={18} className="relative z-10" />
              <span className="relative z-10">Register</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            {/* Register Shopper Button */}
            <button
              onClick={() => handleRoute("/auth/shoper")}
              className="relative group bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Home size={18} className="relative z-10" />
              <span className="relative z-10">Register Shopper</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            {/* Login Button */}
            <button
              onClick={() => handleRoute("/auth/sign-in")}
              className="relative group bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <LogIn size={18} className="relative z-10" />
              <span className="relative z-10">Login</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>

            {/* Watch Tutorial Button */}
            <button className="relative group bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <Video size={18} className="relative z-10" />
              <span className="relative z-10">Watch Tutorial</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
            </button>
          </div>
        ) : (
          <div className="w-full grid grid-cols-2 md:flex justify-end gap-3">
            {/* My Account Button */}
            <button
              onClick={() => handleRoute(`/${role}/dashboard`)}
              className="relative group bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <User size={18} className="relative z-10" />
              <span className="relative z-10">My Account</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="relative group bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white font-medium rounded-xl px-6 py-3 flex items-center gap-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-white/20 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              <LogOut size={18} className="relative z-10" />
              <span className="relative z-10">Logout</span>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              <div className="absolute -inset-1 bg-gradient-to-r from-red-400 to-rose-400 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            </button>
          </div>
        )}
      </div>
      <footer className="bg-gray-200 border-t mt-10 w-full">
        <div className="max-w-7xl mx-auto p-4  text-sm text-gray-600">
          <div className="flex flex-col gap-6">
            <div className="flex gap-6 flex-wrap md:flex-nowrap">
              <div>
                <h4 className="font-semibold mb-2">Informations</h4>
                <ul className="space-y-1">
                  <li>
                    <a href="/about">About Us</a>
                  </li>
                  <li>
                    <a href="/privacy-policy">Privacy Policy</a>
                  </li>
                  <li>
                    <a href="/terms-and-conditions">Terms & Conditions</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-400 ">
              <h1 className="pt-2">Powered By EASYTECH </h1>
              <div className="  text-xs">
                {" "}
                Easytech business world {new Date().getFullYear()}
              </div>
              <Link href={"https://srikanto.site"} target="_blank">
                Made
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
