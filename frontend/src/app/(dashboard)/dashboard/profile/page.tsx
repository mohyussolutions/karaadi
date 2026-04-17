"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { updateUserAction } from "@/actions/categories/usersAction";
import {
  updatePhone,
  updateProfileImage,
  deleteAccount,
  logout,
  clearAuthCookies,
} from "@/actions/core/authAction";
import { toast } from "react-toastify";
import Image from "next/image";
import Loading from "@/app/(storeFront)/components/shared/Loading/Loading";
import { useRouter } from "next/navigation";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiCalendar,
  FiEdit2,
  FiCheck,
  FiX,
  FiCamera,
  FiTrash2,
} from "react-icons/fi";

export default function DashboardProfile() {
  const { user, loading, setUser } = useAuth();
  const { t } = useTranslation();
  const router = useRouter();

  const [editingUsername, setEditingUsername] = useState(false);
  const [username, setUsername] = useState("");
  const [savingUsername, setSavingUsername] = useState(false);

  const [editingPhone, setEditingPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [savingPhone, setSavingPhone] = useState(false);

  const [savingImage, setSavingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSaveUsername = async () => {
    const id = user?._id || user?.id;
    if (!id) return;
    setSavingUsername(true);
    const result = await updateUserAction(id, username);
    if (result.success) {
      setUser({ ...user, username });
      setEditingUsername(false);
      toast.success(t("dashboard.profile.usernameUpdated"));
    } else {
      toast.error(t("dashboard.profile.updateFailed"));
    }
    setSavingUsername(false);
  };

  const handleSavePhone = async () => {
    setSavingPhone(true);
    const result = await updatePhone(phone);
    if (result.success) {
      setUser({ ...user, phone });
      setEditingPhone(false);
      toast.success(t("dashboard.profile.phoneUpdated"));
    } else {
      toast.error(result.error || t("dashboard.profile.updateFailed"));
    }
    setSavingPhone(false);
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSavingImage(true);
    const result = await updateProfileImage(file);
    if (result.success && result.profileImage) {
      setUser({ ...user, profileImage: result.profileImage });
      toast.success(t("dashboard.profile.imageUpdated"));
    } else {
      toast.error(t("dashboard.profile.updateFailed"));
    }
    setSavingImage(false);
  };

  const handleDeleteAccount = async () => {
    if (!confirm(t("dashboard.profile.deleteConfirm"))) return;
    const result = await deleteAccount();
    if (result.success) {
      await logout();
      clearAuthCookies();
      router.push("/");
    } else {
      toast.error(t("dashboard.profile.updateFailed"));
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center text-gray-500">
        {t("dashboard.profile.noUser")}
      </div>
    );
  }

  const role = user.isAdmin
    ? t("dashboard.profile.admin")
    : user.isManager
      ? t("dashboard.profile.manager")
      : user.isSupport
        ? t("dashboard.profile.support")
        : t("dashboard.profile.user");

  const roleColor = user.isAdmin
    ? "bg-indigo-100 text-indigo-700"
    : user.isManager
      ? "bg-blue-100 text-blue-700"
      : user.isSupport
        ? "bg-green-100 text-green-700"
        : "bg-gray-100 text-gray-700";

  const profileSrc = (() => {
    if (!user.profileImage) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "U")}&background=4f46e5&color=fff&size=128`;
    }
    if (
      user.profileImage.startsWith("http") ||
      user.profileImage.startsWith("data:")
    ) {
      return user.profileImage;
    }
    return `data:image/jpeg;base64,${user.profileImage}`;
  })();

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : t("mine.notAvailable");

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex-shrink-0">
            <Image
              src={profileSrc}
              alt={user.username || "Profile"}
              width={100}
              height={100}
              className="rounded-full border-4 border-indigo-100 object-cover w-24 h-24"
              unoptimized
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={savingImage}
              title={t("dashboard.profile.updateImage")}
              className="absolute bottom-0 right-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center hover:bg-indigo-700 transition shadow"
            >
              {savingImage ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCamera size={14} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center sm:text-left">
            <h1 className="text-2xl font-bold text-gray-800">
              {user.username || t("mine.profile.defaultDisplayName")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
            <span
              className={`mt-2 inline-block px-3 py-1 rounded-full text-xs font-semibold ${roleColor}`}
            >
              {role}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 divide-y divide-gray-50">
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            <FiUser size={13} />
            {t("dashboard.profile.username")}
          </div>
          {editingUsername ? (
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveUsername()}
                autoFocus
              />
              <button
                onClick={handleSaveUsername}
                disabled={savingUsername}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {savingUsername ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <FiCheck size={16} />
                )}
              </button>
              <button
                onClick={() => {
                  setUsername(user.username || "");
                  setEditingUsername(false);
                }}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">
                {user.username || t("mine.notAvailable")}
              </span>
              <button
                onClick={() => setEditingUsername(true)}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
              >
                <FiEdit2 size={13} />
                {t("mine.profile.edit")}
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            <FiMail size={13} />
            {t("dashboard.profile.email")}
          </div>
          <span className="text-gray-800 font-medium">{user.email}</span>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            <FiPhone size={13} />
            {t("dashboard.profile.phone")}
          </div>
          {editingPhone ? (
            <div className="flex items-center gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSavePhone()}
                placeholder="+252..."
                autoFocus
              />
              <button
                onClick={handleSavePhone}
                disabled={savingPhone}
                className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
              >
                {savingPhone ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                ) : (
                  <FiCheck size={16} />
                )}
              </button>
              <button
                onClick={() => {
                  setPhone(user.phone || "");
                  setEditingPhone(false);
                }}
                className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition"
              >
                <FiX size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-gray-800 font-medium">
                {user.phone || t("mine.notAvailable")}
              </span>
              <button
                onClick={() => setEditingPhone(true)}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 text-sm"
              >
                <FiEdit2 size={13} />
                {t("mine.profile.edit")}
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
            <FiCalendar size={13} />
            {t("dashboard.profile.memberSince")}
          </div>
          <span className="text-gray-800 font-medium">{joinedDate}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-red-50 p-6">
        <button
          onClick={handleDeleteAccount}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition"
        >
          <FiTrash2 size={16} />
          {t("dashboard.profile.deleteAccount")}
        </button>
      </div>
    </div>
  );
}
