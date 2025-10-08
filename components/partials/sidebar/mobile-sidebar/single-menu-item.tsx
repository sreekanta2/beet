import { Badge } from "@/components/ui/badge";
import { cn, getDynamicPath, isLocationMatch } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
const SingleMenuItem = ({ item }: { item: any; collapsed: boolean }) => {
  const { badge, href, title } = item;
  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);
  const isActive = isLocationMatch(href, locationName);

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex gap-3  text-default-700 text-base capitalize px-[10px] py-3 rounded cursor-pointer hover:bg-primary hover:text-primary-foreground",
          {
            "bg-primary text-white": isActive,
          }
        )}
      >
        {item?.icon && (
          <span className="flex-grow-0">
            <item.icon className="w-5 h-5" />
          </span>
        )}
        <div className="text-box flex-grow text-sm md:text-base font-semibold">
          {title}
        </div>
        {badge && <Badge className=" rounded">{item.badge}</Badge>}
      </div>
    </Link>
  );
};

export default SingleMenuItem;
