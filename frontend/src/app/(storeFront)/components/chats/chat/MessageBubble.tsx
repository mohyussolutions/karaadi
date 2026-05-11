"use client"

import type { MessageBubbleProps } from "@/app/utils/types/chat.types"

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const initial = message.senderName?.charAt(0)?.toUpperCase() || "U"

  return (
    <div className={`flex items-end gap-1.5 mb-0.5 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="flex-shrink-0 mb-1">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-6 h-6 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-[10px] font-bold">
              {initial}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[78%] sm:max-w-[70%] md:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-3 py-2 text-sm leading-relaxed break-words whitespace-pre-wrap ${
            isOwn
              ? "bg-[#0063fb] text-white rounded-2xl rounded-br-sm shadow-sm"
              : "bg-white text-gray-900 rounded-2xl rounded-bl-sm border border-gray-200"
          }`}
        >
          {message.content}
        </div>
        <span className="text-[9px] text-gray-400 px-1">
          {formatTime(message.timestamp || message.createdAt)}
        </span>
      </div>
    </div>
  )
}
