import { Icons } from "@/app/utils/icons/deviceIcons";
import { DeviceNavLink } from "@/app/utils/types/deviceTypes";

export const navItems: DeviceNavLink[] = [
  { name: "Devices", icon: Icons.FaLaptop, href: "/devices" },
  { name: "Analytics", icon: Icons.FaChartLine, href: "/devices/analytics" },
];

export const devicesLinks: DeviceNavLink[] = [
  { name: "Computers", icon: Icons.FaLaptop, href: "/devices/computers" },
  { name: "Mobile Devices", icon: Icons.FaMobileAlt, href: "/devices/mobile" },
  { name: "Tablets", icon: Icons.FaTabletAlt, href: "/devices/tablets" },
  {
    name: "Workstations",
    icon: Icons.FaDesktop,
    href: "/devices/workstations",
  },
  { name: "Servers", icon: Icons.FaServer, href: "/devices/servers" },
  {
    name: "Network Devices",
    icon: Icons.FaNetworkWired,
    href: "/devices/network",
  },
  { name: "Printers", icon: Icons.FaPrint, href: "/devices/printers" },
  { name: "Cameras", icon: Icons.FaCamera, href: "/devices/cameras" },
];

export const backToDashboard: DeviceNavLink[] = [
  { name: "Back to Dashboard", icon: Icons.FaArrowLeft, href: "/dashboard" },
  { name: "Back to managerboard", icon: Icons.FaArrowLeft, href: "/managers" },
  { name: "Back to support", icon: Icons.FaArrowLeft, href: "/support" },
];

export const DeviceLinks = {
  navItems,
  devicesLinks,
  backToDashboard,
};
