import { navItems } from "../config/links";
import Link from "next/link";
import { FaTimes, FaSignOutAlt } from "react-icons/fa";

interface SidebarProps {
  open: boolean;
  setOpen: (v: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const baseClasses =
    "fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0";

  const mobileTransform = open ? "translate-x-0" : "-translate-x-full";

  return (
    <>
      <aside className={`${baseClasses} ${mobileTransform}`}>
        <div className="p-6 flex justify-between items-center border-b border-gray-700">
          <Link
            href="/devices"
            className="text-xl font-extrabold text-indigo-400 uppercase tracking-wider"
          >
            Device Panel
          </Link>
          <button
            className="md:hidden text-gray-400 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <FaTimes size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-grow">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center space-x-3 p-3 rounded-lg text-gray-300 hover:bg-indigo-600 hover:text-white transition duration-150"
              onClick={() => setOpen(false)}
            >
              <item.icon size={18} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center space-x-3 p-3 w-full rounded-lg text-red-400 hover:bg-gray-700 transition duration-150">
            <FaSignOutAlt size={18} />
            <span className="font-medium">Logout</span>
          </button>
          <div className="mt-4 text-xs text-gray-500">
            <p>Device Management &copy; 2025</p>
            <p>v1.0.0</p>
          </div>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
