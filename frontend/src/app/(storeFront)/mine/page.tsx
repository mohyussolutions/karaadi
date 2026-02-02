"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import ProfileCard from "./ProfileCard";
import { User } from "../../utils/types/user";

import { accountOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import { verifySession } from "@/actions/core/authAction";

export default function MyAccountCards() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = await verifySession();
        if (!user) {
          router.replace("/");
        } else {
          setUser(user);
        }
      } catch (err) {
        router.replace("/");
      }
    };

    checkSession();
  }, [router]);

  if (!user) return null;

  return (
    <>
      <ProfileCard user={user} />
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountOptions.map((item, idx) => (
          <Link key={idx} href={item.href}>
            <div className="flex items-start gap-4 border border-gray-200 rounded-lg p-4 shadow-sm bg-white transition duration-200 hover:shadow-lg hover:bg-gray-50 hover:scale-[1.02] cursor-pointer">
              <div>{item.icon}</div>
              <div>
                <h3 className="text-md font-semibold">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
