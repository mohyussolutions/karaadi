"use client";

import Image from "next/image";
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
        <Link href="/" className="flex items-center shrink-0">
          <Image
            src="/logo.jpg"
            alt="Logo"
            width={110}
            height={36}
            className="object-contain w-auto h-8"
            priority
            placeholder="blur"
            blurDataURL="/placeholder.png"
          />
        </Link>

        <div className="flex items-center">
          <NavItems user={user as any} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
