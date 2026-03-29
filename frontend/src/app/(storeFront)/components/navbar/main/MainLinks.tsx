"use client";

import { useRouter, usePathname } from "next/navigation";
import { User } from "@/app/utils/types/user";
import { getNavItems } from "@/app/(links)/storeFrontLinks/MainLinks";
import { useEffect, useState, useTransition } from "react";
import { fetchNotifications } from "@/actions/core/notificationsAction";
import Lang from "@/i18n/Lang";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage";

const NavItems = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [notificationCount, setNotificationCount] = useState(0);
  const { t } = useTranslation();
  const { activeLanguage } = useLanguage();

  const isUserValid = Boolean(user?._id);

  useEffect(() => {
    if (isUserValid && user?._id) {
      fetchNotifications(user._id).then((data) => {
        const unread = Array.isArray(data)
          ? data.filter((n: any) => !n.isRead).length
          : 0;
        setNotificationCount(unread);
      });
    }
  }, [user?._id, isUserValid]);

  const navItems = getNavItems(isUserValid, notificationCount);

  const handleClick = (href: string) => {
    if (pathname === href) return;
    const target =
      !isUserValid && href !== "/login" && href !== "/" ? "/login" : href;
    startTransition(() => router.push(target));
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Lang />
      <ul className="flex items-center gap-x-0.5 sm:gap-x-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li
              key={item.href}
              className="relative h-12 sm:h-14 flex items-center"
            >
              <button
                disabled={isPending}
                onClick={() => handleClick(item.href)}
                className={`flex items-center justify-center transition-colors duration-200 px-2 sm:px-3 h-full gap-1 sm:gap-2
                  ${isActive ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600 font-semibold"}`}
              >
                <span className="text-xl sm:text-[22px] flex items-center">
                  {item.icon}
                </span>
                <span className="hidden md:inline text-xs sm:text-[13px] lowercase">
                  {item.labelKey ? t(item.labelKey) : item.label}
                </span>

                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] sm:h-[3px] bg-blue-600 rounded-t-md" />
                )}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default NavItems;
