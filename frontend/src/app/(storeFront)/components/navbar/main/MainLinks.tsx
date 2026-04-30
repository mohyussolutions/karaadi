"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getNavItems } from "@/app/(links)/storeFrontLinks/MainLinks";
import Lang from "@/i18n/Lang";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";
import { useMessageCount } from "@/app/(storeFront)/components/hooks/useMessageCount";
import { useNavNotificationCount } from "@/app/(storeFront)/components/hooks/useNavNotificationCount";
import { useAuth } from "@/context/AuthContext";
import {
  ROUTE_NEW_AD,
  ROUTE_MESSAGES,
  BADGE_MAX_COUNT,
  BADGE_MAX_LABEL,
  NAV_LINK_BASE,
  NAV_LINK_ACTIVE,
  NAV_BADGE_CLASS,
} from "./constants";
import useNotificationSocket from "../../hooks/useNotificationSocket";

const NavItems = ({
  initialIsAuthenticated,
}: {
  initialIsAuthenticated?: boolean;
}) => {
  const { user, loading: authLoading } = useAuth();
  const pathname = usePathname();
  const { t } = useTranslation();
  useLanguage();
  useNotificationSocket();

  const userId = user?.id || user?._id || user?.sub;
  const isUserValid = Boolean(userId);

  const { notificationCount } = useNavNotificationCount(userId);
  const { messageCount } = useMessageCount(userId);

  const navItems = getNavItems(
    authLoading ? (initialIsAuthenticated ?? false) : isUserValid,
    notificationCount,
  );
  const isNewAd = (href: string) => href === ROUTE_NEW_AD;

  return (
    <div className="flex items-center gap-1">
      <Lang />
      <ul className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const label = t(item.labelKey);
          const isMessages = item.href === ROUTE_MESSAGES;

          if (isNewAd(item.href)) {
            return (
              <li key={item.href} className="flex items-center px-1 sm:px-2">
                <Link
                  href={item.href}
                  className={`flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-full ${NAV_LINK_BASE} text-sm font-medium transition-colors duration-150 whitespace-nowrap`}
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-[20px] leading-none">{item.icon}</span>
                  <span className="hidden sm:inline" suppressHydrationWarning>
                    {label}
                  </span>
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-full transition-colors duration-150 outline-none whitespace-nowrap ${isActive ? NAV_LINK_ACTIVE : NAV_LINK_BASE}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-[20px] sm:text-[22px] flex items-center leading-none shrink-0 relative">
                  {item.icon}
                  {isMessages && messageCount > 0 && (
                    <span className={NAV_BADGE_CLASS}>
                      {messageCount > BADGE_MAX_COUNT
                        ? BADGE_MAX_LABEL
                        : messageCount}
                    </span>
                  )}
                </span>
                <span
                  className="hidden sm:inline text-sm font-medium"
                  suppressHydrationWarning
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavItems;
