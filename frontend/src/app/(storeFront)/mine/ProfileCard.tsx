"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FiEdit2, FiLogOut, FiPhone, FiCheckCircle } from "@/app/utils/icons";
import { useTranslation } from "react-i18next";
import { logout, clearAuthCookies } from "@/actions/core/authAction";
import { NormalizedUser } from "@/app/utils/types/user.types";

interface ProfileCardProps {
  user: NormalizedUser | null;
  accessToken?: string;
}

const ProfileCard = ({ user, accessToken }: ProfileCardProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const [imageError, setImageError] = useState(false);

  const handleLogout = () => {
    logout(accessToken || user?.token || "");
    window.location.href = "/";
  };

  const handleEditProfile = () => {
    router.push("/profile-edit");
  };

  const profileImageSrc = useMemo(() => {
    if (!user?.profileImage || imageError) return "/default-profile.png";
    if (
      user.profileImage.startsWith("http") ||
      user.profileImage.startsWith("data:")
    ) {
      return user.profileImage;
    }
    return user.profileImage.length > 100
      ? `data:image/png;base64,${user.profileImage}`
      : "/default-profile.png";
  }, [user?.profileImage, imageError]);

  if (!user) return null;

  return (
    <div className="relative w-full mx-auto bg-white rounded-[2.5rem] p-6 md:p-10 mt-10 border border-gray-100 shadow-sm transition-all duration-300 group">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 w-full">
          <div className="flex items-center justify-center w-full md:w-auto">
            <div className="w-28 h-28 rounded-full overflow-hidden border border-gray-200 bg-gray-50">
              <Image
                src={profileImageSrc}
                alt={user.username || "User"}
                width={112}
                height={112}
                className="object-cover rounded-full"
                priority
                onError={() => setImageError(true)}
              />
            </div>
          </div>

          <div className="text-center md:text-left space-y-4 w-full">
            <div className="space-y-1">
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight">
                {user.username}
              </h2>
              <div className="flex justify-center md:justify-start">
                <p className="text-blue-600 font-bold text-sm tracking-wide bg-blue-50 inline-block px-4 py-1 rounded-full">
                  {user.email}
                </p>
              </div>
            </div>

            {user.phone && (
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100">
                  <FiPhone size={14} className="text-gray-400" />
                  <span className="text-sm font-black text-gray-700">
                    {user.phone}
                  </span>
                </div>
                {user.phoneVerified && (
                  <div className="flex items-center gap-1 text-green-600">
                    <FiCheckCircle size={16} />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {t("mine.profile.verified")}
                    </span>
                  </div>
                )}
              </div>
            )}

            <div className="flex justify-center md:justify-start">
              <button
                onClick={handleEditProfile}
                className="px-8 py-3.5 bg-gray-900 text-white text-xs font-black uppercase tracking-widest rounded-2xl hover:bg-blue-600 transition-all duration-300 flex items-center gap-3"
              >
                <FiEdit2 size={14} />
                {t("mine.profile.edit")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-center w-full lg:w-auto mt-6 lg:mt-0">
          <button
            onClick={handleLogout}
            className="px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all duration-300 flex items-center justify-center gap-3 border-2 min-w-[140px] bg-white text-red-500 border-red-50 hover:bg-red-500 hover:text-white hover:border-red-500"
          >
            <FiLogOut size={18} />
            <span>{t("mine.profile.logout")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
