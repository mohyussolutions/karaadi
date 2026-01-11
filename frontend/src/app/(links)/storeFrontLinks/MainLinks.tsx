import { FaRegUser, FaRegUserCircle } from "react-icons/fa";
import { IoAddCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

export const getNavItems = (isUserValid: boolean) => [
  {
    label: "Notifications",
    href: "/notifications",
    icon: <IoNotificationsOutline className="w-6 h-5" />,
  },
  {
    label: "New Ad",
    href: "/new-ad",
    icon: <IoAddCircleOutline className="w-6 h-5" />,
  },
  {
    label: "Messages",
    href: "/messages",
    icon: <FaRegMessage className="w-6 h-5" />,
  },
  isUserValid
    ? {
        label: "Mine",
        href: "/mine",
        icon: <FaRegUserCircle className="w-6 h-5" />,
      }
    : {
        label: "Login",
        href: "/login",
        icon: <FaRegUser className="w-6 h-5" />,
      },
];
