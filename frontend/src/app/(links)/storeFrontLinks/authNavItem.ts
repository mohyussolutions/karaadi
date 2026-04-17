import { FaRegUser, FaRegUserCircle } from "react-icons/fa";

export const AUTH_NAV_ITEM = {
  authenticated: {
    labelKey: "nav.mine",
    href: "/mine",
    icon: FaRegUserCircle,
    iconSize: 22,
  },
  unauthenticated: {
    labelKey: "nav.login",
    href: "/login",
    icon: FaRegUser,
    iconSize: 20,
  },
} as const;

export const getAuthNavItem = (isUserValid: boolean) => {
  return isUserValid
    ? AUTH_NAV_ITEM.authenticated
    : AUTH_NAV_ITEM.unauthenticated;
};
