"use client";
import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import { Button } from "@/components/ui/button";
import { BarChart3, CreditCard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { label: "Withdrawals", href: "/admin/withdraw", icon: CreditCard },
];

const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  return (
    <>
      <Header />
      <div className="flex items-center gap-2 p-1 bg-white/80 rounded-2xl border border-gray-200/60 max-w-4xl mx-auto backdrop-blur-sm m-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={pathname === item.href ? "soft" : "ghost"}
                size="sm"
                className="gap-2 rounded-xl"
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Button>
            </Link>
          );
        })}
      </div>
      {children}
      <Footer />
    </>
  );
};

export default Layout;
