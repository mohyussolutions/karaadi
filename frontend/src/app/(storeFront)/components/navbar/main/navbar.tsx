"use client";

import Image from "next/image";
import Link from "next/link";
import NavItems from "./MainLinks";

const Navbar = ({ initialIsAuthenticated }: { initialIsAuthenticated?: boolean }) => {
  return (
    <nav
      className="fixed top-0 left-0 w-full z-[9999] bg-white border-b border-gray-200 pointer-events-auto"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div
        className="flex justify-between items-center max-w-[64.5rem] w-full mx-auto px-3 sm:px-4 md:px-6 h-12"
      >
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={110}
            height={36}
            className="object-contain w-auto h-8"
            priority
          />
        </Link>

        <div className="flex items-center gap-1">
          <NavItems initialIsAuthenticated={initialIsAuthenticated} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
