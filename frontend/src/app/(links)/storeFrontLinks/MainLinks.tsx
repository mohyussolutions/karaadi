import { FaRegUser, FaRegUserCircle } from "react-icons/fa";
import { IoAddCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

export const getNavItems = (isUserValid: boolean, notificationCount = 0) => [
  {
    label: "Notifications",
    labelKey: "nav.notifications",
    href: "/notifications",
    icon: (
      <div className="relative">
        <IoNotificationsOutline className="w-6 h-5" />
        {notificationCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
            {notificationCount}
          </span>
        )}
      </div>
    ),
  },
  {
    label: "New Ad",
    labelKey: "nav.newAd",
    href: "/new-ad",
    icon: <IoAddCircleOutline className="w-6 h-5" />,
  },
  {
    label: "Messages",
    labelKey: "nav.messages",
    href: "/messages",
    icon: <FaRegMessage className="w-6 h-5" />,
  },
  isUserValid
    ? {
        label: "Mine",
        labelKey: "nav.mine",
        href: "/mine",
        icon: <FaRegUserCircle className="w-6 h-5" />,
      }
    : {
        label: "Login",
        labelKey: "nav.login",
        href: "/login",
        icon: <FaRegUser className="w-6 h-5" />,
      },
];
