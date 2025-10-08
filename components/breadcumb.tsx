"use client";
import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="w-full max-w-4xl mx-auto border border-gray-300 bg-gray-100 rounded mt-4"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center px-4   text-sm">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index === 0 && (
              <Link
                href={item.href || "/"}
                className="text-blue-600 hover:underline flex items-center gap-1 font-normal"
              >
                <Home size={14} strokeWidth={2} />
              </Link>
            )}

            {index !== 0 && (
              <>
                <ChevronRight
                  size={40}
                  strokeWidth={0.5}
                  className="text-gray-400 m-0 p-0 leading-none"
                />

                {item.href ? (
                  <Link
                    href={item.href}
                    className="text-blue-600 hover:underline font-normal"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-gray-500 font-normal">
                    {item.label}
                  </span>
                )}
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
