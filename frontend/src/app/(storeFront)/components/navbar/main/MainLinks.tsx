"use client";

import { useRouter } from "next/navigation";
import { User } from "@/app/utils/types/user";
import { getNavItems } from "@/app/(links)/storeFrontLinks/MainLinks";
import { useEffect, useState } from "react";
import { fetchNotifications } from "@/actions/core/notificationsAction";

const NavItems = ({ user }: { user: User | null }) => {
  const router = useRouter();
  const isUserValid = Boolean(user?._id);
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    if (isUserValid && user?._id) {
      fetchNotifications(user._id).then((data) => {
        const unread = Array.isArray(data)
          ? data.filter((n: any) => !n.isRead).length
          : 0;
        setNotificationCount(unread);
      });
    } else {
      setNotificationCount(0);
    }
  }, [isUserValid, user]);

  const navItems = getNavItems(isUserValid, notificationCount);

  const handleClick = (href: string) => {
    if (!isUserValid && href !== "/login") {
      router.push("/login");
    } else {
      router.push(href);
    }
  };

  return (
    <div className="flex items-center gap-8 px-4 py-2">
      <ul className="flex w-full sm:w-auto justify-between sm:justify-start sm:space-x-2 space-x-12 ml-1 sm:ml-0">
        {navItems.map((item) => (
          <li key={item.label}>
            <button
              onClick={() => handleClick(item.href)}
              className="flex items-center justify-center md:text-md sm:gap-2 text-blue-800 transition-colors duration-200 text-[18px] sm:text-sm px-3 py-2 md:px-4 md:py-2"
            >
              {item.icon}
              <span className="hidden sm:inline ml-2">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavItems;
