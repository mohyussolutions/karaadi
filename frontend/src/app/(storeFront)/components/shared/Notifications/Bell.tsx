"use client";

import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { useAppSelector } from "@/store/slices/hooks/hooks";
import Dropdown from "./Dropdown";

const Bell: React.FC = () => {
  const [open, setOpen] = useState(false);
  const unreadCount = useAppSelector(
    (state) => state.notifications.unreadCount,
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Notifications"
        className="relative flex items-center justify-center p-1.5 rounded-full text-gray-700 hover:text-blue-600 hover:bg-gray-100 transition-colors"
      >
        <IoNotificationsOutline size={22} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && <Dropdown onClose={() => setOpen(false)} />}
    </div>
  );
};

export default Bell;
