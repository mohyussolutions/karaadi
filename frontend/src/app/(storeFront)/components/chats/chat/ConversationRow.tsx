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
    if (longPressRef.current) { clearTimeout(longPressRef.current); longPressRef.current = null }
  }, [])

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setShowDelete(true)}
      onMouseLeave={() => setShowDelete(false)}
      onTouchStart={startLongPress}
      onTouchEnd={cancelLongPress}
      onTouchCancel={cancelLongPress}
      onClick={() => { cancelLongPress(); onClick(chatroom.chatId) }}
      onKeyDown={(e) => e.key === "Enter" && onClick(chatroom.chatId)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        borderBottom: "1px solid #f3f4f6",
        backgroundColor: isActive ? "#eff6ff" : "white",
        borderLeft: `3px solid ${isActive ? "#0063fb" : "transparent"}`,
        cursor: "pointer",
        minHeight: 72,
        userSelect: "none",
        WebkitTapHighlightColor: "transparent",
      } as React.CSSProperties}
    >
      <div style={{ position: "relative", flexShrink: 0 }}>
        {otherAvatar ? (
          <img
            src={otherAvatar}
            alt={otherName}
            style={{ width: 52, height: 52, borderRadius: "50%", objectFit: "cover" }}
            onError={(e) => {
              e.currentTarget.style.display = "none";
              (e.currentTarget.nextElementSibling as HTMLElement | null)?.style.setProperty("display", "flex")
            }}
          />
        ) : null}
        <div
          style={{
            width: 52, height: 52, borderRadius: "50%", backgroundColor: "#3b82f6",
            display: otherAvatar ? "none" : "flex",
            alignItems: "center", justifyContent: "center",
            color: "white", fontWeight: 700, fontSize: 20, flexShrink: 0,
          }}
        >
          {(otherName || "?").charAt(0).toUpperCase()}
        </div>
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -2, right: -2,
            minWidth: 18, height: 18,
            backgroundColor: "#0063fb", color: "white",
            fontSize: 10, fontWeight: 700, borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 4px", lineHeight: 1,
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8, marginBottom: 3 }}>
          <span style={{ fontSize: 15, fontWeight: unread > 0 ? 700 : 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {otherName}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", flexShrink: 0 }}>
            {timeAgo(chatroom.lastMessageAt)}
          </span>
        </div>

        {chatroom.itemTitle && (
          <p style={{ fontSize: 12, color: "#0063fb", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "0 0 2px" }}>
            {chatroom.itemTitle}{chatroom.itemPrice ? ` · ${chatroom.itemPrice.toLocaleString("en-US")} kr` : ""}
          </p>
        )}

        <p style={{ fontSize: 13, color: unread > 0 ? "#374151" : "#6b7280", fontWeight: unread > 0 ? 500 : 400, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>
          {chatroom.lastMessage || "No messages yet"}
        </p>
      </div>

      {showDelete && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setShowDelete(false); onDelete(chatroom.chatId) }}
          style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", padding: 8, borderRadius: "50%", color: "#9ca3af", background: "none", border: "none", cursor: "pointer" }}
          aria-label="Delete"
        >
          <FiTrash2 size={16} />
        </button>
      )}
    </div>
  )
}
