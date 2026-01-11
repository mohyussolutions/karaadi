"use client";
import Link from "next/link";

export interface AdminLink {
  title: string;
  href: string;
}

export interface AdminNavigationProps {
  user: any;
  links: AdminLink[];
}

export const AdminNavigation: React.FC<AdminNavigationProps> = ({
  user,
  links,
}) => {
  if (!user?.isAdmin) return null;
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {links.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold p-4 rounded-xl shadow text-center transition"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
};
