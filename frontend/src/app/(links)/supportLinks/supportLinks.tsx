import {
  FiHome,
  FiUser,
  FiFlag,
  FiImage,
  FiBell,
  FiMessageSquare,
  FiSettings,
  FiMonitor,
  FiAlertTriangle,
  FiShield,
  FiEdit,
  FiPieChart,
} from "react-icons/fi";
import { IoCreate } from "react-icons/io5";

export const SUPPORT_LINKS = [
  {
    label: "Home",
    labelKey: "support.links.home",
    icon: <FiHome />,
    href: "/support",
    dashboardIcon: <FiHome size={36} />,
  },
  {
    label: "Users",
    labelKey: "support.links.users",
    icon: <FiUser />,
    href: "/support/users",
    dashboardIcon: <FiUser size={36} />,
  },
  {
    label: "Reports",
    labelKey: "support.links.reports",
    icon: <FiFlag />,
    href: "/support/reports",
    dashboardIcon: <FiAlertTriangle size={36} />,
  },
  {
    label: "Ads",
    labelKey: "support.links.ads",
    icon: <FiMonitor />,
    href: "/support/ads",
    dashboardIcon: <FiEdit size={36} />,
  },
  {
    label: "Banners",
    labelKey: "support.links.banners",
    icon: <FiImage />,
    href: "/support/banners",
    dashboardIcon: <FiImage size={36} />,
  },
  {
    label: "Announcements",
    labelKey: "support.links.announcements",
    icon: <FiBell />,
    href: "/support/announcements",
    dashboardIcon: <FiMonitor size={36} />,
  },
  {
    label: "Messaging",
    labelKey: "support.links.messaging",
    icon: <FiMessageSquare />,
    href: "/support/messages",
    dashboardIcon: <FiMessageSquare size={36} />,
  },
  {
    label: "Content Review",
    labelKey: "support.links.contentReview",
    icon: <FiShield />,
    href: "/support/content",
    dashboardIcon: <FiShield size={36} />,
  },

  {
    label: "System",
    labelKey: "support.links.system",
    icon: <FiSettings />,
    href: "/support/system",
    dashboardIcon: <FiSettings size={36} />,
  },
];
