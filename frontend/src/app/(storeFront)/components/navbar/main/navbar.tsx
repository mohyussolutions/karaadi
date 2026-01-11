"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavItems from "./MainLinks";
import { User } from "@/app/utils/types/user";
import { apiService } from "@/actions/core/authAction";

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const userData = await apiService.verifySession();
        setUser(userData);
      } catch {
        setUser(null);
      }
    };
    checkSession();
  }, []);

  return (
    <nav className="border-b bg-white sticky top-0 z-50 border-grey-400">
      <div className="flex justify-between items-center max-w-5xl mx-auto px-3 h-14">
        <Link prefetch={false} href="/" className="flex items-center">
          <div className="flex items-center justify-center w-auto h-14 overflow-hidden">
            <Image
              src="/logo.jpg"
              alt="Karaadi Logo"
              width={120}
              height={50}
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <NavItems user={user} />
      </div>
    </nav>
  );
};

export default Navbar;
