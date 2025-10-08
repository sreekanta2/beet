import {
  Image,
  Phone,
  PlayCircle,
  ShoppingCart,
  Users,
  Wallet,
} from "lucide-react";

export interface MenuItemProps {
  title?: string;
  icon?: React.ElementType;
  href?: string;
  child?: MenuItemProps[];
  megaMenu?: MenuItemProps[];
  multi_menu?: MenuItemProps[];
  nested?: MenuItemProps[];
  onClick?: () => void;
  isHeader?: boolean;
}

export const menus = [
  {
    title: "login ",
    href: "",
  },
];
export const adminConfig: MenuItemProps[] = [
  {
    title: "Users",
    icon: Users,
    href: "users",
  },
  {
    title: "Packages",
    icon: ShoppingCart,
    href: "packages",
  },
  {
    title: "Payment Requests",
    icon: Wallet,
    href: "transactions",
  },
  // {
  //   title: "Payment Requests",
  //   icon: Wallet,
  //   href: "payment-request",
  // },
  {
    title: "Numbers",
    icon: Phone,
    href: "numbers",
  },
  {
    title: "Ads",
    icon: PlayCircle,
    href: "ads",
  },
  {
    title: "Banners",
    icon: Image,
    href: "banners",
  },
];
