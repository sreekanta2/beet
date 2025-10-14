"use client";
import { ChevronRight, Home } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
  className?: string;
  variant?: "default" | "minimal" | "steps";
}

export default function Breadcrumb({
  items,
  className = "",
  variant = "default",
}: BreadcrumbProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const dashboardLink = role ? `/${role}/dashboard` : "/";

  // Minimal Variant
  if (variant === "minimal") {
    return (
      <nav className={`w-full max-w-4xl mx-auto ${className} my-4`}>
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li>
            <Link
              href={dashboardLink}
              className="flex items-center gap-1 hover:text-blue-600 transition-colors"
            >
              <Home size={14} />
            </Link>
          </li>

          {items.map((item, index) => (
            <li key={index} className="flex items-center space-x-2">
              <ChevronRight size={14} className="text-gray-400" />
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-blue-600 transition-colors capitalize"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-gray-900 font-medium capitalize">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    );
  }

  // Default Variant (from first example)
  return (
    <nav className={`w-full max-w-4xl mx-auto ${className} my-4`}>
      <ol className="flex items-center space-x-2 text-sm">
        <li className="flex items-center">
          <Link
            href={dashboardLink}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
          >
            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200">
              <Home
                size={16}
                className="text-gray-600 group-hover:text-blue-600"
              />
            </div>
          </Link>
        </li>

        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <ChevronRight size={16} className="text-gray-400 mx-1" />

            {item.href ? (
              <Link
                href={item.href}
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
              >
                <div className="bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 group-hover:shadow-md group-hover:border-blue-200 transition-all duration-200">
                  <span className="font-medium text-sm capitalize">
                    {item.label}
                  </span>
                </div>
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-3 py-1.5 rounded-lg shadow-sm border border-blue-200">
                  <span className="font-semibold text-sm text-blue-700 capitalize">
                    {item.label}
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
