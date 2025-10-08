import { Badge } from "@/components/ui/badge";
import { cn, getDynamicPath, isLocationMatch } from "@/lib/utils";

import * as Tooltip from "@radix-ui/react-tooltip";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ComponentType, ElementType } from "react";

// Define the exact type expected by SingleMenuItem
interface MenuItem {
  badge?: string;
  href?: string;
  title?: string;
  icon?: ComponentType<{ className?: string }> | ElementType;
  isHeader?: boolean;
  child?: MenuItem[];
  multi_menu?: MenuItem[];
}

interface SingleMenuItemProps {
  item: MenuItem;
  collapsed: boolean;
}

const SingleMenuItem = ({ item, collapsed }: SingleMenuItemProps) => {
  const { badge, href, title, icon: Icon } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const user = useSession();

  // Get role from Clerk user metadata
  const userRole = user?.data?.user?.role as string;
  const rolePath = userRole?.toLowerCase() || "";

  // Skip rendering if href is not defined (shouldn't happen due to type)
  if (!href) return null;

  return (
    <Link href={`/${rolePath}/${href}`}>
      {collapsed ? (
        <Tooltip.Provider>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <span
                className={cn(
                  "h-12 w-12 mx-auto rounded-md transition-all duration-300 inline-flex flex-col items-center justify-center relative",
                  {
                    "bg-primary text-white data-[state=delayed-open]:bg-primary":
                      isLocationMatch(href, locationName),
                    "text-default-600 data-[state=delayed-open]:bg-primary-100 data-[state=delayed-open]:text-primary":
                      !isLocationMatch(href, locationName),
                  }
                )}
              >
                {Icon && <Icon className="w-6 h-6" />}
              </span>
            </Tooltip.Trigger>
            <Tooltip.Portal>
              <Tooltip.Content
                side="right"
                className="bg-primary text-primary-foreground data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade text-violet11 select-none rounded-[4px] px-[15px] py-[10px] text-[15px] leading-none shadow-sm will-change-[transform,opacity]"
                sideOffset={5}
              >
                {title}
                <Tooltip.Arrow className="fill-primary" />
              </Tooltip.Content>
            </Tooltip.Portal>
          </Tooltip.Root>
        </Tooltip.Provider>
      ) : (
        <div
          className={cn(
            "flex gap-3 text-default-700 text-base capitalize px-[10px] font-medium py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground",
            {
              "bg-primary text-white": isLocationMatch(href, locationName),
            }
          )}
        >
          <span className="flex-grow-0">
            {Icon && <Icon className="w-5 h-5" />}
          </span>
          <div className="text-box flex-grow text-sm ">{title}</div>
          {badge && <Badge className="rounded">{badge}</Badge>}
        </div>
      )}
    </Link>
  );
};

export default SingleMenuItem;
