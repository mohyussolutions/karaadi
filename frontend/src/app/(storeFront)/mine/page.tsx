"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileCard from "./ProfileCard";
import { accountOptions } from "@/app/(links)/storeFrontLinks/mineLinks";
import { verifySession } from "@/actions/core/authAction";

export default async function MyAccountCards() {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("accessToken")?.value ||
    cookieStore.get("idToken")?.value ||
    "";

  const user = await verifySession(accessToken);

  if (!user) {
    redirect("/");
  }

  return (
    <>
      <ProfileCard user={user} accessToken={accessToken} />

      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {accountOptions.map((item, idx) => {
          const Icon = item.icon;
          const isAccount = item.title.toLowerCase().includes("account");

          return (
            <Link key={idx} href={item.href}>
              <div className="flex items-start gap-4 border border-gray-100 rounded-xl p-5 shadow-sm bg-white transition-all duration-300 hover:shadow-xl hover:border-blue-100 hover:-translate-y-1">
                <div className={`${item.colorClass} shrink-0`}>
                  <Icon size={24} />
                </div>

                <div className="flex-1">
                  <h3 className="text-[15px] font-bold text-gray-900 leading-none mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>

                  {!user.phoneVerified && isAccount && (
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                      </span>
                      <span className="text-[10px] text-amber-600 font-black uppercase tracking-wider">
                        Verify Phone
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
