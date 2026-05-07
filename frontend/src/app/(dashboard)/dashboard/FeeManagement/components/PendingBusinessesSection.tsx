"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { Business } from "@/actions/categories/businessActions";
import { updateBusinessStatus } from "@/actions/categories/businessActions";

interface Props {
  businesses: Business[];
  onRefresh: () => void;
}

export default function PendingBusinessesSection({ businesses, onRefresh }: Props) {
  const { t } = useTranslation();
  const [approving, setApproving] = useState<string | null>(null);

  const handleApprove = async (business: Business) => {
    setApproving(business.id);
    const res = await updateBusinessStatus(business.id, {
      status: "active",
      isVerified: true,
    });
    if ((res as any)?.success) {
      toast.success(`${business.name} approved and verified`);
      onRefresh();
    } else {
      toast.error("Failed to approve business");
    }
    setApproving(null);
  };

  const pending = businesses.filter((b) => b.status === "pending" || !b.isVerified);

  return (
    <section className="bg-white dark:bg-gray-800 rounded-2xl lg:rounded-3xl border border-gray-100 dark:border-gray-700 p-4 sm:p-5 lg:p-6 shadow-sm col-span-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
        <div>
          <h2 className="text-xs font-black text-gray-400 uppercase tracking-widest">
            {t("adminTable.verificationQueue")}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {t("adminTable.verificationQueueSubtitle")}
          </p>
        </div>
        <span className="text-xs font-black bg-amber-50 text-amber-600 px-3 py-1.5 rounded-full">
          {pending.length} {t("adminTable.pending")}
        </span>
      </div>

      {pending.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">{t("adminTable.noPendingBusinesses")}</p>
      ) : (
        <>
          <div className="block lg:hidden space-y-3">
            {pending.map((b) => (
              <div key={b.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  {b.logo ? (
                    <img src={b.logo} alt="" className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">
                      {b.name[0]}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{b.name}</p>
                    <p className="text-xs text-gray-500 truncate">{b.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-3">
                  <div><span className="font-bold text-gray-700 block">{b.owner?.username ?? b.contactName ?? "—"}</span>{t("adminTable.owner")}</div>
                  <div><span className="font-bold text-gray-700 block">{b.phone}</span>{t("adminTable.phone")}</div>
                  <div><span className="font-bold text-gray-700 block">{b.orgNumber ?? "—"}</span>{t("adminTable.orgNumber")}</div>
                  <div><span className="font-bold text-gray-700 block">{new Date(b.createdAt).toLocaleDateString()}</span>{t("adminTable.registered")}</div>
                </div>
                <button
                  onClick={() => handleApprove(b)}
                  disabled={approving === b.id}
                  className="w-full bg-emerald-600 text-white text-sm font-bold py-2 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-all"
                >
                  {approving === b.id ? t("adminTable.approving") : t("adminTable.approve")}
                </button>
              </div>
            ))}
          </div>

          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  {[t("adminTable.company"), t("adminTable.owner"), t("adminTable.email"), t("adminTable.phone"), t("adminTable.orgNumber"), t("adminTable.registered"), ""].map((h) => (
                    <th key={h} className="text-left text-xs font-black text-gray-400 uppercase tracking-wider pb-3 pr-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pending.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-2">
                        {b.logo ? (
                          <img src={b.logo} alt="" className="w-7 h-7 rounded-full object-cover" />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                            {b.name[0]}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800">{b.name}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{b.owner?.username ?? b.contactName ?? "—"}</td>
                    <td className="py-3 pr-4 text-gray-600">{b.email}</td>
                    <td className="py-3 pr-4 text-gray-600">{b.phone}</td>
                    <td className="py-3 pr-4 text-gray-500">{b.orgNumber ?? "—"}</td>
                    <td className="py-3 pr-4 text-gray-500 text-xs">{new Date(b.createdAt).toLocaleDateString()}</td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleApprove(b)}
                        disabled={approving === b.id}
                        className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-60 transition-all"
                      >
                        {approving === b.id ? t("adminTable.approving") : t("adminTable.approve")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
