"use client";

import { useState, useRef, useEffect, JSX } from "react";
import Link from "next/link";
import { IoChatbubbles } from "react-icons/io5";

interface Item {
  id: string | number;
  name: string;
  url: string;
  price?: number;
  city?: string;
  region?: string;
}

interface AIChatMessage {
  id: number;
  content: string | JSX.Element;
  fromAI: boolean;
}

interface AIChatPopupProps {
  boats?: Item[];
  cars?: Item[];
  jobListings?: Item[];
  marketplace?: Item[];
  motorcycles?: Item[];
  realEstate?: Item[];
  tractors?: Item[];
}

export default function AIChatPopup(props: AIChatPopupProps) {
  const {
    boats,
    cars,
    jobListings,
    marketplace,
    motorcycles,
    realEstate,
    tractors,
  } = props;

  const allItems: Item[] = [
    ...(boats || []),
    ...(cars || []),
    ...(jobListings || []),
    ...(marketplace || []),
    ...(motorcycles || []),
    ...(realEstate || []),
    ...(tractors || []),
  ];

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: AIChatMessage = {
      id: Date.now(),
      content: input,
      fromAI: false,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    const query = input.toLowerCase();
    let maxPrice: number | undefined;
    const priceMatch = query.match(/under\s*(\d+)/);
    if (priceMatch) maxPrice = parseInt(priceMatch[1], 10);

    const filteredItems = allItems.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(query);
      const matchesCity = item.city?.toLowerCase().includes(query);
      const matchesRegion = item.region?.toLowerCase().includes(query);
      const matchesPrice = maxPrice ? (item.price ?? 0) <= maxPrice : true;
      return matchesPrice && (matchesName || matchesCity || matchesRegion);
    });

    const aiMessage: AIChatMessage = {
      id: Date.now() + 1,
      content:
        filteredItems.length > 0 ? (
          <div className="flex flex-col gap-1">
            {filteredItems.map((item) => (
              <Link
                key={item.id}
                href={item.url}
                className="text-blue-600 hover:underline"
              >
                {item.name} {item.price ? `- $${item.price}` : ""}{" "}
                {item.city ? `(${item.city})` : ""}
              </Link>
            ))}
          </div>
        ) : (
          "No items found matching your query."
        ),
      fromAI: true,
    };

    setTimeout(() => setMessages((prev) => [...prev, aiMessage]), 500);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg hover:bg-blue-700 flex items-center justify-center"
      >
        <IoChatbubbles size={24} />
      </button>

      {isOpen && (
        <div className="mt-2 w-96 h-[500px] bg-white border rounded-lg shadow-xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
            <span>AI Assistant</span>
            <button onClick={() => setIsOpen(false)}>✕</button>
          </div>

          <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2 bg-gray-50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-2 rounded-lg max-w-[90%] ${
                  msg.fromAI ? "bg-blue-100 self-start" : "bg-gray-200 self-end"
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about items, price, city, region..."
              className="flex-1 border rounded-lg px-3 py-2 outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
