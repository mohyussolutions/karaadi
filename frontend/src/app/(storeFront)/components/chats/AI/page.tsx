"use client";

import { verifySession } from "@/actions/core/authAction";
import { sendChatMessage } from "@/actions/sockets/hageAction";
import { useState, useRef, useEffect } from "react";
import { IoChatbubbles } from "react-icons/io5";

interface AIChatMessage {
  id: number;
  content: string;
  fromAI: boolean;
}

export default function AIChatPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await verifySession();
      setIsLoggedIn(!!session?._id);
    };
    checkSession();
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.closest("button, input")) {
      return;
    }
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;

    const maxX = window.innerWidth - (chatRef.current?.offsetWidth || 320);
    const maxY = window.innerHeight - (chatRef.current?.offsetHeight || 500);

    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY)),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragStart]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || !isLoggedIn) return;

    const userMsg = { id: Date.now(), content: input, fromAI: false };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    const result = await sendChatMessage(currentInput);

    if (result.reply) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, content: result.reply, fromAI: true },
      ]);
    } else {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, content: result.error, fromAI: true },
      ]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform active:scale-95"
      >
        <IoChatbubbles size={24} />
      </button>

      {isOpen && (
        <div
          ref={chatRef}
          onMouseDown={handleMouseDown}
          style={{
            transform: `translate(${position.x}px, ${position.y}px)`,
            cursor: isDragging ? "grabbing" : "default",
          }}
          className={`mt-2 w-80 md:w-96 h-[500px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 ${isDragging ? "shadow-2xl" : ""}`}
        >
          <div
            className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center shadow-md cursor-grab active:cursor-grabbing"
            onMouseDown={(e) => {
              if (e.target instanceof HTMLElement && e.target.closest("button"))
                return;
              handleMouseDown(e);
            }}
          >
            <span className="font-bold tracking-wide flex items-center gap-2">
              <span className="text-sm opacity-50">⋮⋮</span>
              HAGE AI Assistant
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:rotate-90 transition-transform text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {!isLoggedIn && (
              <div className="bg-yellow-100 text-yellow-800 p-3 rounded-2xl text-sm border border-yellow-300 self-center">
                Fadlan gal si aad u isticmaasho HAGE AI.
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${
                  msg.fromAI
                    ? "bg-white text-slate-800 self-start border border-slate-100"
                    : "bg-blue-600 text-white self-end"
                }`}
              >
                {msg.content}
              </div>
            ))}

            {loading && (
              <div className="bg-white text-slate-400 self-start p-3 rounded-2xl text-sm border border-slate-100 flex items-center gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
                <span className="animate-bounce [animation-delay:0.4s]">.</span>
                <span className="ml-2 italic text-xs">
                  Hage waa uu fekerayaa...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              disabled={loading || !isLoggedIn}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={
                isLoggedIn ? "Qor farriintaada..." : "Fadlan gal marka hore"
              }
              className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={loading || !isLoggedIn}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-bold disabled:bg-slate-400"
            >
              Dir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
