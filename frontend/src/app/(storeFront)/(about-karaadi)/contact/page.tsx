"use client";

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { MdSend, MdHistory } from "react-icons/md";
import { createTicket } from "@/actions/categories/contactMeAction";
import { useAuth } from "@/context/AuthContext";

export default function SupportModule() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createTicket({
        senderName: user.username,
        senderEmail: user.email,
        subject,
        body,
      });
      if (result.success) {
        setSubject("");
        setBody("");
        router.push("/mine/TicketHistory");
      } else {
        alert(result.error || "Failed to submit ticket.");
      }
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t("supportModule.title")}
            </h2>
            <p className="text-sm text-gray-400">
              {t("supportModule.subtitle")}
            </p>
          </div>

          {user && (
            <button
              onClick={() => router.push("/mine/TicketHistory")}
              className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors"
            >
              <MdHistory size={18} />
              {t("supportModule.historyButton")}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium transition-all"
              placeholder={t("supportModule.form.subjectPlaceholder")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1">
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-48 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium resize-none transition-all"
              placeholder={t("supportModule.form.bodyPlaceholder")}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>
          <button
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all shadow-lg shadow-blue-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <MdSend /> {t("supportModule.form.submit")}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
