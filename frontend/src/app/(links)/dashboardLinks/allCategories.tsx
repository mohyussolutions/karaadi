import {
  FaCar,
  FaCog,
  FaComments,
  FaHome,
  FaMoneyBillWave,
  FaMotorcycle,
  FaTractor,
  FaUserCheck,
  FaUsers,
  FaWarehouse,
  FaStore,
  FaShip,
  FaLaptop,
} from "react-icons/fa";
import { IoBusinessOutline } from "react-icons/io5";
import {
  HiSearchCircle,
  CiMoneyBill,
  MdOutlineSubscriptions,
  MdWork,
  FiBarChart2,
  RiAdvertisementFill,
} from "@/app/utils/icons";
import { SidebarLink } from "@/app/utils/types/categoriestype";

export const allCategoriesDashbaord: SidebarLink[] = [
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
    name: "Subscription",
    icon: MdOutlineSubscriptions,
    link: "/dashboard/categories/subscription",
  },
  {
    name: "Fee Management",
    icon: CiMoneyBill,
    link: "/dashboard/FeeManagement",
  },
  { name: "Jobs", icon: MdWork, link: "/dashboard/categories/jobs" },
  {
    name: "Businesses",
    icon: IoBusinessOutline,
    link: "/dashboard/categories/businesses",
  },
  { name: "Reports", icon: FiBarChart2, link: "/dashboard/categories/Reports" },
  {
    name: "Most Search",
    icon: HiSearchCircle,
    link: "/dashboard/categories/mostSavedSearch",
  },
  { name: "Users", icon: FaUsers, link: "/dashboard/users" },
  { name: "Messages", icon: FaMoneyBillWave, link: "/dashboard/Massages" },
  { name: "Chats", icon: FaComments, link: "/dashboard/chats" },
  { name: "Visitor List", icon: FaUserCheck, link: "/dashboard/VisitorList" },
  { name: "Payments", icon: FaMoneyBillWave, link: "/dashboard/payments" },
  { name: "Settings", icon: FaCog, link: "/dashboard/settings" },
  { name: "Devices", icon: FaLaptop, link: "/devices" },
];
