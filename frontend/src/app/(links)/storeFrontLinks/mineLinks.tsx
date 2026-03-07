import {
  FaBell,
  FaBuilding,
  FaBullhorn,
  FaCog,
  FaCreditCard,
  FaHeart,
  FaHistory,
  FaLock,
  FaSearch,
  FaShieldAlt,
  FaUserCircle,
} from "react-icons/fa";
import { FiHeart, FiList, FiSearch, FiSettings, FiClock } from "react-icons/fi";
import { IconType } from "react-icons";

interface NavLink {
  name: string;
  href: string;
  icon: IconType;
}

interface OptionLink {
  title: string;
  description: string;
  href: string;
  icon: IconType;
  colorClass: string;
}

export const navLinks: NavLink[] = [
  { name: "My Ads", href: "/mine/my-ads", icon: FiList },
  { name: "Favorites", href: "/mine/favorites", icon: FiHeart },
  { name: "Saved", href: "/mine/saved-searches", icon: FiSearch },
  { name: "Tickets", href: "/mine/TicketHistory", icon: FiClock },
  { name: "Settings", href: "/mine/settings", icon: FiSettings },
];

export const settingsOptions: OptionLink[] = [
  {
    title: "Privacy",
    description: "Maamul xogtaada iyo dejinta asturnaanta.",
    href: "/mine/settings/privacy",
    icon: FaShieldAlt,
    colorClass: "text-blue-600",
  },
  {
    title: "Security",
    description: "Hagaaji ilaalinta akoonkaaga iyo qalabkaaga.",
    href: "/mine/settings/security",
    icon: FaLock,
    colorClass: "text-green-600",
  },
  {
    title: "Payment",
    description: "Maamul hababka bixinta iyo taariikhda lacag bixinta.",
    href: "/mine/settings/payment",
    icon: FaCreditCard,
    colorClass: "text-gray-700",
  },
  {
    title: "Subscription",
    description: "Maamul xogta is-qorista iyo lacag bixinta.",
    href: "/mine/settings/subscription",
    icon: FaBell,
    colorClass: "text-gray-700",
  },
];

export const accountOptions: OptionLink[] = [
  {
    title: "My Ads",
    description: "See all your ads and track statistics",
    href: "/mine/my-ads",
    icon: FaBullhorn,
    colorClass: "text-green-600",
  },
  {
    title: "My Account",
    description: "View your details on KARAADI and Smartsuuq",
    href: "/mine/account",
    icon: FaUserCircle,
    colorClass: "text-blue-600",
  },
  {
    title: "Settings",
    description: "Manage your account settings on KARAADI",
    href: "/mine/settings",
    icon: FaCog,
    colorClass: "text-gray-700",
  },
  {
    title: "Favorites",
    description: "View all ads you like and have saved on KARAADI",
    href: "/mine/favorites",
    icon: FaHeart,
    colorClass: "text-red-500",
  },
  {
    title: "Saved Searches",
    description: "Manage and customize your saved searches",
    href: "/mine/saved-searches",
    icon: FaSearch,
    colorClass: "text-orange-500",
  },
  {
    title: "For Businesses",
    description: "View companies you have access to",
    href: "/mine/businesses",
    icon: FaBuilding,
    colorClass: "text-pink-600",
  },
  {
    title: "Contact History",
    description: "Track your support requests and messages",
    href: "/mine/TicketHistory",
    icon: FaHistory,
    colorClass: "text-pink-600",
  },
  {
    title: "My Subscriptions",
    description: "Manage your subscriptions and payment plans",
    href: "/mine/my-subscription",
    icon: FaBell,
    colorClass: "text-yellow-500",
  },
];
