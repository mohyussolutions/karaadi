import { Icons } from "@/app/utils/icons/commonIcons";
import { ManagementSection, ProtectedRoute } from "@/app/utils/types/icommon";

const BASE_MGMT = "/management";

export const DASHBOARD_ROLES: ProtectedRoute[] = [
  { path: "/dashboard", roles: ["admin"] },
];
export const SUPPORT_ROLES: ProtectedRoute[] = [
  { path: "/support", roles: ["support"] },
];
export const MANAGER_ROLES: ProtectedRoute[] = [
  { path: "/managers", roles: ["manager"] },
];
export const BACKOFFICE_ROLES: ProtectedRoute[] = [
  { path: "/backoffice", roles: ["backoffice"] },
];
export const DEVICE_ROLES: ProtectedRoute[] = [
  { path: "/devices", roles: ["devices"] },
];

export const ALL_PROTECTED_PATHS: ProtectedRoute[] = [
  ...DASHBOARD_ROLES,
  ...SUPPORT_ROLES,
  ...MANAGER_ROLES,
  ...BACKOFFICE_ROLES,
  ...DEVICE_ROLES,
];

export const managementSections: ManagementSection[] = [
  {
    id: "marketplace",
    name: "Marketplace",
    path: `${BASE_MGMT}/marketplace`,
    icon: Icons.FaStore,
    description: "Manage listings",
    category: "listings",
    featured: true,
  },
  {
    id: "realestate",
    name: "Real Estate",
    path: `${BASE_MGMT}/real-estate`,
    icon: Icons.FaHome,
    description: "Manage properties",
    category: "listings",
    featured: true,
  },
  {
    id: "cars",
    name: "Cars",
    path: `${BASE_MGMT}/cars`,
    icon: Icons.FaCar,
    description: "Manage car listings",
    category: "listings",
    featured: true,
  },
  {
    id: "boats",
    name: "Boats",
    path: `${BASE_MGMT}/boats`,
    icon: Icons.FaShip,
    description: "Manage boat listings",
    category: "listings",
    featured: true,
  },
  {
    id: "tractors",
    name: "Tractors",
    path: `${BASE_MGMT}/tractors`,
    icon: Icons.FaTractor,
    description: "Manage tractors",
    category: "listings",
  },
  {
    id: "motorcycles",
    name: "Motorcycles",
    path: `${BASE_MGMT}/motorcycles`,
    icon: Icons.FaMotorcycle,
    description: "Manage motorcycles",
    category: "listings",
  },
  {
    id: "jobs",
    name: "Jobs",
    path: `${BASE_MGMT}/jobs`,
    icon: Icons.FaBriefcase,
    description: "Manage job listings",
    category: "listings",
  },
];

export const otherSections: ManagementSection[] = [
  {
    id: "listings",
    name: "All Listings",
    path: `${BASE_MGMT}/listings`,
    icon: Icons.FaList,
    description: "View all marketplace listings",
    category: "content",
    featured: true,
  },
  {
    id: "users",
    name: "User Management",
    path: `${BASE_MGMT}/users`,
    icon: Icons.FaUsers,
    description: "Manage accounts",
    category: "operations",
    featured: true,
  },
  {
    id: "analytics",
    name: "Analytics",
    path: `${BASE_MGMT}/analytics`,
    icon: Icons.FaChartBar,
    description: "View reports",
    category: "analytics",
    featured: true,
  },
  {
    id: "mkt-settings",
    name: "Marketplace Settings",
    path: `${BASE_MGMT}/marketplace-settings`,
    icon: Icons.FaStore,
    description: "Marketplace config",
    category: "settings",
  },
  {
    id: "settings",
    name: "System Settings",
    path: `${BASE_MGMT}/settings`,
    icon: Icons.FaCog,
    description: "Global config",
    category: "settings",
    featured: true,
  },
];
