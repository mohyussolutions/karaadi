"use client";
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      fetch("http://localhost:8080/api/hage")
        .then((res) => res.json())
        .then((data) => {
          const welcome = `Soodhawow! HAGE AI waa online. Waxaan haynaa ${data.inventory.cars} baabuur iyo ${data.inventory.realEstate} guri oo cusub. Maxaan kaa caawiyaa?`;
          setMessages([{ id: 1, content: welcome, fromAI: true }]);
        })
        .catch(() => {
          setMessages([
            {
              id: 1,
              content: "Soodhawow! Maxaan kaa caawin karaa?",
              fromAI: true,
            },
          ]);
        });
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { id: Date.now(), content: input, fromAI: false };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    try {
      const res = await fetch("http://localhost:8080/api/hage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, content: data.reply, fromAI: true },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, content: "Cillad ayaa dhacday.", fromAI: true },
      ]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 flex items-center justify-center transition-transform active:scale-95"
      >
        <IoChatbubbles size={24} />
      </button>

      {isOpen && (
        <div className="mt-2 w-80 md:w-96 h-[500px] bg-white border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-blue-600 text-white px-4 py-4 flex justify-between items-center shadow-md">
            <span className="font-bold tracking-wide">HAGE AI Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:rotate-90 transition-transform text-xl"
            >
              ✕
            </button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-slate-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-2xl text-sm leading-relaxed shadow-sm max-w-[85%] ${msg.fromAI ? "bg-white text-slate-800 self-start border border-slate-100" : "bg-blue-600 text-white self-end"}`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-3 border-t bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Qor farriintaada..."
              className="flex-1 border rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 font-bold"
            >
              Dir
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
