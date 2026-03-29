"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginLoading from "../components/shared/Loading/LoginLoading";
import { logout } from "@/actions/core/authAction";
import { FiEdit2, FiLogOut, FiPhone } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { NormalizedUser } from "@/app/utils/types/user.types";

interface ProfileCardProps {
  user: NormalizedUser | null;
  accessToken?: string;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const token =
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("accessToken="))
          ?.split("=")[1] ||
        document.cookie
          .split("; ")
          .find((row) => row.startsWith("idToken="))
          ?.split("=")[1] ||
        "";
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
          {t("mine.profile.noUser", "No user data found.")}
        </p>
      </div>
    );
  }

  const displayName =
    user.username || t("mine.profile.defaultDisplayName", "User");

  const getValidImageSrc = () => {
    if (!user.profileImage || imageError) {
      return "/default-profile.png";
    }
    try {
      new URL(user.profileImage);
      return user.profileImage;
    } catch {
      if (
        /^[A-Za-z0-9+/=]+$/.test(user.profileImage) &&
        user.profileImage.length > 100
      ) {
        return `data:image/png;base64,${user.profileImage}`;
      }
      return "/default-profile.png";
    }
  };

  const profileImageSrc = getValidImageSrc();

  return (
    <div className="relative w-full mx-auto bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 md:p-8 mt-10 border border-gray-100 shadow-sm hover:shadow transition-all duration-300">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 w-full">
          <div className="relative group shrink-0">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden ring-4 ring-blue-100 group-hover:ring-blue-200 transition-all duration-300">
              <Image
                src={profileImageSrc}
                alt={displayName}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 96px, 112px"
                priority
                onError={() => setImageError(true)}
              />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
          </div>

          <div className="text-center md:text-left space-y-3 w-full">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                {displayName}
              </h2>
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <p className="text-gray-500 break-all bg-gray-100/50 px-3 py-1 rounded-full text-xs md:text-sm font-medium">
                  {user.email}
                </p>
              </div>

              {user.phone && (
                <div className="flex items-center justify-center md:justify-start gap-2 text-gray-600 mt-3">
                  <FiPhone size={14} className="text-gray-400" />
                  <span className="text-sm">{user.phone}</span>
                  {user.phoneVerified && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full uppercase font-bold tracking-wider">
                      {t("mine.profile.verified", "Verified")}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex items-center justify-center md:justify-start pt-2">
              <button
                onClick={handleEditProfile}
                className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-300 shadow-sm flex items-center justify-center gap-2"
              >
                <FiEdit2 size={15} /> {t("mine.profile.edit", "Edit")}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto border-t md:border-t-0 border-gray-100 mt-6 md:mt-0 pt-6 md:pt-0">
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`w-full md:w-auto min-w-[140px] px-6 py-3.5 md:py-3 text-sm font-bold rounded-2xl md:rounded-xl transition-all duration-300 shadow-sm active:scale-95 flex items-center justify-center gap-2 border ${
              isLoggingOut
                ? "bg-green-600 text-white border-transparent cursor-not-allowed"
                : "bg-gradient-to-r from-red-600 to-red-500 text-white border-transparent hover:from-red-700 hover:to-red-600 hover:shadow-lg hover:shadow-red-100"
            }`}
          >
            {isLoggingOut ? (
              <div className="flex items-center gap-2">
                <LoginLoading />
              </div>
            ) : (
              <>
                <FiLogOut size={19} className="shrink-0" />
                <span>{t("mine.profile.logout", "Logout")}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
