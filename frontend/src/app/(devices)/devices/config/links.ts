import type { DeviceNavLink } from "./types";
import {
  FaLaptop,
  FaChartLine,
  FaMobileAlt,
  FaTabletAlt,
  FaDesktop,
  FaServer,
  FaNetworkWired,
  FaPrint,
  FaCamera,
  FaArrowLeft,
} from "./icons";

export const navItems: DeviceNavLink[] = [
  { name: "Devices", icon: FaLaptop, href: "/devices" },
  { name: "Analytics", icon: FaChartLine, href: "/devices/analytics" },
];

export const devicesLinks: DeviceNavLink[] = [
  { name: "Computers", icon: FaLaptop, href: "/devices/computers" },
  { name: "Mobile Devices", icon: FaMobileAlt, href: "/devices/mobile" },
  { name: "Tablets", icon: FaTabletAlt, href: "/devices/tablets" },
  { name: "Workstations", icon: FaDesktop, href: "/devices/workstations" },
  { name: "Servers", icon: FaServer, href: "/devices/servers" },
  { name: "Network Devices", icon: FaNetworkWired, href: "/devices/network" },
  { name: "Printers", icon: FaPrint, href: "/devices/printers" },
  { name: "Cameras", icon: FaCamera, href: "/devices/cameras" },
];

export const backToDashboard: DeviceNavLink[] = [
  { name: "Back to Dashboard", icon: FaArrowLeft, href: "/dashboard" },
  { name: "Back to managerboard", icon: FaArrowLeft, href: "/managers" },
  { name: "Back to support", icon: FaArrowLeft, href: "/support" },
];
