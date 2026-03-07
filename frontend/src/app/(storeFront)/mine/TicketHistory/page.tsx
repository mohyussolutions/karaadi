"use client";

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
} from "react-icons/md";
import Loading from "../../components/shared/Loading/Loading";
import { verifySession } from "@/actions/core/authAction";
import {
  getTicketHistory,
  getTicketDetails,
  addTicketMessage,
} from "@/actions/categories/contactMeAction";

export default function TicketHistory() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const getSession = async () => {
      try {
        const session = await verifySession();
        if (session) setUser(session);
      } catch (error) {
        console.error(error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    getSession();
  }, []);

  const fetchHistory = useCallback(async () => {
    if (!user?.email) return;
    try {
      const data = await getTicketHistory(user.email);
      setTickets(data);
    } catch (err) {
      console.error(err);
    }
  }, [user?.email]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

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
    if (!replyText.trim() || isSending) return;

    const messageToSend = replyText;
    setReplyText("");
    setIsSending(true);

    try {
      const res = await addTicketMessage(ticketId, {
        body: messageToSend,
        senderName: user?.username || user?.name || "User",
        senderEmail: user?.email,
        senderRole: "USER",
      });

      if (res.success) {
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
    } finally {
      setIsSending(false);
    }
  };

  if (isInitialLoading)
    return (
      <div className="p-20 flex justify-center">
        <Loading />
      </div>
    );
  if (!user) return null;

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100 h-fit max-w-4xl mx-auto">
      <div className="mb-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-3 mb-2">
          <MdPerson className="text-blue-600 text-xl" />
          <span className="font-bold text-gray-800">
            {user?.username || user?.name || "User"}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <MdEmail className="text-blue-600 text-xl" />
          <span className="text-sm text-gray-600">{user?.email}</span>
        </div>
      </div>

      <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <MdHistory className="text-blue-600" /> My Tickets
      </h3>

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 text-sm">
        {tickets.length === 0 ? (
          <p className="text-gray-400 italic text-center py-10">
            No tickets found.
          </p>
        ) : (
          tickets.map((t) => (
            <div
              key={t.id}
              className={`border rounded-xl transition-all ${
                t.status === "DONE"
                  ? "bg-green-50/30 border-green-100"
                  : "bg-gray-50 border-gray-100"
              }`}
            >
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(t.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {t.status === "DONE" ? (
                      <MdCheckCircle className="text-green-600" />
                    ) : t.status === "IN_PROGRESS" ? (
                      <MdRotateRight className="text-blue-600 animate-spin-slow" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    )}
                    <span
                      className={`font-bold ${t.status === "DONE" ? "text-green-800" : "text-gray-800"}`}
                    >
                      {t.subject}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] px-2 py-1 rounded font-black uppercase tracking-tighter ${
                      t.status === "DONE"
                        ? "bg-green-600 text-white"
                        : t.status === "IN_PROGRESS"
                          ? "bg-blue-600 text-white"
                          : "bg-red-500 text-white"
                    }`}
                  >
                    {t.status.replace("_", " ")}
                  </span>
                </div>
                <p className="text-gray-500 truncate italic text-xs">
                  {t.body}
                </p>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-200/50">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    ID: #{t.id}
                  </p>
                  <div className="text-blue-600 text-[10px] font-black flex items-center gap-1 uppercase">
                    {expandedTicket === t.id ? (
                      <>
                        <MdKeyboardArrowUp size={16} /> Close
                      </>
                    ) : (
                      <>
                        <MdKeyboardArrowDown size={16} /> View Conversation
                      </>
                    )}
                  </div>
                </div>
              </div>

              {expandedTicket === t.id && (
                <div className="p-4 bg-white border-t border-gray-100 space-y-4 rounded-b-xl">
                  {t.messages?.map((msg: any, index: number) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.senderRole === "USER" ? "items-start" : "items-end"}`}
                    >
                      <div
                        className={`p-3 rounded-xl max-w-[90%] text-xs shadow-sm ${
                          msg.senderRole === "USER"
                            ? "bg-gray-100 text-gray-700 rounded-tl-none border border-gray-200"
                            : "bg-blue-600 text-white rounded-tr-none"
                        }`}
                      >
                        {msg.body}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1 uppercase font-bold px-1 tracking-tighter">
                        {msg.senderRole === "USER"
                          ? index === 0
                            ? "Your Original Request"
                            : "You"
                          : `Support Team • ${msg.senderName}`}
                      </span>
                    </div>
                  ))}

                  {t.status === "DONE" && (
                    <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg text-center text-[9px] font-black uppercase border border-green-100">
                      Case Resolved
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none text-gray-700"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendMessage(t.id)
                      }
                    />
                    <button
                      onClick={() => handleSendMessage(t.id)}
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
