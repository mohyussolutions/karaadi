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
import { RiAdvertisementFill } from "react-icons/ri";
import { AdminLink } from "@/app/(dashboard)/dashboard/analytics/AdminNavigation";
import { MdOutlineSubscriptions, MdWork } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import {
  MainCategory,
  SettingLink,
  SidebarLink,
} from "@/app/utils/types/categoriestype";

import { MohyusLogoIcon } from "@/app/(storeFront)/icons/customerIcons";
import { LuSofa } from "react-icons/lu";
import { IoIosBoat } from "react-icons/io";
import { IoCreate } from "react-icons/io5";
import {
  boatsSubCategories,
  carsSubCategories,
  jobsSubCategories,
  marketplaceSubCategories,
  motorcyclesSubCategories,
  realEstateSubCategories,
  traktorSubCategories,
} from "./subCategories";
import { FiBarChart2 } from "react-icons/fi";

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
    so: "Hantida Ma-guurtad",
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
    subCategories: carsSubCategories,
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
    subCategories: boatsSubCategories,
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
    subCategories: traktorSubCategories,
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
    subCategories: motorcyclesSubCategories,
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
    subCategories: jobsSubCategories,
    title: undefined,
  },
  {
    key: "Smartsuuq",
    name: "Smartsuuq",
    logo: "/Smartsuq.jpg",
    href: "http://smrtsuuq.com/",
    icon: <MohyusLogoIcon />,
    dashboardIcon: MohyusLogoIcon,
    dashboardLink: "/dashboard/categories/smartsuuq",
    subCategories: [],
    title: undefined,
  },
];

export const adminLinks: AdminLink[] = [
  { title: "Manager Panel", href: "/managers" },
  { title: "Support Panel", href: "/support" },
  { title: "devices", href: "/devices" },
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
  { name: "Traktors", icon: FaTractor, link: "/dashboard/categories/traktors" },
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
  {
    name: "Agencies",
    icon: CiMoneyBill,
    link: "/dashboard/categories/Agencies",
  },

  {
    name: "Most Search",
    icon: FiBarChart2,
    link: "/dashboard/categories/mostSavedSearch",
  },
  { name: "Users", icon: FaUsers, link: "/dashboard/users" },

  { name: "Massages", icon: FaMoneyBillWave, link: "/dashboard/Massages" },
  { name: "Chats", icon: FaComments, link: "/dashboard/chats" },
  { name: "Visitor List", icon: FaUserCheck, link: "/dashboard/VisitorList" },
  { name: "Payments", icon: FaMoneyBillWave, link: "/dashboard/payments" },
  { name: "Settings", icon: FaCog, link: "/dashboard/settings" },

  { name: "Backoffice", icon: IoCreate, link: "/Backoffice" },
];

export const settingLinks: SettingLink[] = [
  {
    title: "Visitor Management",
    items: ["View visitors", "Track activity", "Delete visitor data"],
    actionButton: {
      text: "Open Visitor Manager",
      type: "visitors",
    },
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
      "Sync regional data from external sources",
    ],
    actionButton: {
      text: "Manage Regions",
      href: "/dashboard/settings/region",
    },
  },
  {
    title: "City & District Management",
    items: [
      "Update city names and local IDs",
      "Assign cities to specific regions",
      "Delete or disable local districts",
    ],
    actionButton: {
      text: "Manage Cities",
      href: "/dashboard/settings/cities",
    },
  },
];
