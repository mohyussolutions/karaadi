"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  MdInbox,
  MdReply,
  MdCheckCircle,
  MdRotateRight,
  MdAssessment,
  MdToday,
  MdDelete,
  MdNotificationsActive,
} from "react-icons/md";
import { verifySession } from "@/actions/core/authAction";

export default function AdminDashboard() {
  const router = useRouter();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [replyBody, setReplyBody] = useState("");
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, today: 0 });

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  const loadData = async () => {
    try {
      const session = await verifySession();
      if (!session) return router.push("/login");
      setAdmin(session);

      const [tRes, sRes] = await Promise.all([
        fetch(`${BASE_URL}/api/contactUs/tickets`),
        fetch(`${BASE_URL}/api/contactUs/stats`),
      ]);

      if (tRes.ok) {
        const allTickets = await tRes.json();
        const sorted = allTickets.sort((a: any, b: any) => b.id - a.id);
        const uniqueUsersMap = new Map();

        sorted.forEach((ticket: any) => {
          if (!uniqueUsersMap.has(ticket.senderEmail)) {
            uniqueUsersMap.set(ticket.senderEmail, ticket);
          }
        });
        setTickets(Array.from(uniqueUsersMap.values()));
      }
      if (sRes.ok) setStats(await sRes.json());
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDetails = async (id: number) => {
    try {
      const res = await fetch(`${BASE_URL}/api/contactUs/tickets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedTicket(data);
        if (data.status === "NEW") handleStatusUpdate("IN_PROGRESS", id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusUpdate = async (newStatus: string, ticketId?: number) => {
    const id = ticketId || selectedTicket?.id;
    if (!id) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/contactUs/tickets/${id}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );
      if (res.ok) {
        await loadData();
        if (selectedTicket?.id === id) {
          const updated = await res.json();
          setSelectedTicket(updated);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTicket = async (id: number) => {
    if (!confirm("Delete entire conversation?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/contactUs/tickets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSelectedTicket(null);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (msgId: number) => {
    if (!confirm("Delete this message?")) return;
    try {
      const res = await fetch(`${BASE_URL}/api/contactUs/messages/${msgId}`, {
        method: "DELETE",
      });
      if (res.ok) await loadDetails(selectedTicket.id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReply = async () => {
    if (!replyBody.trim() || !selectedTicket || !admin) return;
    try {
      const res = await fetch(
        `${BASE_URL}/api/contactUs/tickets/${selectedTicket.id}/messages`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: replyBody,
            senderName: admin.username || admin.name || "Admin",
            senderEmail: admin.email,
            senderRole: "SUPPORT_MANAGER",
          }),
        },
      );
      if (res.ok) {
        setReplyBody("");
        await loadDetails(selectedTicket.id);
        await loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center font-bold text-gray-400">
        LOADING DASHBOARD...
      </div>
    );

  return (
    <div className="flex h-screen max-h-screen bg-gray-50 flex-col overflow-hidden">
      <div className="bg-white border-b p-4 flex gap-6 px-8 items-center justify-between shadow-sm flex-shrink-0">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <MdAssessment className="text-blue-600" size={20} />
            <span className="text-sm font-bold text-gray-700 uppercase">
              Total: {stats.total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MdToday className="text-orange-600" size={20} />
            <span className="text-sm font-bold text-gray-700 uppercase">
              Today: {stats.today}
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
          className={`${selectedTicket ? "hidden md:flex" : "flex"} w-full md:w-1/3 border-r bg-white flex-col h-full overflow-hidden`}
        >
          <div className="p-4 border-b bg-gray-900 text-white flex items-center gap-2 flex-shrink-0">
            <MdInbox />
            <span className="text-xs font-black uppercase tracking-widest">
              Inbox
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {tickets.map((t) => (
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
                  "{t.subject}"
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`${!selectedTicket ? "hidden md:flex" : "flex"} flex-1 flex-col bg-white h-full overflow-hidden`}
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
                      Resolve
                    </button>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
                {selectedTicket.messages?.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.senderRole === "USER" ? "items-start" : "items-end"}`}
                  >
                    <div
                      className={`p-4 rounded-2xl text-sm max-w-[80%] shadow-sm ${msg.senderRole === "USER" ? "bg-white border text-gray-800" : "bg-blue-600 text-white"}`}
                    >
                      {msg.body}
                    </div>
                    <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold tracking-tighter">
                      {msg.senderName} •{" "}
                      {msg.senderRole === "USER" ? "Client" : "Support"}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t flex gap-3 items-center bg-white flex-shrink-0">
                <input
                  className="flex-1 p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="Reply to client..."
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
                Select a conversation
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
