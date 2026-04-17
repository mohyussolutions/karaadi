"use client"

import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ChatEmptyState } from "./ChatEmptyState"
import { ChatHeader } from "./ChatHeader"
import { API_ENDPOINTS } from "@/actions/constant/sockets"
import { ChatMessagesDisplayProps } from "@/app/utils/types/chat"
import { Edit3, Trash2, X, Check, ShieldCheck } from "lucide-react"
import { BsThreeDots } from "react-icons/bs"

function Bubble({
  msg,
  isOwnMessage,
  onEdit,
  onDelete,
  onRetry,
}: {
  msg: any
  isOwnMessage: boolean
  onEdit: (id: any, content: string) => Promise<void>
  onDelete: (id: any) => Promise<void>
  onRetry?: (msg: any) => void
}) {
  const { t } = useTranslation()
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(msg.content)
  const [showActions, setShowActions] = useState(false)

  const handleSave = async () => {
    if (!editValue.trim() || editValue === msg.content) {
      setIsEditing(false)
      return
    }
    await onEdit(msg.id!, editValue)
    setIsEditing(false)
  }

  return (
    <div
      className={`flex group ${isOwnMessage ? "justify-end" : "justify-start"}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="relative flex items-end gap-2 max-w-[85%]">
        {isOwnMessage && !isEditing && !msg.deleted && msg.id && (
          <div className="flex items-center gap-1 order-first absolute -left-16 top-0 mr-2">
            {showActions ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => onDelete(msg.id!)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 size={14} />
                </button>
                {msg.status === "failed" && onRetry && (
                  <button
                    onClick={() => onRetry(msg)}
                    className="p-1 text-green-500 hover:bg-green-50 rounded-lg transition-colors"
                  >
                    ↻
                  </button>
                )}
              </>
            ) : (
              <BsThreeDots className="text-gray-400" />
            )}
          </div>
        )}

        <div
          className={`p-4 rounded-[1.8rem] shadow-sm relative min-w-[80px] ${
            isOwnMessage
              ? "bg-blue-600 text-white rounded-tr-none"
              : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
          } ${msg.deleted ? "opacity-60 italic" : ""} ${
            msg.status === "failed" ? "border-red-200 bg-red-50" : ""
          }`}
        >
          {isEditing ? (
            <div className="space-y-2 min-w-[200px]">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full bg-blue-700 text-white border-none rounded-xl p-2 text-sm focus:ring-1 focus:ring-white/50 resize-none outline-none"
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="p-1.5 hover:bg-blue-500 rounded-lg">
                  <X size={14} />
                </button>
                <button onClick={handleSave} className="p-1.5 bg-white text-blue-600 rounded-lg shadow-sm">
                  <Check size={14} />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm md:text-[15px] leading-relaxed whitespace-pre-wrap break-words">
                {msg.deleted
                  ? isOwnMessage
                    ? t("chats.deleted.you", { defaultValue: "You deleted this message" })
                    : t("chats.deleted.other", { defaultValue: "This message was deleted" })
                  : msg.content}
              </p>
              <div
                className={`flex items-center gap-2 mt-2 text-[10px] font-bold uppercase tracking-widest ${
                  isOwnMessage ? "text-blue-200" : "text-gray-400"
                } ${msg.status === "failed" ? "text-red-300" : ""}`}
              >
                <span>
                  {msg.timestamp || msg.createdAt
                    ? new Date(msg.timestamp ?? msg.createdAt!).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : t("notifications.time.justNow", { defaultValue: "Just now" })}
                </span>
                {msg.isEdited && !msg.deleted && (
                  <span className="italic font-black text-amber-400">
                    ({t("chats.edited", { defaultValue: "edited" })})
                  </span>
                )}
                {msg.status === "failed" && (
                  <span className="text-red-500 font-bold">
                    {t("chats.failed", { defaultValue: "Failed" })}
                  </span>
                )}
                {isOwnMessage && msg.status === "sent" && !msg.deleted && (
                  <ShieldCheck size={12} className="text-blue-300" />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ChatMessagesDisplay({
  currentUserId,
  selectedChat,
  messages,
  isConnected,
  isMobile,
  onSelectChat,
  onRetryFailedMessage,
  onDeleteMessage,
  onEditMessage,
  messagesEndRef,
}: ChatMessagesDisplayProps) {
  const { t } = useTranslation()

  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, messagesEndRef])

  const uniqueMessages = useMemo(() => {
    const seen = new Set()
    const unique = []
    for (const msg of messages) {
      const key = msg.id || (msg as any).tempId
      if (!seen.has(key)) {
        seen.add(key)
        unique.push(msg)
      }
    }
    return unique
  }, [messages])

  const handleEdit = async (messageId: string | number, content: string) => {
    try {
      const id = typeof messageId === "string" ? parseInt(messageId) : (messageId as number)
      const response = await fetch(API_ENDPOINTS.MESSAGES.UPDATE_MESSAGE(id), {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, userId: currentUserId }),
      })
      if (!response.ok) throw new Error("Failed to update")
      if (onEditMessage) onEditMessage(messageId, content)
    } catch {}
  }

  const handleDelete = async (messageId: string | number) => {
    try {
      const id = typeof messageId === "string" ? parseInt(messageId) : (messageId as number)
      const response = await fetch(API_ENDPOINTS.MESSAGES.DELETE_MESSAGE(id), {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      })
      if (!response.ok) throw new Error("Failed to delete")
      if (onDeleteMessage) onDeleteMessage(messageId)
    } catch {}
  }

  if (!selectedChat) {
    return <ChatEmptyState isMobile={isMobile} />
  }

  return (
    <>
      <ChatHeader
        selectedChat={selectedChat}
        isMobile={isMobile}
        isConnected={isConnected}
        onBack={() => onSelectChat(null)}
      />
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-[#F8FAFC] space-y-6">
        {uniqueMessages.length === 0 ? (
          <div className="text-center text-gray-400 py-20 italic text-sm">
            <p>{t("chats.noMessagesYet", { defaultValue: "No messages yet." })}</p>
            <p className="text-xs mt-2">
              {t("chats.startConversation", { defaultValue: "Start a conversation by sending a message!" })}
            </p>
          </div>
        ) : (
          uniqueMessages.map((msg) => (
            <Bubble
              key={`${(msg as any).id || (msg as any).tempId}-${(msg as any).createdAt || (msg as any).timestamp}`}
              msg={msg}
              isOwnMessage={(msg as any).senderId === currentUserId}
              onEdit={async (...args) => {
                if (onEditMessage) await Promise.resolve(onEditMessage(...args))
                else await handleEdit(...args)
              }}
              onDelete={async (...args) => {
                if (onDeleteMessage) await Promise.resolve(onDeleteMessage(...args))
                else await handleDelete(...args)
              }}
              onRetry={() => onRetryFailedMessage(msg as any)}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </>
  )
}
