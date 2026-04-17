"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiUser, FiCheckCircle } from "@/app/utils/icons";
import { updateProfile } from "@/actions/core/authAction";

interface ProfileSectionProps {
  user: any;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const { t } = useTranslation();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setUsername(user.username || "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);

      const result = await updateProfile(formData);
      if (result.success) {
        toast.success(
          t("mine.account.usernameUpdated", "Username updated successfully"),
        );
      } else {
        toast.error(
          t("mine.account.usernameUpdateFailed", "Failed to update username"),
        );
      }
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-lg">
          <FiUser className="w-6 h-6 text-blue-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-900">
          {t("mine.account.username", "Username")}
        </h4>
      </div>

      <div className="mb-4 p-3 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Current Email:</span>{" "}
          <span className="text-gray-900">{user.email}</span>
        </p>
      </div>

      <div className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 transition"
          placeholder={t("mine.account.yourUsername", "Your username")}
        />
        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
        >
          <FiCheckCircle size={18} />
          {loading
            ? t("mine.account.updating", "Updating...")
            : t("mine.account.updateUsername", "Update Username")}
        </button>
      </div>
    </div>
  );
}
