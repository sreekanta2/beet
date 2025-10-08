"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { MenuItemProps } from "@/config/menus";
import { cn, getDynamicPath, isLocationMatch } from "@/lib/utils";
import { useSidebar } from "@/store";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import AddBlock from "../common/add-block";
import SidebarLogo from "../common/logo";
import NestedSubMenu from "../common/nested-menus";
import SingleMenuItem from "./single-menu-item";
import SubMenuHandler from "./sub-menu-handler";

const PopoverSidebar = ({
  className,
  menus,
}: {
  className?: string;
  menus: MenuItemProps[];
}) => {
  const { collapsed, sidebarBg } = useSidebar();
  const user = useSession();
  const [activeSubmenu, setActiveSubmenu] = useState<number | null>(null);
  const [activeMultiMenu, setMultiMenu] = useState<number | null>(null);

  const toggleSubmenu = (i: number) => {
    setActiveSubmenu(activeSubmenu === i ? null : i);
  };

  const toggleMultiMenu = (subIndex: number) => {
    setMultiMenu(activeMultiMenu === subIndex ? null : subIndex);
  };

  const pathname = usePathname();
  const locationName = getDynamicPath(pathname);

  useEffect(() => {
    let subMenuIndex = null;
    let multiMenuIndex = null;
    menus?.map((item: any, i: number) => {
      if (item?.child) {
        item.child.map((childItem: any, j: number) => {
          if (isLocationMatch(childItem.href, locationName)) {
            subMenuIndex = i;
          }
          if (childItem?.multi_menu) {
            childItem.multi_menu.map((multiItem: any, k: number) => {
              if (isLocationMatch(multiItem.href, locationName)) {
                subMenuIndex = i;
                multiMenuIndex = j;
              }
            });
          }
        });
      }
    });
    setActiveSubmenu(subMenuIndex);
    setMultiMenu(multiMenuIndex);
  }, [locationName, menus]);

  // if (!isLoaded) {
  //   return (
  //     <div
  //       className={cn(
  //         "fixed bg-card top-0 border-r h-full z-[99] w-[72px] flex items-center justify-center"
  //       )}
  //     >
  //       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  //     </div>
  //   );
  // }

  return (
    <div
      className={cn("fixed bg-card top-0 border-r h-full z-[99]", {
        "w-[248px]": !collapsed,
        "w-[72px]": collapsed,
      })}
    >
      {sidebarBg !== "none" && (
        <div
          className="absolute left-0 top-0 z-[-1] w-full h-full bg-cover bg-center opacity-[0.07]"
          style={{ backgroundImage: `url(${sidebarBg})` }}
        />
      )}
      <SidebarLogo />
      <Separator />
      <ScrollArea
        className={cn("sidebar-menu h-[calc(100%-80px)]", {
          "px-4": !collapsed,
        })}
      >
        <ul
          className={cn("space-y-1", {
            "space-y-2 text-center": collapsed,
          })}
        >
          {menus?.length > 0 &&
            menus.map((item, i) => (
              <li key={`menu_key_${i}`}>
                {!item.child && !item.isHeader && (
                  <SingleMenuItem item={item} collapsed={collapsed} />
                )}
                {/* {item.isHeader && !item.child && !collapsed && (
                  <MenuLabel item={item} />
                )} */}
                {item.child && (
                  <>
                    <SubMenuHandler
                      item={item}
                      toggleSubmenu={toggleSubmenu}
                      index={i}
                      activeSubmenu={activeSubmenu}
                      collapsed={collapsed}
                    />
                    {!collapsed && (
                      <NestedSubMenu
                        toggleMultiMenu={toggleMultiMenu}
                        activeMultiMenu={activeMultiMenu}
                        activeSubmenu={activeSubmenu}
                        item={item}
                        index={i}
                      />
                    )}
                  </>
                )}
              </li>
            ))}
        </ul>

        {!collapsed && (
          <div className="-mx-2">
            <AddBlock />
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default PopoverSidebar;
