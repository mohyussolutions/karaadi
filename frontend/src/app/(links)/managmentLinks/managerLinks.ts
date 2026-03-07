import {
  FaTachometerAlt,
  FaUsers,
  FaCheckCircle,
  FaChartBar,
  FaCog,
  FaBoxes,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";

export const managerTotalLinks = [
  {
    name: "Dashboard",
    icon: FaTachometerAlt,
    href: "/managers",
    category: "core",
  },
  {
    name: "Teams",
    icon: FaUsers,
    href: "/managers/teams",
    category: "core",
  },
  {
    name: "Approvals",
    icon: FaCheckCircle,
    href: "/managers/approvals",
    category: "core",
  },
  {
    name: "Inventory",
    icon: FaBoxes,
    href: "/managers/inventory",
    category: "backoffice",
  },
  {
    name: "Reports",
    icon: FaFileAlt,
    href: "/managers/reports",
    category: "backoffice",
  },
  {
    name: "Analytics",
    icon: FaChartBar,
    href: "/managers/analytics",
    category: "backoffice",
  },
  {
    name: "Settings",
    icon: FaCog,
    href: "/managers/settings",
    category: "system",
  },
  {
    name: "Sign Out",
    icon: FaSignOutAlt,
    href: "#",
    action: "logout",
    category: "system",
  },
];
