"use client";

import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/slices/hooks/hooks";
import { markAllRead } from "@/store/slices/reducers/notificationsSlice";
import { markAllNotificationsAsRead } from "@/actions/core/notificationsAction";
import { useAuth } from "@/context/AuthContext";

interface DropdownProps {
  onClose: () => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const items = useAppSelector((state) => state.notifications.items);
  const { user } = useAuth();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose]);

  const handleItemClick = (link: string) => {
    onClose();
    if (link) router.push(link);
  };

  const handleMarkAll = async () => {
    dispatch(markAllRead());
    const userId = user?.id || user?._id;
    if (userId) {
      try {
        await markAllNotificationsAsRead(userId);
      } catch {}
    }
  };

  const sorted = [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl border border-gray-200 shadow-xl z-50 overflow-hidden"
    >
      <div className="px-4 py-3 border-b border-gray-100">
        <h3 className="font-black text-sm text-gray-900">Notifications</h3>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {sorted.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-gray-400 font-semibold">
            No notifications
          </div>
        ) : (
          sorted.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.link)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors flex items-start gap-3 ${
                !item.read ? "border-l-4 border-l-blue-500 bg-blue-50/40" : ""
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800 line-clamp-2">
                  {item.message}
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(item.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              {!item.read && (
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1" />
              )}
            </button>
          ))
        )}
      </div>

      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <button
          onClick={handleMarkAll}
          className="flex-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
        >
          Mark all as read
        </button>
        <button
          onClick={() => { onClose(); router.push("/notifications"); }}
          className="flex-1 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors"
        >
          See all
        </button>
      </div>
    </div>
  );
};

export default Dropdown;
