"use client"

import type { ConversationRowProps } from "@/app/utils/types/chat.types"

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "nå"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}t`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString("nb-NO", { day: "numeric", month: "short" })
}

export default function ConversationRow({ chatroom, isActive, currentUserId, onClick }: ConversationRowProps) {
  const isSender = chatroom.senderId === currentUserId
  const otherName = isSender ? chatroom.receiverName : chatroom.senderName
  const otherAvatar = isSender ? chatroom.receiverAvatar : chatroom.senderAvatar
  const unread = chatroom.unreadCount || 0

  return (
    <button
      type="button"
      onClick={() => onClick(chatroom.chatId)}
      className={`w-full flex items-start gap-3 px-4 py-3.5 text-left transition-colors border-b border-gray-100 relative
        ${isActive
          ? "bg-[#f0f7ff] border-l-[3px] border-l-[#0063fb]"
          : "hover:bg-gray-50 border-l-[3px] border-l-transparent"
        }`}
    >
      {/* Avatar */}
      <div className="flex-shrink-0 relative mt-0.5">
        {otherAvatar ? (
          <img
            src={otherAvatar}
            alt={otherName}
            className="w-12 h-12 rounded-full object-cover"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg">
            {otherName.charAt(0).toUpperCase()}
          </div>
        )}
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-[#0063fb] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between gap-2 mb-0.5">
          <span className={`text-sm truncate ${unread > 0 ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
            {otherName}
          </span>
          <span className="text-xs text-gray-400 flex-shrink-0 font-normal">
            {timeAgo(chatroom.lastMessageAt)}
          </span>
        </div>

        {chatroom.itemTitle && (
          <p className="text-xs text-[#0063fb] font-medium truncate mb-0.5">
            {chatroom.itemTitle}
            {chatroom.itemPrice ? ` · ${chatroom.itemPrice.toLocaleString("nb-NO")} kr` : ""}
          </p>
        )}

        <p className={`text-xs truncate ${unread > 0 ? "text-gray-800 font-medium" : "text-gray-500"}`}>
          {chatroom.lastMessage || "Ingen meldinger ennå"}
        </p>
      </div>
    </button>
  )
}
