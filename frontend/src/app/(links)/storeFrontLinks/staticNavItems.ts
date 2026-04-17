import { IoAddCircleOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

export const STATIC_NAV_ITEMS = [
  {
    labelKey: "nav.notifications",
    href: "/notifications",
    icon: IoNotificationsOutline,
    iconSize: 22,
    hasBadge: true,
  },
  {
    labelKey: "nav.newAd",
    href: "/new-ad",
    icon: IoAddCircleOutline,
    iconSize: 22,
    hasBadge: false,
  },
  {
    labelKey: "nav.messages",
    href: "/messages",
    icon: FaRegMessage,
    iconSize: 20,
    hasBadge: false,
  },
] as const;
