"use client";
import { settingsOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  FaCog,
  FaShieldAlt,
  FaLock,
  FaCreditCard,
  FaBell,
} from "react-icons/fa";

interface Setting {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

const Settings: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {settingsOptions.map((item, idx) => (
        <Link key={idx} href={item.href}>
          <div className="flex flex-col items-center gap-6 border border-gray-200 rounded-xl p-10 shadow-lg bg-white transition duration-300 hover:shadow-2xl hover:bg-gray-50 hover:scale-[1.05] cursor-pointer w-[300px] h-[300px]">
            <div>{item.icon}</div>
            <h3 className="text-2xl font-bold text-center">{item.title}</h3>
            <p className="text-lg text-gray-600 text-center">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Settings;
