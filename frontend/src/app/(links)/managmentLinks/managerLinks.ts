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
  FaMobileAlt,
  FaTruck,
  FaLaptop,
  FaTools,
  FaBicycle,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoCreate } from "react-icons/io5";

export const managerTotalLinks = [

  { name: "Dashboard", icon: FaTachometerAlt, href: "/managers", category: "core" },
  { name: "Teams", icon: FaUsers, href: "/managers/teams", category: "core" },
  { name: "Projects", icon: FaProjectDiagram, href: "/managers/projects", category: "core" },
  { name: "Documents", icon: FaFileAlt, href: "/managers/documents", category: "core" },
  { name: "Resources", icon: FaFolder, href: "/managers/resources", category: "core" },
  { name: "Approvals", icon: FaCheckCircle, href: "/managers/approvals", category: "core" },


  { name: "Boat", icon: FaShip, href: "/managers/boat", category: "inventory" },
  { name: "Car", icon: FaCar, href: "/managers/car", category: "inventory" },
  { name: "Real Estate", icon: FaHome, href: "/managers/real-estate", category: "inventory" },
  { name: "Motorcycles", icon: FaMotorcycle, href: "/managers/motorcycles", category: "inventory" },
  { name: "Tractor", icon: FaTractor, href: "/managers/tractor", category: "inventory" },
  { name: "Jobs", icon: FaBriefcase, href: "/managers/jobs", category: "inventory" },
  { name: "Trucks", icon: FaTruck, href: "/managers/trucks", category: "inventory" },
  { name: "Phones", icon: FaMobileAlt, href: "/managers/phones", category: "inventory" },
  { name: "Electronics", icon: FaLaptop, href: "/managers/electronics", category: "inventory" },
  { name: "Bicycles", icon: FaBicycle, href: "/managers/bicycles", category: "inventory" },
  { name: "Equipment", icon: FaTools, href: "/managers/equipment", category: "inventory" },


  { name: "Backoffice", icon: IoCreate, href: "/Backoffice", category: "backoffice" },


  { name: "Overview", icon: FaChartBar, href: "/managers/analytics", category: "analytics" },
  { name: "Reports", icon: FaFileAlt, href: "/managers/reports", category: "analytics" },
  { name: "Performance", icon: FaCheckCircle, href: "/managers/performance", category: "analytics" },


  { name: "Settings", icon: FaCog, href: "/managers/settings", category: "system" },
  { name: "System", icon: FaServer, href: "/managers/system", category: "system" },
  { name: "Sign Out", icon: FaSignOutAlt, href: "#", action: "logout", category: "system" },
];