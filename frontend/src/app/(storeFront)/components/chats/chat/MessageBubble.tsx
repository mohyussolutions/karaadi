"use client"

import type { MessageBubbleProps } from "@/app/utils/types/chat.types"

function formatTime(ts: string): string {
  return new Date(ts).toLocaleTimeString("nb-NO", { hour: "2-digit", minute: "2-digit" })
}

export default function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const initial = message.senderName?.charAt(0)?.toUpperCase() || "U"

  return (
    <div className={`flex items-end gap-2 mb-1 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div className="flex-shrink-0 mb-1">
          {message.senderAvatar ? (
            <img
              src={message.senderAvatar}
              alt={message.senderName}
              className="w-7 h-7 rounded-full object-cover"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 text-xs font-bold">
              {initial}
            </div>
          )}
        </div>
      )}

      <div className={`flex flex-col gap-0.5 max-w-[70%] md:max-w-[60%] ${isOwn ? "items-end" : "items-start"}`}>
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words whitespace-pre-wrap shadow-sm ${
            isOwn
              ? "bg-[#0063fb] text-white rounded-2xl rounded-br-[4px]"
              : "bg-white text-gray-900 rounded-2xl rounded-bl-[4px] border border-gray-100"
          }`}
        >
          {message.content}
        </div>
        <span className="text-[10px] text-gray-400 px-1">
          {formatTime(message.timestamp || message.createdAt)}
        </span>
      </div>
    </div>
  )
}
