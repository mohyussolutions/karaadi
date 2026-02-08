import {
  FiMenu,
  FiBell,
  FiSearch,
  FiLogOut,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/actions/core/authAction";

function useLogout() {
  return async () => {
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
}

interface SupportNavbarProps {
  user: any;
  toggleSidebar: () => void;
}

export default function SupportNavbar({
  user,
  toggleSidebar,
}: SupportNavbarProps) {
  const logoutHandler = useLogout();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-md border-b border-gray-200 px-5 py-4 flex items-center justify-between relative">
      <button
        onClick={toggleSidebar}
        className="md:hidden bg-gray-100 p-2 rounded-lg"
      >
        <FiMenu size={22} />
      </button>

      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl gap-2 shadow-inner flex-1 max-w-lg">
        <FiSearch className="text-gray-500" size={18} />
        <input
          placeholder="Search…"
          className="bg-transparent outline-none text-sm flex-1"
        />
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="relative">
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
          >
            <FiBell size={20} />
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
              <div className="px-4 py-3 border-b font-semibold">
                Notifications
              </div>
              <div className="p-4 text-gray-600 text-sm">
                No new notifications
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-semibold hover:scale-105 transition"
          >
            U
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl border border-gray-200 z-50">
              <button
                onClick={() => router.push("/support/profile")}
                className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100"
              >
                <FiUser /> Profile
              </button>

              <button
                onClick={() => router.push("/support/settings")}
                className="w-full px-4 py-3 text-sm flex items-center gap-2 hover:bg-gray-100"
              >
                <FiSettings /> Settings
              </button>

              <button
                onClick={logoutHandler}
                className="w-full px-4 py-3 text-sm flex items-center gap-2 text-red-600 hover:bg-gray-100"
              >
                <FiLogOut /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
