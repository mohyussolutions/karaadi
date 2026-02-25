import { JSX } from "react";
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

export interface INavLink {
  name: string;
  href: string;
  icon: JSX.Element;
  color?: string;
}

export interface Setting {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export const navLinks: INavLink[] = [
  { name: "My Ads", href: "/mine/my-ads", icon: <FiList /> },
  { name: "Favorites", href: "/mine/favorites", icon: <FiHeart /> },
  { name: "Saved", href: "/mine/saved-searches", icon: <FiSearch /> },
  { name: "Tickets", href: "/mine/TicketHistory", icon: <FiClock /> },
  { name: "Settings", href: "/mine/settings", icon: <FiSettings /> },
];

export const AccountDetailsnavLinks = navLinks;

export const settingsOptions: Setting[] = [
  {
    title: "Privacy",
    description: "Maamul xogtaada iyo dejinta asturnaanta.",
    href: "/mine/settings/privacy",
    icon: <FaShieldAlt className="text-blue-600 w-12 h-12" />,
  },
  {
    title: "secuity",
    description: "Hagaaji ilaalinta akoonkaaga iyo qalabkaaga.",
    href: "/mine/settings/security",
    icon: <FaLock className="text-green-600 w-12 h-12" />,
  },
  {
    title: "payment",
    description: "Maamul hababka bixinta iyo taariikhda lacag bixinta.",
    href: "/mine/settings/payment",
    icon: <FaCreditCard className="text-gray-700 w-12 h-12" />,
  },
  {
    title: "subscription",
    description: "Maamul hababka bixinta iyo taariikhda lacag bixinta.",
    href: "/mine/settings/subscription",
    icon: <FaBell className="text-gray-700 w-12 h-12" />,
  },
];

export const accountOptions = [
  {
    title: "My Ads",
    description: "See all your ads and track statistics",
    href: "/mine/my-ads",
    icon: <FaBullhorn className="text-green-600 w-6 h-6" />,
  },
  {
    title: "My Account",
    description: "View your details on KARAADI and Vend",
    href: "/mine/account",
    icon: <FaUserCircle className="text-blue-600 w-6 h-6" />,
  },
  {
    title: "Settings",
    description: "Manage your account settings on KARAADI",
    href: "/mine/settings",
    icon: <FaCog className="text-gray-700 w-6 h-6" />,
  },
  {
    title: "Favorites",
    description: "View all ads you like and have saved on KARAADI",
    href: "/mine/favorites",
    icon: <FaHeart className="text-red-500 w-6 h-6" />,
  },
  {
    title: "Saved Searches",
    description: "Manage and customize your saved searches",
    href: "/mine/saved-searches",
    icon: <FaSearch className="text-orange-500 w-6 h-6" />,
  },
  {
    title: "For Businesses",
    description: "View companies you have access to",
    href: "/mine/businesses",
    icon: <FaBuilding className="text-pink-600 w-6 h-6" />,
  },
  {
    title: "Contact History",
    description: "Track your support requests and messages",
    href: "/mine/TicketHistory",
    icon: <FaHistory className="text-pink-600 w-6 h-6" />,
  },
  {
    title: "My Subscriptions",
    description: "Manage your subscriptions and payment plans",
    href: "/mine/my-subscription",
    icon: <FaBell className="text-yellow-500 w-6 h-6" />,
  },
];
