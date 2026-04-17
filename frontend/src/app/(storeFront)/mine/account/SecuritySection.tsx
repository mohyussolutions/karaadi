"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { FiPhone, FiPhoneCall } from "@/app/utils/icons";
import { updatePhone } from "@/actions/core/authAction";

interface PhoneSectionProps {
  user: any;
}

export function PhoneSection({ user }: PhoneSectionProps) {
  const { t } = useTranslation();
  const [phone, setPhone] = useState("");
  const [phoneLoading, setPhoneLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleUpdatePhone = async () => {
    if (!phone) {
      return toast.error(
        t("mine.account.phoneRequired", "Phone number is required"),
      );
    }

    setPhoneLoading(true);
    try {
      const result = await updatePhone(phone);
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
    } catch (err: any) {
      toast.error(err?.message || String(err));
    } finally {
      setPhoneLoading(false);
    }
  };

  return (
    <div className="rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="p-3 rounded-lg">
          <FiPhone className="w-6 h-6 text-green-600" />
        </div>
        <h4 className="text-lg font-bold text-gray-900">
          {t("mine.account.phoneNumber", "Phone Number")}
        </h4>
      </div>

      <div className="mb-4 p-3 border border-gray-200 rounded-lg">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Current Phone:</span>{" "}
          <span className="text-gray-900">{user.phone || "Not set"}</span>
        </p>
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
  );
}
