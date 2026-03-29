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
import { MdOutlineSubscriptions, MdWork } from "react-icons/md";
import { CiMoneyBill } from "react-icons/ci";
import { LuSofa } from "react-icons/lu";
import { IoIosBoat } from "react-icons/io";
import { FiBarChart2 } from "react-icons/fi";
import { HiSearchCircle } from "react-icons/hi";

import {
  MainCategory,
  SettingLink,
  SidebarLink,
} from "@/app/utils/types/categoriestype";

import { MohyusLogoIcon } from "@/app/utils/icons/customerIcons";
import {
  boatsSubCategories,
  jobsSubCategories,
  marketplaceSubCategories,
  motorcyclesSubCategories,
  realEstateSubCategories,
  traktorSubCategories,
} from "./subCategories";
import { carsSubCategories } from "./nestedSubcategoryForCars";

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
