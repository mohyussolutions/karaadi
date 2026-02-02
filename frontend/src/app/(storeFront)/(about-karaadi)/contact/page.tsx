"use client";

import { apiService } from "@/actions/core/authAction";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MdSend, MdHistory } from "react-icons/md";

export default function SupportModule() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  const BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

  useEffect(() => {
    async function init() {
      try {
        const session = await apiService.verifySession();
        if (session) {
          setUser(session);
        }
      } finally {
        setIsVerifying(false);
      }
    }
    init();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/apicontactUs/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: user.username || user.name || "User",
          senderEmail: user.email,
          subject,
          body,
        }),
      });

      if (res.ok) {
        setSubject("");
        setBody("");
        router.push("/mine/TicketHistory");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (isVerifying)
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Loading...
      </div>
    );
  if (!user)
    return (
      <div className="p-10 text-center font-medium text-gray-500">
        Please log in.
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-10">
      <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Support</h2>
            <p className="text-sm text-gray-400">
              Submit a ticket for assistance.
            </p>
          </div>

          <button
            onClick={() => router.push("/mine/TicketHistory")}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-700 rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-blue-100 transition-colors"
          >
            <MdHistory size={18} />
            History
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <input
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium"
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <textarea
              className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl h-48 outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 font-medium resize-none"
              placeholder="How can we help you?"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
            />
          </div>

          <button
            disabled={loading}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-700 disabled:bg-gray-200 transition-all shadow-lg shadow-blue-100"
          >
            <MdSend /> {loading ? "Sending..." : "Submit Ticket"}
          </button>
        </form>
      </div>
    </div>
  );
}
