"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginLoading from "../components/shared/Loading/LoginLoading";
import { User } from "../../utils/types/user";
import { logout } from "@/actions/core/authAction";

interface ProfileCardProps {
  user: User | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const accessToken = document.cookie.replace(
        /(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/,
        "$1",
      );
      await logout(accessToken);
      window.location.href = "/";
    } catch (err) {
      window.location.href = "/";
    }
  };

  const handleEditProfile = () => {
    router.push("/profile-edit");
  };

  if (!user) {
    return (
      <div className="relative w-full mx-auto bg-white shadow-none md:shadow-sm rounded-2xl p-6 space-y-4 mt-10">
        <p>No user data available</p>
      </div>
    );
  }

  const displayName = user.username || "User";
  const profileImageSrc =
    user.profileImage && user.profileImage.trim() !== ""
      ? user.profileImage
      : "/default-profile.png";

  return (
    <>
      <div className="relative w-full mx-auto bg-white shadow-none md:shadow-sm rounded-2xl p-6 space-y-4 mt-10">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={`absolute top-4 right-4 px-4 py-1 text-white text-sm rounded-[10px] ${
            isLoggingOut ? "bg-gray-400" : "bg-red-800 hover:bg-red-600"
          }`}
        >
          {isLoggingOut ? <LoginLoading /> : "Logout"}
        </button>

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 p-2 rounded mb-4">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="w-[90px] h-[90px] relative rounded-full overflow-hidden bg-gray-200">
            <Image
              src={profileImageSrc}
              alt="Profile picture"
              fill
              className="object-cover"
              sizes="90px"
              priority
            />
          </div>
          <div className="flex flex-col space-y-1">
            <h2 className="text-xl font-semibold text-gray-800">
              {displayName}
            </h2>
            <p className="text-sm text-gray-500">{user.email}</p>
            <button
              onClick={handleEditProfile}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-fit"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-yellow-100 border-l-4 border-yellow-400 p-4 rounded">
          <h3 className="font-semibold text-yellow-700 mb-1">
            Ka qeyb qaado inaad Karaadi ka dhigto mid ammaan ah
          </h3>
          <p className="text-sm text-yellow-800">
            Caddee in aad adiga tahay adigoo isticmaalaya Bank ID si aad u hesho
            dhammaan adeegyada Karaadi. Waxay kaa dhigeysaa mid lagu kalsoonaan
            karo oo fursada guusha macaamilkaaga way kordheysaa.
          </p>
        </div>
      </div>
    </>
  );
};

export default ProfileCard;
