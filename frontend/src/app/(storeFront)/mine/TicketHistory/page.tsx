"use client";
export const dynamic = "force-dynamic";

import React, { useState, useEffect, useCallback } from "react";
import {
  MdHistory,
  MdPerson,
  MdEmail,
  MdCheckCircle,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdRotateRight,
  MdSend,
  MdLockOutline,
} from "react-icons/md";
import Loading from "@/app/ui/loading/Loading";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import {
  getTicketHistory,
  getTicketDetails,
  addTicketMessage,
} from "@/actions/categories/contactMeAction";
import { useRouter } from "next/navigation";

const STATUS_COLORS = {
  DONE: "bg-green-600 text-white",
  IN_PROGRESS: "bg-blue-600 text-white",
  PENDING: "bg-red-500 text-white",
  default: "bg-gray-500 text-white",
} as const;

const STATUS_ICONS = {
  DONE: MdCheckCircle,
  IN_PROGRESS: MdRotateRight,
  default: null,
} as const;

const USER_ROLE = "USER" as const;
const SUPPORT_ROLE = "SUPPORT" as const;

export default function TicketHistory() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);

  const fetchHistory = useCallback(async () => {
    if (!user?.email) return;
    setIsFetchingHistory(true);
    try {
      const data = await getTicketHistory(user.email);
      setTickets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchingHistory(false);
    }
  }, [user?.email]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchHistory();
    }
  }, [user, authLoading, fetchHistory]);

  const toggleExpand = async (ticketId: number) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
      return;
    }

    setExpandedTicket(ticketId);
    try {
      const fullTicket = await getTicketDetails(ticketId);
      if (fullTicket) {
        setTickets((prev) =>
          prev.map((t) => (t.id === ticketId ? fullTicket : t)),
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendMessage = async (ticketId: number) => {
    if (!replyText.trim() || isSending || !user?.email) return;

    const messageToSend = replyText;
    setReplyText("");
    setIsSending(true);

    try {
      const res = await addTicketMessage(ticketId, {
        body: messageToSend,
        senderName: user?.username || user?.name || "User",
        senderEmail: user.email,
        senderRole: USER_ROLE,
      });

      if (res?.success) {
        const updatedTicket = await getTicketDetails(ticketId);
        if (updatedTicket) {
          setTickets((prev) =>
            prev.map((t) => (t.id === ticketId ? updatedTicket : t)),
          );
        }
      } else {
        setReplyText(messageToSend);
      }
    } catch (error) {
      console.error(error);
      setReplyText(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  const getStatusColor = (status: string) => {
    return (
      STATUS_COLORS[status as keyof typeof STATUS_COLORS] ||
      STATUS_COLORS.default
    );
  };

  const getStatusIcon = (status: string) => {
    const Icon = STATUS_ICONS[status as keyof typeof STATUS_ICONS];
    if (!Icon) return null;
    if (status === "IN_PROGRESS") {
      return <Icon className="text-blue-600 animate-spin" />;
    }
    return <Icon className="text-green-600" />;
  };

  if (authLoading) {
    return (
      <div className="p-20 flex justify-center">
        <Loading />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
          <div className="w-20 h-20 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <MdLockOutline size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {t("auth.required", "Authentication Required")}
          </h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto">
            {t(
              "ticketHistory.loginRequired",
              "Please log in to view your ticket history.",
            )}
          </p>
          <button
            onClick={() =>
              router.push("/auth/login?redirect=/mine/TicketHistory")
            }
            className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
          >
            {t("auth.login.loginButton", "Login Now")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <MdPerson className="text-blue-600 text-xl" />
          <span className="font-bold text-gray-800">
            {user?.username || user?.name || t("mine.guest", "User")}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MdEmail className="text-blue-600 text-xl" />
          <span className="text-sm text-gray-600">{user?.email}</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdHistory className="text-blue-600" />{" "}
        {t("mine.tickets.title", "My Tickets")}
      </h3>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 text-sm">
        {isFetchingHistory && tickets.length === 0 ? (
          <div className="flex justify-center py-10">
            <Loading />
          </div>
        ) : tickets.length === 0 ? (
          <p className="text-gray-400 italic text-center py-10">
            {t("mine.tickets.noTickets", "No tickets found.")}
          </p>
        ) : (
          tickets.map((ticket) => (
            <div
              key={ticket.id}
              className={`border rounded-xl transition-all ${
                ticket.status === "DONE"
                  ? "bg-green-50/30 border-green-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(ticket.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(ticket.status)}
                    <span
                      className={`font-bold ${ticket.status === "DONE" ? "text-green-800" : "text-gray-800"}`}
                    >
                      {ticket.subject}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter ${getStatusColor(ticket.status)}`}
                  >
                    {ticket.status === "DONE"
                      ? t("mine.tickets.status.done", "Done")
                      : ticket.status === "IN_PROGRESS"
                        ? t("mine.tickets.status.inProgress", "In Progress")
                        : ticket.status}
                  </span>
                </div>
                <p className="text-gray-500 truncate italic text-xs">
                  {ticket.body}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {t("mine.tickets.id", "ID:")} #{ticket.id}
                  </p>
                  <div className="text-blue-600 text-[10px] font-black flex items-center gap-1 uppercase">
                    {expandedTicket === ticket.id ? (
                      <>
                        <MdKeyboardArrowUp size={16} />{" "}
                        {t("mine.tickets.close", "Close")}
                      </>
                    ) : (
                      <>
                        <MdKeyboardArrowDown size={16} />{" "}
                        {t("mine.tickets.open", "Open")}
                      </>
                    )}
                  </div>
                </div>
              </div>

              {expandedTicket === ticket.id && (
                <div className="p-4 bg-white border-t border-gray-100 space-y-4 rounded-b-xl">
                  {ticket.messages?.map((msg: any, index: number) => (
                    <div
                      key={msg.id || index}
                      className={`flex flex-col ${msg.senderRole === USER_ROLE ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-[90%] text-xs shadow-sm ${msg.senderRole === USER_ROLE ? "bg-gray-100 text-gray-700 rounded-tl-none border border-gray-200" : "bg-blue-600 text-white rounded-tr-none"}`}
                      >
                        {msg.body}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold px-1 tracking-tighter">
                        {msg.senderRole === USER_ROLE
                          ? index === 0
                            ? t(
                                "mine.tickets.yourOriginalRequest",
                                "Your Original Request",
                              )
                            : t("mine.tickets.you", "You")
                          : `${t("mine.tickets.supportTeam", "Support Team")} • ${msg.senderName}`}
                      </span>
                    </div>
                  ))}

                  {ticket.status === "DONE" && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center text-[9px] font-black uppercase border border-green-100">
                      {t("mine.tickets.caseResolved", "Case Resolved")}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <input
                      type="text"
                      placeholder={t(
                        "mine.tickets.typeMessage",
                        "Type a message...",
                      )}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage(ticket.id)
                      }
                    />
                    <button
                      onClick={() => handleSendMessage(ticket.id)}
                      disabled={isSending || !replyText.trim()}
                      className="bg-blue-600 text-white p-2.5 rounded-xl hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-md active:scale-95"
                    >
                      {isSending ? (
                        <MdRotateRight className="animate-spin" size={18} />
                      ) : (
                        <MdSend size={18} />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
