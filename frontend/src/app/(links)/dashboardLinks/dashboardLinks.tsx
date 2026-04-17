import { Icons } from "@/app/utils/icons/dashboardIcons";
import {
  B2BPlanConfig,
  ManagementSection,
  ProtectedRoute,
} from "@/app/utils/types/dashboardTypes";

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

export const ALL_PROTECTED_PATHS = [
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

export const DashboardLinks = {
  managementSections,
  otherSections,
  roles: ALL_PROTECTED_PATHS,
};

export const B2B_PLAN_CONFIG: B2BPlanConfig = {
  basic30: {
    name: "1 bil",
    duration: "1 Bil",
    badge: "Heerka 1-aad",
    features: [
      "Muujinta agabka (Standard)",
      "5 Sawir oo tayo leh",
      "Taageerada Iimaylka",
    ],
  },
  standard60: {
    name: "2 bilood",
    duration: "2 Bilood",
    badge: "Heerka 2-aad",
    features: [
      "Muddada bandhigga oo dheer",
      "10 Sawir oo tayo leh",
      "Taageero mudnaan leh",
    ],
  },
  premium90: {
    name: "3 bilood",
    duration: "3 Bilood",
    badge: "Heerka 3-aad",
    features: [
      "Safka hore ee raadinta",
      "Sawirro aan xadidnayn",
      "Maamule xisaabeed gaar ah",
    ],
  },
  standard180: {
    name: "6 bilood",
    duration: "6 Bilood",
    badge: "Heerka 4-aad",
    features: [
      "Warbixinnada iibka",
      "Sumadda xaqiijinta (Verified)",
      "Falanqaynta suuqa",
    ],
  },
  annual365: {
    name: "sanad",
    duration: "1 Sano",
    badge: "Heerka 5-aad",
    features: [
      "Isku xirka nidaamka (API)",
      "Kharashka ugu hooseeya",
      "Xayeysiisyo aan xadidnayn",
    ],
  },
} as const;

import { AiOutlineCar, AiOutlineHome } from "react-icons/ai";
import {
  FaCaravan,
  FaHome,
  FaShip,
  FaTractor,
  FaMotorcycle,
  FaCar,
  FaStore,
  FaWarehouse,
  FaMoneyBillWave,
  FaUsers,
  FaComments,
  FaCog,
  FaUserCheck,
} from "react-icons/fa";
import {
  RiAdvertisementFill,
  MdOutlineSubscriptions,
  MdWork,
  CiMoneyBill,
  LuSofa,
  IoIosBoat,
  FiBarChart2,
  HiSearchCircle,
} from "@/app/utils/icons";

import { MohyusLogoIcon } from "@/app/utils/icons/customerIcons";

import {
  marketplaceSubCategories,
  realEstateSubCategories,
  vehicleSubCategories,
  motorcycleSubCategories,
  boatSubCategories,
  farmEquipmentSubCategories,
  jobSubCategories,
} from "@/app/(links)/storeFrontLinks/subCategories";
import {
  MainCategory,
  SettingLink,
  SidebarLink,
} from "@/app/utils/types/categoriestype";

export const allCategories: MainCategory[] = [
  {
    key: "Marketplace",
    name: "Marketplace",
    href: "/Marketplace",
    icon: <LuSofa />,
    so: "Suuq",
    dashboardIcon: FaStore,
    dashboardLink: "/dashboard/categories/marketplace",
    subCategories: marketplaceSubCategories,
    title: undefined,
  },
  {
    key: "RealEstate",
    name: "Real Estate",
    href: "/real-estate",
    icon: <AiOutlineHome />,
    so: "Guryaha, hantida maguurtada ah",
    dashboardIcon: FaWarehouse,
    dashboardLink: "/dashboard/categories/real-estate",
    subCategories: realEstateSubCategories,
    title: undefined,
  },
  {
    key: "Cars",
    name: "Cars",
    href: "/cars",
    icon: <AiOutlineCar />,
    so: "Gawaarida",
    dashboardIcon: FaCar,
    dashboardLink: "/dashboard/categories/cars",
    subCategories: vehicleSubCategories,
    title: undefined,
  },
  {
    key: "Boats",
    name: "Boats",
    href: "/boats",
    icon: <IoIosBoat />,
    so: "Doomo",
    dashboardIcon: FaShip,
    dashboardLink: "/dashboard/categories/boats",
    subCategories: boatSubCategories,
    title: undefined,
  },
  {
    key: "farmequipment",
    name: "Farmequipment",
    href: "/farmequipment",
    icon: <FaTractor />,
    so: "Qalabka Beeraha",
    dashboardIcon: FaTractor,
    dashboardLink: "/dashboard/categories/farmequipment",
    subCategories: farmEquipmentSubCategories,
    title: undefined,
  },
  {
    key: "Motorcycles",
    name: "Motorcycles",
    href: "/motorcycles",
    icon: <FaCaravan />,
    so: "Mootooyin",
    dashboardIcon: FaMotorcycle,
    dashboardLink: "/dashboard/categories/motorcycles",
    subCategories: motorcycleSubCategories,
    title: undefined,
  },
  {
    key: "Jobs",
    name: "Jobs",
    href: "/jobs",
    icon: <MdWork />,
    so: "Shaqo",
    dashboardIcon: MdWork,
    dashboardLink: "/dashboard/categories/jobs",
    subCategories: jobSubCategories,
    title: undefined,
  },
  {
    key: "Smartsuuq",
    logo: "/Smartsuq.jpg",
    href: "https://www.smartsuuq.com/",
    icon: <MohyusLogoIcon />,
    dashboardIcon: MohyusLogoIcon,
    dashboardLink: "/dashboard/categories/smartsuuq",
    subCategories: [],
    title: undefined,
  },
];

export const sidebarLinks: SidebarLink[] = [
  { name: "Home", icon: FaHome, link: "/dashboard" },
  {
    name: "Marketplace",
    icon: FaStore,
    link: "/dashboard/categories/marketplace",
  },
  { name: "Cars", icon: FaCar, link: "/dashboard/categories/cars" },
  { name: "Boats", icon: FaShip, link: "/dashboard/categories/boats" },
  {
    name: "Motorcycles",
    icon: FaMotorcycle,
    link: "/dashboard/categories/motorcycles",
  },
  {
    name: "Real Estate",
    icon: FaWarehouse,
    link: "/dashboard/categories/real-estate",
  },
  {
    name: "Farmequipment",
    icon: FaTractor,
    link: "/dashboard/categories/farmequipment",
  },
  {
    name: "Advertisement",
    icon: RiAdvertisementFill,
    link: "/dashboard/categories/Advertisement",
  },
  {
    name: "subscription",
    icon: MdOutlineSubscriptions,
    link: "/dashboard/categories/subscription",
  },
  {
    name: "FeeManagement",
    icon: CiMoneyBill,
    link: "/dashboard/FeeManagement",
  },
  { name: "Jobs", icon: MdWork, link: "/dashboard/categories/jobs" },
  {
    name: "Agencies",
    icon: CiMoneyBill,
    link: "/dashboard/categories/Agencies",
  },
  { name: "Reports", icon: FiBarChart2, link: "/dashboard/categories/Reports" },
  {
    name: "Most Search",
    icon: HiSearchCircle,
    link: "/dashboard/categories/mostSavedSearch",
  },
  { name: "Users", icon: FaUsers, link: "/dashboard/users" },
  { name: "Massages", icon: FaMoneyBillWave, link: "/dashboard/Massages" },
  { name: "Chats", icon: FaComments, link: "/dashboard/chats" },
  { name: "Visitor List", icon: FaUserCheck, link: "/dashboard/VisitorList" },
  { name: "Payments", icon: FaMoneyBillWave, link: "/dashboard/payments" },
  { name: "Settings", icon: FaCog, link: "/dashboard/settings" },
];

export const settingLinks: SettingLink[] = [
  {
    title: "Visitor Management",
    items: ["View visitors", "Track activity", "Delete visitor data"],
    actionButton: { text: "Open Visitor Manager", type: "visitors" },
  },
  {
    title: "User Roles",
    items: ["Admin Accounts", "Manager Accounts", "Support Accounts"],
    actionButton: {
      text: "Go to User Roles",
      href: "/dashboard/settings/user-roles",
    },
  },
  {
    title: "Payments",
    items: ["Payment Status", "Fees", "Invoice History"],
    actionButton: {
      text: "Open Payment Settings",
      href: "/dashboard/payments",
    },
  },
  {
    title: "Security",
    items: ["Password Reset", "Two-Factor Authentication"],
    actionButton: {
      text: "Security Settings",
      href: "/dashboard/settings/security",
    },
  },
  {
    title: "Regional Management",
    items: [
      "View and manage all regions",
      "Add or delete major regions",
      "Sync regional data",
    ],
    actionButton: {
      text: "Manage Regions",
      href: "/dashboard/settings/region",
    },
  },
  {
    title: "City & District Management",
    items: [
      "Update city names",
      "Assign cities to regions",
      "Delete districts",
    ],
    actionButton: { text: "Manage Cities", href: "/dashboard/settings/cities" },
  },
];
