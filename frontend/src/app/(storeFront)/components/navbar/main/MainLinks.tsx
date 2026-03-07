"use client";

import { useRouter, usePathname } from "next/navigation";
import { User } from "@/app/utils/types/user";
import { getNavItems } from "@/app/(links)/storeFrontLinks/MainLinks";
import { useEffect, useState, useTransition } from "react";
import { fetchNotifications } from "@/actions/core/notificationsAction";

const NavItems = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [notificationCount, setNotificationCount] = useState(0);

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

    const targetAddr =
      !isUserValid && href !== "/login" && href !== "/" ? "/login" : href;

    startTransition(() => {
      router.push(targetAddr);
    });
  };

  return (
    <div className="flex items-center gap-2 sm:gap-8 px-1 sm:px-4 py-2">
      <ul className="flex w-full sm:w-auto justify-between sm:justify-start items-center sm:space-x-2 space-x-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.label} className="relative">
              <button
                disabled={isPending}
                onClick={() => handleClick(item.href)}
                className={`flex flex-col sm:flex-row items-center justify-center transition-all duration-200 px-2 py-2 md:px-4 text-blue-700 
                  ${isActive ? "font-black" : "font-medium"}`}
              >
                <span className="text-[24px] sm:text-[20px]">{item.icon}</span>
                <span className="hidden sm:inline ml-2 text-sm">
                  {item.label}
                </span>

                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-blue-700 rounded-t-md" />
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
