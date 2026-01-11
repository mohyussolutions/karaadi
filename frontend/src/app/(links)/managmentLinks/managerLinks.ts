import {
  FaTachometerAlt,
  FaUsers,
  FaFolder,
  FaProjectDiagram,
  FaFileAlt,
  FaCog,
  FaServer,
  FaCheckCircle,
  FaChartBar,
  FaHome,
  FaCar,
  FaShip,
  FaMotorcycle,
  FaTractor,
  FaBriefcase,
  FaArrowLeft,
  FaClipboardList,
  FaPlane,
  FaMobileAlt,
  FaTruck,
  FaLaptop,
  FaTools,
  FaBicycle,
  FaSignOutAlt,
} from "react-icons/fa";

export const managerNavItems = [
  { name: "Dashboard", icon: FaTachometerAlt, href: "/managers" },
  { name: "Teams", icon: FaUsers, href: "/managers/menu/teams" },
  { name: "Projects", icon: FaProjectDiagram, href: "/managers/menu/projects" },
  { name: "Documents", icon: FaFileAlt, href: "/managers/menu/documents" },
  { name: "Resources", icon: FaFolder, href: "/managers/menu/resources" },
  { name: "Approvals", icon: FaCheckCircle, href: "/managers/menu/approvals" },
  { name: "Settings", icon: FaCog, href: "/managers/menu/settings" },
  { name: "System", icon: FaServer, href: "/managers/menu/system" },
];

export const managerManagementLinks = [
  { name: "Boat", icon: FaShip, href: "/dashboard/managment/boat" },
  { name: "Car", icon: FaCar, href: "/dashboard/managment/car" },
  {
    name: "Real Estate",
    icon: FaHome,
    href: "/dashboard/managment/RealEstate",
  },
  {
    name: "Motorcycles",
    icon: FaMotorcycle,
    href: "/dashboard/managment/Motorcycles",
  },
  { name: "Tractor", icon: FaTractor, href: "/dashboard/managment/tractor" },
  { name: "Jobs", icon: FaBriefcase, href: "/dashboard/managment/jobs" },
  { name: "Trucks", icon: FaTruck, href: "/dashboard/managment/trucks" },
  { name: "Phones", icon: FaMobileAlt, href: "/dashboard/managment/phones" },
  {
    name: "Electronics",
    icon: FaLaptop,
    href: "/dashboard/managment/electronics",
  },
  {
    name: "Bicycles",
    icon: FaBicycle,
    href: "/dashboard/managment/bicycles",
  },
  {
    name: "Equipment",
    icon: FaTools,
    href: "/dashboard/managment/equipment",
  },
];

export const managerAnalyticsLinks = [
  { name: "Overview", icon: FaChartBar, href: "/managers/analytics" },
  { name: "Reports", icon: FaFileAlt, href: "/managers/reports" },
  { name: "Performance", icon: FaCheckCircle, href: "/managers/performance" },
];

export const backToLinks = [
  { name: "Back to Dashboard", icon: FaArrowLeft, href: "/dashboard" },
  {
    name: "Back to Management",
    icon: FaClipboardList,
    href: "/dashboard/managment",
  },
  { name: "Back to Support", icon: FaUsers, href: "/support" },
];

export const managerAccountLinks = [
  { name: "Sign Out", icon: FaSignOutAlt, href: "#", action: "logout" },
];
