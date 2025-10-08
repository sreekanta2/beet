"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  queryKey?: string;
  scrollTarget?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  queryKey = "page",
  scrollTarget = "top",
}: PaginationProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname(); // get current path safely

  const createLink = (page: number) => {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set(queryKey, page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const handleSmoothScroll = () => {
    if (typeof window !== "undefined") {
      const target =
        scrollTarget === "top"
          ? document.body
          : document.getElementById(scrollTarget);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  useEffect(() => {
    handleSmoothScroll();
  }, [currentPage]);

  const renderPageButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    // First page
    buttons.push(
      <li key={1}>
        <Link href={createLink(1)} onClick={handleSmoothScroll}>
          <Button
            aria-current={currentPage === 1 ? "page" : undefined}
            className={cn(
              "h-9 w-9 text-sm p-0",
              currentPage === 1
                ? "bg-primary text-primary-foreground"
                : "bg-default-100 text-default-600 hover:bg-opacity-70"
            )}
          >
            1
          </Button>
        </Link>
      </li>
    );

    // Ellipsis start
    if (currentPage > 3 && totalPages > maxVisiblePages) {
      buttons.push(
        <li key="ellipsis-start">
          <span className="h-9 w-9 flex items-center justify-center">...</span>
        </li>
      );
    }

    // Middle pages
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);
    if (currentPage <= 3) endPage = Math.min(4, totalPages - 1);
    if (currentPage >= totalPages - 2) startPage = Math.max(totalPages - 3, 2);

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i}>
          <Link href={createLink(i)} onClick={handleSmoothScroll}>
            <Button
              aria-current={currentPage === i ? "page" : undefined}
              className={cn(
                "h-9 w-9 text-sm p-0",
                currentPage === i
                  ? "bg-primary text-primary-foreground"
                  : "bg-default-100 text-default-600 hover:bg-opacity-70"
              )}
            >
              {i}
            </Button>
          </Link>
        </li>
      );
    }

    // Ellipsis end
    if (currentPage < totalPages - 2 && totalPages > maxVisiblePages) {
      buttons.push(
        <li key="ellipsis-end">
          <span className="h-9 w-9 flex items-center justify-center">...</span>
        </li>
      );
    }

    // Last page
    if (totalPages > 1) {
      buttons.push(
        <li key={totalPages}>
          <Link href={createLink(totalPages)} onClick={handleSmoothScroll}>
            <Button
              aria-current={currentPage === totalPages ? "page" : undefined}
              className={cn(
                "h-9 w-9 text-sm p-0",
                currentPage === totalPages
                  ? "bg-primary text-primary-foreground"
                  : "bg-default-100 text-default-600 hover:bg-opacity-70"
              )}
            >
              {totalPages}
            </Button>
          </Link>
        </li>
      );
    }

    return buttons;
  };

  return (
    <div className="flex flex-wrap justify-center mt-8 items-center">
      {/* Previous Button */}
      {currentPage > 1 && (
        <Link href={createLink(currentPage - 1)} onClick={handleSmoothScroll}>
          <Button size="icon" variant="outline" className="h-9 w-9 mr-2">
            <Icon icon="heroicons:chevron-left" className="w-4 h-4" />
          </Button>
        </Link>
      )}

      <ul className="flex space-x-2 rtl:space-x-reverse items-center">
        {renderPageButtons()}
      </ul>

      {/* Next Button */}
      {currentPage < totalPages && (
        <Link href={createLink(currentPage + 1)} onClick={handleSmoothScroll}>
          <Button size="icon" variant="outline" className="h-9 w-9 ml-2">
            <Icon icon="heroicons:chevron-right" className="w-4 h-4" />
          </Button>
        </Link>
      )}
    </div>
  );
}
