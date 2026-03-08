"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoginLoading from "../components/shared/Loading/LoginLoading";
import { logout, updatePhone } from "@/actions/core/authAction";
import { toast } from "react-toastify";

interface IUser {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
  phone?: string;
  phoneVerified?: boolean;
}

interface ProfileCardProps {
  user: IUser | null;
  accessToken?: string;
}

const ProfileCard = ({ user, accessToken }: ProfileCardProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || "");
  const [isUpdatingPhone, setIsUpdatingPhone] = useState(false);

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

  const handleUpdatePhone = async () => {
    if (!accessToken) {
      toast.error("Not authenticated - no access token");
      return;
    }

    if (!phoneNumber) {
      toast.error("Phone number is required");
      return;
    }

    let formattedPhone = phoneNumber.trim();
    formattedPhone = formattedPhone.replace(/[\s\-\(\)]/g, "");

    if (formattedPhone.startsWith("0")) {
      formattedPhone = "+2526" + formattedPhone.substring(1);
    } else if (formattedPhone.startsWith("6")) {
      formattedPhone = "+252" + formattedPhone;
    } else if (!formattedPhone.startsWith("+")) {
      formattedPhone = "+252" + formattedPhone;
    }

    setIsUpdatingPhone(true);
    try {
      const result = await updatePhone(formattedPhone, accessToken);
      if (result.success) {
        toast.success("Phone number updated successfully!");
        setIsEditingPhone(false);
        if (user) {
          user.phone = formattedPhone;
          user.phoneVerified = true;
        }
      } else {
        if (result.expired) {
          toast.error("Session expired - please login again");
          setTimeout(() => {
            window.location.href = "/login";
          }, 2000);
        } else {
          toast.error(result.error || "Failed to update phone");
        }
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdatingPhone(false);
    }
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

  const getValidImageSrc = () => {
    if (!user.profileImage || user.profileImage.trim() === "" || imageError) {
      return "/default-profile.png";
    }

    try {
      new URL(user.profileImage);
      return user.profileImage;
    } catch {
      return "/default-profile.png";
    }
  };

  const profileImageSrc = getValidImageSrc();

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
            onError={() => setImageError(true)}
          />
        </div>

        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left w-full">
          <h2 className="text-2xl font-bold text-gray-900">{displayName}</h2>
          <p className="text-gray-500 font-medium break-all">{user.email}</p>

          <div className="mt-2 w-full">
            {isEditingPhone ? (
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+2526XXXXXXXX"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-full sm:w-64"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdatePhone}
                    disabled={isUpdatingPhone}
                    className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isUpdatingPhone ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setPhoneNumber(user.phone || "");
                    }}
                    className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">
                    Phone:
                  </span>
                  {user.phone ? (
                    <span className="text-sm text-gray-600">{user.phone}</span>
                  ) : (
                    <span className="text-sm text-gray-400 italic">
                      Not provided
                    </span>
                  )}
                  {user.phoneVerified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  {user.phone ? "Update" : "Add"}
                </button>
              </div>
            )}
          </div>

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
