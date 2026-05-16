"use client";

import ProfileCard from "./ProfileCard";
import AccountOptionsClient from "./AccountOptionsClient";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/actions/core/authAction";
import { useRouter } from "next/navigation";

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

  if (loading) return <div className="flex justify-center items-center min-h-[40vh]"><div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full" /></div>;
  if (!user) return <MineError />;

  return (
    <>
      <ProfileCard user={user as any} accessToken={user.token || ""} />
      <AccountOptionsClient user={user as any} />
    </>
  );
}
