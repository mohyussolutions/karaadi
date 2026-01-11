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

export const SUPPORT_LINKS = [
  {
    label: "Dashboard",
    icon: <FiHome />,
    href: "/support",
    dashboardIcon: <FiHome size={36} />,
  },
  {
    label: "Users",
    icon: <FiUser />,
    href: "/support/users",
    dashboardIcon: <FiUser size={36} />,
  },
  {
    label: "Reports",
    icon: <FiFlag />,
    href: "/support/reports",
    dashboardIcon: <FiAlertTriangle size={36} />,
  },
  {
    label: "Ads",
    icon: <FiMonitor />,
    href: "/support/ads",
    dashboardIcon: <FiEdit size={36} />,
  },
  {
    label: "Banners",
    icon: <FiImage />,
    href: "/support/banners",
    dashboardIcon: <FiImage size={36} />,
  },
  {
    label: "Announcements",
    icon: <FiBell />,
    href: "/support/announcements",
    dashboardIcon: <FiMonitor size={36} />,
  },
  {
    label: "Messaging",
    icon: <FiMessageSquare />,
    href: "/support/messages",
    dashboardIcon: <FiMessageSquare size={36} />,
  },
  {
    label: "Content Review",
    icon: <FiShield />,
    href: "/support/content",
    dashboardIcon: <FiShield size={36} />,
  },
  {
    label: "Analytics",
    icon: <FiPieChart />,
    href: "/support/analytics",
    dashboardIcon: <FiPieChart size={36} />,
  },
  {
    label: "System",
    icon: <FiSettings />,
    href: "/support/system",
    dashboardIcon: <FiSettings size={36} />,
  },
];
