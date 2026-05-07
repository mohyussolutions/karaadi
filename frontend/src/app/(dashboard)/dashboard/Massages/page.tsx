"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  MdInbox,
  MdReply,
  MdCheckCircle,
  MdRotateRight,
  MdAssessment,
  MdToday,
  MdDelete,
} from "react-icons/md";
import {
  getAllTickets,
  getTicketDetails,
  getTicketStats,
  updateTicketStatus,
  deleteTicket,
  deleteMessage,
  addTicketMessage,
} from "@/actions/categories/contactMeAction";
import { useAuth } from "@/context/AuthContext";

export type Message = {
  id: number;
  body: string;
  senderName: string;
  senderEmail?: string;
  senderRole?: string;
};

export type Ticket = {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  status: string;
  messages?: Message[];
};

export type AdminUser = {
  username?: string;
  name?: string;
  email?: string;
  isAdmin?: boolean;
  isManager?: boolean;
};

type Stats = { total: number; today: number };

export default function AdminDashboard() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user: admin } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [stats, setStats] = useState<Stats>({ total: 0, today: 0 });

  const loadData = useCallback(async () => {
    try {
      if (!admin) {
        router.back();
        return;
      }

      const [allTickets, statsData] = await Promise.all([
        getAllTickets(),
        getTicketStats(),
      ]);

      if (allTickets && allTickets.length > 0) {
        const sorted = (allTickets as Ticket[]).sort((a, b) => b.id - a.id);
        const uniqueUsersMap = new Map<string, Ticket>();

        sorted.forEach((ticket) => {
          if (!uniqueUsersMap.has(ticket.senderEmail)) {
            uniqueUsersMap.set(ticket.senderEmail, ticket);
          }
        });
        setTickets(Array.from(uniqueUsersMap.values()));
      }

      setStats(statsData);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    }
  }, [router, admin]);

  const loadDetails = async (id: number) => {
    try {
      const data = await getTicketDetails(id);
      if (data) {
        setSelectedTicket(data);
        if (data.status === "NEW") {
          await handleStatusUpdate("IN_PROGRESS", id);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (newStatus: string, ticketId?: number) => {
    const id = ticketId || selectedTicket?.id;
    if (!id) return;

    try {
      const result = await updateTicketStatus(id, newStatus);
      if (result.success) {
        await loadData();
        if (selectedTicket?.id === id) {
          const updated = await getTicketDetails(id);
          setSelectedTicket(updated);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (!confirm("Delete entire conversation?")) return;
    try {
      const result = await deleteTicket(id);
      if (result.success) {
        setSelectedTicket(null);
        await loadData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const result = await deleteMessage(msgId);
      if (result.success && selectedTicket) {
        const updated = await getTicketDetails(selectedTicket.id);
        setSelectedTicket(updated);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim() || !selectedTicket || !admin) return;

    try {
      const senderName = admin.username ?? admin.username ?? "Admin";
      const senderEmail = admin.email ?? "";
      const senderRole = admin.isAdmin ? "ADMIN" : "SUPPORT_MANAGER";

      const result = await addTicketMessage(selectedTicket.id, {
        body: replyBody,
        senderName: senderName,
        senderEmail: senderEmail,
        senderRole: senderRole,
      });

      if (result.success) {
        setReplyBody("");
        const updated = await getTicketDetails(selectedTicket.id);
        setSelectedTicket(updated);
        await loadData();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="flex h-screen max-h-screen bg-gray-50 flex-col overflow-hidden">
      <div className="bg-white dark:bg-gray-800 border-b p-4 flex gap-6 px-8 items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <MdAssessment className="text-blue-600" size={20} />
            <span className="text-sm font-bold text-gray-700 uppercase">
              {t("adminTable.total")}: {stats.total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MdToday className="text-orange-600" size={20} />
            <span className="text-sm font-bold text-gray-700 uppercase">
              {t("adminTable.today")}: {stats.today}
            </span>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-sm font-black text-blue-600 uppercase tracking-tighter">
            {admin?.email}
          </p>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
        <div
          className={`${selectedTicket ? "hidden md:flex" : "flex"} w-full md:w-1/3 border-r bg-white dark:bg-gray-800 flex-col h-full overflow-hidden`}
        >
          <div className="p-4 border-b bg-gray-900 text-white flex items-center gap-2 flex-shrink-0">
            <MdInbox />
            <span className="text-xs font-black uppercase tracking-widest">
              {t("adminTable.inbox")}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.length === 0 ? (
              <div className="p-8 text-center text-gray-400 font-medium">
                {t("adminTable.noTickets")}
              </div>
            ) : (
              tickets.map((t) => (
                <div
                  key={t.id}
                  onClick={() => loadDetails(t.id)}
                  className={`p-4 border-b cursor-pointer transition-all border-l-4 ${
                    t.status === "NEW"
                      ? "bg-blue-50/50 border-l-red-500"
                      : selectedTicket?.id === t.id
                        ? "bg-gray-100 border-l-blue-600"
                        : "hover:bg-gray-50 border-l-transparent"
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span
                      className={`text-sm truncate font-bold ${t.status === "NEW" ? "text-blue-900" : "text-gray-800"}`}
                    >
                      {t.senderName}
                    </span>
                    {t.status === "DONE" ? (
                      <MdCheckCircle className="text-green-500" />
                    ) : (
                      <MdRotateRight className="text-blue-500" />
                    )}
                  </div>
                  <div className="text-[10px] font-black uppercase text-blue-500">
                    {t.status.replace("_", " ")}
                  </div>
                  <div className="text-xs text-gray-400 truncate italic mt-1">
                    &quot;{t.subject}&quot;
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div
          className={`${!selectedTicket ? "hidden md:flex" : "flex"} flex-1 flex-col bg-white dark:bg-gray-800 h-full overflow-hidden`}
        >
          {selectedTicket ? (
            <>
              <div className="p-6 border-b flex justify-between items-center shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setSelectedTicket(null)}
                    className="md:hidden p-2 text-gray-500"
                  >
                    <MdInbox size={20} />
                  </button>
                  <div>
                    <h1 className="text-lg font-black text-gray-800 uppercase leading-none">
                      {selectedTicket.subject}
                    </h1>
                    <p className="text-xs text-blue-600 font-bold mt-1">
                      {selectedTicket.senderEmail}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteTicket(selectedTicket.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <MdDelete size={20} />
                  </button>
                  {selectedTicket.status !== "DONE" && (
                    <button
                      onClick={() => handleStatusUpdate("DONE")}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase"
                    >
                      {t("adminTable.resolve")}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {selectedTicket.messages?.map((msg: Message) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.senderRole === "USER" ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-sm max-w-[80%] shadow-sm relative group ${
                        msg.senderRole === "USER"
                          ? "bg-white dark:bg-gray-800 border text-gray-800"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {msg.body}
                      {(admin?.isAdmin || admin?.isManager) && (
                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MdDelete size={12} />
                        </button>
                      )}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                      {msg.senderName} •{" "}
                      {msg.senderRole === "USER" ? "Client" : "Support"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex gap-3 items-center bg-white dark:bg-gray-800 flex-shrink-0">
                <input
                  className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder={t("adminTable.replyPlaceholder")}
                  value={replyBody}
                  onChange={(e) => setReplyBody(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReply()}
                />
                <button
                  onClick={handleReply}
                  disabled={!replyBody.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:bg-gray-200"
                >
                  <MdReply size={20} />
                </button>
              </div>
            </>
          ) : (
            <div className="m-auto text-gray-300 flex flex-col items-center">
              <MdInbox size={64} />
              <span className="font-black uppercase text-xs tracking-widest mt-4">
                {t("adminTable.selectConversation")}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
