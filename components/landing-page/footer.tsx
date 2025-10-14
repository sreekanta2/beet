"use client";

import { Home, LogIn, LogOut, User, Video } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { useState } from "react";
import { Button } from "../ui/button";

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
