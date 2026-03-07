"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginLoading from "../components/shared/Loading/LoginLoading";
import { logout } from "@/actions/core/authAction";

interface IUser {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

interface ProfileCardProps {
  user: IUser | null;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const getCookie = (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop()?.split(";").shift();
        return null;
      };

      const token = getCookie("accessToken") || getCookie("idToken") || "";
      await logout(token);
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
      <div className="w-full mx-auto bg-white shadow-sm rounded-2xl p-6 mt-10 text-center border border-gray-100">
        <p className="text-gray-500 font-medium">
          Ma jiro xog laga helay isticmaalaha.
        </p>
      </div>
    );
  }

  const displayName = user.username || "Isticmaale";
  const profileImageSrc =
    user.profileImage && user.profileImage.trim() !== ""
      ? user.profileImage
      : "/default-profile.png";

  return (
    <div className="relative w-full mx-auto bg-white shadow-none md:shadow-sm rounded-2xl p-6 space-y-6 mt-10 border border-gray-100">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="w-[100px] h-[100px] relative rounded-full overflow-hidden bg-blue-50 border-2 border-blue-100 shrink-0">
          <Image
            src={profileImageSrc}
            alt={displayName}
            fill
            className="object-cover"
            sizes="100px"
            priority
          />
        </div>

        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left w-full">
          <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-gray-500 font-medium break-all">{user.email}</p>

          <div className="flex flex-col md:flex-row gap-3 mt-3 w-full md:w-auto">
            <button
              onClick={handleEditProfile}
              className="px-8 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 transition shadow-sm w-full md:w-fit"
            >
              Wax ka beddel Profile-ka
            </button>

            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`px-8 py-2.5 text-white text-sm font-bold rounded-lg transition shadow-sm md:absolute md:top-6 md:right-6 w-full md:w-auto ${
                isLoggingOut
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-700 hover:bg-red-800"
              }`}
            >
              {isLoggingOut ? <LoginLoading /> : "Ka bax (Logout)"}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-xl">
        <h3 className="font-bold text-amber-800 mb-1 text-center md:text-left">
          Ka qeyb qaado inaad Karaadi ka dhigto mid ammaan ah
        </h3>
        <p className="text-sm text-amber-900 leading-relaxed text-center md:text-left">
          Caddee in aad adiga tahay adigoo isticmaalaya **WAAFI** si aad u hesho
          dhammaan adeegyada Karaadi. Waxay kaa dhigeysaa mid lagu kalsoonaan
          karo oo fursada guusha macaamilkaaga way kordheysaa.
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
