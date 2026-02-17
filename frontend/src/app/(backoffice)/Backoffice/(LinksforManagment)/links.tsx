import {
  FaCar,
  FaHome,
  FaShip,
  FaStore,
  FaMotorcycle,
  FaTruck,
} from "react-icons/fa";

const linksForBackoffice = [
  { id: "Backoffice", name: "Backoffice", href: "/Backoffice", icon: FaHome },
  { id: "boats", name: "Boats", href: "/Backoffice/boats", icon: FaShip },
  { id: "cars", name: "Cars", href: "/Backoffice/cars", icon: FaCar },
  {
    id: "motorcycles",
    name: "Motorcycles",
    href: "/Backoffice/motorcycles",
    icon: FaMotorcycle,
  },
  {
    id: "tractors",
    name: "Tractors",
    href: "/Backoffice/tractors",
    icon: FaTruck,
  },
  {
    id: "real-estate",
    name: "Real Estate",
    href: "/Backoffice/real-estate",
    icon: FaHome,
  },
  {
    id: "marketplace",
    name: "Marketplace",
    href: "/Backoffice/marketplace",
    icon: FaStore,
  },
];

export default linksForBackoffice;

export const Tabs = [
  { id: "register", label: "Register", href: "/Backoffice/users/register" },
  { id: "confirm", label: "Confirm Email", href: "/Backoffice/users/confirm" },
  { id: "login", label: "Login", href: "/Backoffice/users/login" },
  {
    id: "forgot",
    label: "Forgot Password",
    href: "/Backoffice/users/forgot-password",
  },
];

export const dashboardRoles = [
  { id: "dashboard", name: "Dashboard", href: "/dashboard" },
  { id: "managers", name: "Manager", href: "/managers" },
  { id: "support", name: "Support", href: "/support" },
  { id: "devices", name: "Devices", href: "/devices" },
];
