"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import NavItems from "./main/MainLinks";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 w-full z-[9999] bg-white border-b border-gray-200 pointer-events-auto">
      <div
        className="flex justify-between items-center max-w-[64.5rem] w-full mx-auto px-4 md:px-6"
        style={{ height: "48px" }}
      >
        <div className="flex items-center">
          <NavItems user={user as any} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
