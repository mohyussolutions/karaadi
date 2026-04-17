"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { FiTrash2, FiAlertTriangle, FiX } from "@/app/utils/icons";
import { deleteAccount } from "@/actions/core/authAction";

interface DeleteAccountSectionProps {
  user: any;
}

export function DeleteAccountSection({ user }: DeleteAccountSectionProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const requiredText = "delete account";

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      const result = await deleteAccount();
      if (result.success) {
        toast.success(
          t("mine.account.deleted", "Account deleted successfully"),
        );
        router.push("/login");
      } else {
        toast.error(t("mine.account.deleteFailed", "Failed to delete account"));
      }
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setDeleteLoading(false);
      setIsModalOpen(false);
      setConfirmText("");
    }
  };

  return (
    <>
      <div className="rounded-2xl shadow-sm border border-red-200 p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <FiTrash2 size={80} />
        </div>
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-lg">
            <FiTrash2 className="w-6 h-6 text-red-600" />
          </div>
          <h4 className="text-lg font-bold text-gray-900">
            {t("mine.account.dangerZone", "Danger Zone")}
          </h4>
        </div>

        <div className="border border-red-200 rounded-xl p-4 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {t("mine.account.emailLabel", "Email:")}
              </span>
              <span className="text-gray-900 font-mono">{user.email}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">
                {t("mine.account.usernameLabel", "Username:")}
              </span>
              <span className="text-gray-900">{user.username}</span>
            </div>
            {user.phone && (
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">
                  {t("mine.account.phoneLabel", "Phone:")}
                </span>
                <span className="text-gray-900">{user.phone}</span>
              </div>
            )}
          </div>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          {t(
            "mine.account.deleteWarning",
            "Deleting your account is permanent. Type 'delete account' to confirm.",
          )}
        </p>

        <div className="space-y-3">
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="delete account"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={confirmText.toLowerCase() !== requiredText}
            className="w-full py-3 text-red-600 border-2 border-red-600 font-bold rounded-xl hover:bg-red-600 hover:text-white transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-red-600"
          >
            <FiTrash2 size={18} />
            Delete Account Permanently
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 rounded-2xl">
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
                "Are you sure? This erases everything for",
              )}{" "}
              <span className="font-bold text-gray-900">{user.email}</span>.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition disabled:bg-gray-400 flex items-center justify-center gap-2"
              >
                {deleteLoading
                  ? t("mine.account.erasing", "Erasing...")
                  : t(
                      "mine.account.yesDeleteEverything",
                      "Yes, Delete Everything",
                    )}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-4 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition"
              >
                {t("mine.account.stay", "Actually, I'll Stay")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
