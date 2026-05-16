"use client";

import ProfileCard from "./ProfileCard";
import AccountOptionsClient from "./AccountOptionsClient";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/actions/core/authAction";
import { useRouter } from "next/navigation";

function MineSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-10 animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-gray-200" />
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-36" />
          <div className="h-3 bg-gray-100 rounded w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-20 sm:h-36 bg-gray-100 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function MineError() {
  const router = useRouter();
  const handleLogout = async () => {
    await logout();
    router.push("/marketplace");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <p className="text-gray-500 text-sm">Could not load your profile. Try refreshing.</p>
      <div className="flex gap-3">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 transition"
        >
          Refresh
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export default function MyAccountCards() {
  const { user, loading } = useAuth();

  if (loading) return <MineSkeleton />;
  if (!user) return <MineError />;

  return (
    <>
      <ProfileCard user={user as any} accessToken={user.token || ""} />
      <AccountOptionsClient user={user as any} />
    </>
  );
}
