"use client";

import React, { FC } from "react";
import Link from "next/link";
import { adminLinks } from "./categories";

interface AdminNavigationBlockProps {
  user: any;
}

const AdminNavigationBlock: FC<AdminNavigationBlockProps> = ({ user }) => {
  if (!user?.isAdmin) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {adminLinks.map((link, i) => (
        <Link
          prefetch={false}
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

export default AdminNavigationBlock;
