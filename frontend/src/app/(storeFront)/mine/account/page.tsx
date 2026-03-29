"use client";

import {
  updateProfile,
  verifySession,
  deleteAccount,
  updatePhone,
} from "@/actions/core/authAction";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  FiUser,
  FiPhone,
  FiTrash2,
  FiCheckCircle,
  FiPhoneCall,
  FiAlertTriangle,
  FiX,
} from "react-icons/fi";

const ProfileEditPage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [phoneLoading, setPhoneLoading] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const session = await verifySession();
      if (session) {
        setUsername(session.username || "");
        setPhone(session.phone || "");
        setEmail(session.email || "");
        setAccessToken(session.accessToken || session.token || "");
      }
    };
    loadUserData();
  }, []);

  const handleUpdatePhone = async () => {
    if (!phone)
      return toast.error(
        t("mine.account.phoneRequired", "Phone number is required"),
      );
    if (!accessToken)
      return toast.error(
        t("mine.account.authRequired", "Authentication required"),
      );

    setPhoneLoading(true);
    try {
      const result = await updatePhone(phone, accessToken);
      if (result.success) {
        toast.success(
          t("mine.account.phoneUpdated", "Phone number updated successfully"),
        );
      } else {
        toast.error(
          result.error ||
            t("mine.account.phoneUpdateFailed", "Failed to update phone"),
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setPhoneLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!accessToken)
      return toast.error(
        t("mine.account.authRequired", "Authentication required"),
      );

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("username", username);

      const result = await updateProfile(formData, accessToken);
      if (result.success) {
        toast.success(
          t("mine.account.usernameUpdated", "Username updated successfully"),
        );
      } else {
        toast.error(
          result.error ||
            t("mine.account.usernameUpdateFailed", "Failed to update username"),
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!accessToken)
      return toast.error(
        t("mine.account.authRequired", "Authentication required"),
      );

    setDeleteLoading(true);
    try {
      const result = await deleteAccount(accessToken);
      if (result.success) {
        toast.success(
          t("mine.account.deleted", "Account deleted successfully"),
        );
        router.push("/");
      } else {
        toast.error(
          result.error ||
            t(
              "mine.account.deleteFailed",
              "Security token invalid or session expired",
            ),
        );
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 bg-gray-50/50">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 rounded-lg">
              <FiUser className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              {t("mine.account.username", "Username")}
            </h4>
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

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-green-50 rounded-lg">
              <FiPhone className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              {t("mine.account.phoneNumber", "Phone Number")}
            </h4>
          </div>
          <div className="space-y-4">
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-green-500 transition"
              placeholder={t("mine.account.phonePlaceholder", "61XXXXXXX")}
            />
            <button
              onClick={handleUpdatePhone}
              disabled={phoneLoading}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 disabled:bg-gray-400 transition flex items-center justify-center gap-2"
            >
              <FiPhoneCall size={18} />
              {phoneLoading
                ? t("mine.account.updating", "Updating...")
                : t("mine.account.updatePhone", "Update Phone")}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FiTrash2 size={80} />
          </div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-lg">
              <FiTrash2 className="w-6 h-6 text-red-600" />
            </div>
            <h4 className="text-lg font-bold text-gray-900">
              {t("mine.account.dangerZone", "Danger Zone")}
            </h4>
          </div>
          <div className="bg-red-50/50 rounded-xl p-4 mb-4 border border-red-100">
            <div className="flex justify-between items-center text-sm">
              <span className="text-red-700 font-medium">
                {t("mine.account.emailLabel", "Email:")}
              </span>
              <span className="text-red-900 font-bold">{email}</span>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-6">
            {t(
              "mine.account.deleteWarning",
              "Deleting your account is a permanent action. All your listings, messages, and profile data will be removed from our systems immediately.",
            )}
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-white text-red-600 border-2 border-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 shadow-sm"
          >
            <FiTrash2 size={18} />
            Delete Account Permanently
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-red-100 rounded-2xl">
                <FiAlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition"
              >
                <FiX size={20} className="text-gray-400" />
              </button>
            </div>

            <h3 className="text-2xl font-black text-gray-900 mb-2">
              {t("mine.account.wait", "Wait a second!")}
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {t(
                "mine.account.confirmDeleteText",
                "Are you absolutely sure? This will permanently erase everything associated with",
              )}{" "}
              <span className="font-bold text-gray-900">{email}</span>.{" "}
              {t("mine.account.cannotUndo", "You cannot undo this.")}
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {deleteLoading
                  ? t("mine.account.erasing", "Erasing Data...")
                  : t(
                      "mine.account.yesDeleteEverything",
                      "Yes, Delete Everything",
                    )}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={deleteLoading}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
              >
                {t("mine.account.stay", "Actually, I'll Stay")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileEditPage;
