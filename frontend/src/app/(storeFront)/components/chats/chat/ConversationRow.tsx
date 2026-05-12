"use client"

import { useState, useRef, useCallback } from "react"
import { FiTrash2 } from "react-icons/fi"
import type { ConversationRowProps } from "@/app/utils/types/chat.types"

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return new Date(dateStr).toLocaleDateString("en-US", { day: "numeric", month: "short" })
}

export default function ConversationRow({ chatroom, isActive, currentUserId, onClick, onDelete }: ConversationRowProps) {
  const isSender = chatroom.senderId === currentUserId
  const otherName = isSender ? chatroom.receiverName : chatroom.senderName
  const otherAvatar = isSender ? chatroom.receiverAvatar : chatroom.senderAvatar
  const unread = chatroom.unreadCount || 0
  const [showDelete, setShowDelete] = useState(false)
  const longPressRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const startLongPress = useCallback(() => {
    longPressRef.current = setTimeout(() => setShowDelete(true), 500)
  }, [])

  const cancelLongPress = useCallback(() => {
    if (longPressRef.current) {
      clearTimeout(longPressRef.current)
      longPressRef.current = null
    }
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      className={`relative flex items-center gap-2 sm:gap-3 px-2 sm:px-4 py-2.5 sm:py-3.5 border-b border-gray-100 cursor-pointer touch-manipulation select-none transition-colors ${
        isActive
          ? "bg-[#f0f7ff] border-l-[3px] border-l-[#0063fb]"
          : "active:bg-gray-100 hover:bg-gray-50 border-l-[3px] border-l-transparent"
      }`}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchCancel={cancelLongPress}
      onClick={() => { cancelLongPress(); onClick(chatroom.chatId) }}
      onKeyDown={(e) => e.key === "Enter" && onClick(chatroom.chatId)}
    >
      <div className="flex-shrink-0 relative">
        {otherAvatar ? (
          <img
            src={otherAvatar}
            alt={otherName}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex")
            }}
          />
        ) : null}
        <div
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-500 items-center justify-center text-white font-bold text-base flex-shrink-0"
          style={{ display: otherAvatar ? "none" : "flex" }}
        >
          {(otherName || "?").charAt(0).toUpperCase()}
        </div>
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[16px] h-[16px] bg-[#0063fb] text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </div>

      <div className="hidden sm:flex flex-1 min-w-0 flex-col">
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
            {chatroom.itemPrice ? ` · ${chatroom.itemPrice.toLocaleString("en-US")} kr` : ""}
          </p>
        )}

        <p className={`text-xs truncate ${unread > 0 ? "text-gray-800 font-medium" : "text-gray-500"}`}>
          {chatroom.lastMessage || "No messages yet"}
        </p>
      </div>

      <p className="flex sm:hidden text-[10px] font-semibold text-gray-700 truncate max-w-[52px] text-center leading-tight mt-0.5">
        {(otherName || "?").split(" ")[0]}
      </p>

      {showDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowDelete(false); onDelete(chatroom.chatId) }}
          className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 transition-colors touch-manipulation"
          aria-label="Delete conversation"
        >
          <FiTrash2 size={13} />
        </button>
      )}
    </div>
  )
}
