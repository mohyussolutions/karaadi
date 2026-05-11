"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Send, Loader2 } from "lucide-react"
import MessageBubble from "./MessageBubble"
import { getChatroomMessages, sendChatMessage } from "@/services/chatService"
import { socketService } from "@/actions/sockets/socketServiceAction"
import type { ChatMessage, Chatroom } from "@/app/utils/types/chat.types"

interface Props {
  chatId: number
  chatroom: Chatroom
  currentUserId: string
  onBack?: () => void
  onNewMessage?: (chatId: number, lastMessage: string, lastMessageAt: string) => void
}

function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, "").trim()
}

function formatDate(ts: string): string {
  const d = new Date(ts)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return "Today"
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday"
  return d.toLocaleDateString("en-US", { day: "numeric", month: "long" })
}

function sameDay(a: string, b: string): boolean {
  return new Date(a).toDateString() === new Date(b).toDateString()
}

export default function MessageThread({ chatId, chatroom, currentUserId, onBack, onNewMessage }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const [otherTyping, setOtherTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const typingClearRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingEmitRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const isSender = chatroom.senderId === currentUserId
  const otherName = isSender ? chatroom.receiverName : chatroom.senderName
  const otherAvatar = isSender ? chatroom.receiverAvatar : chatroom.senderAvatar
  const otherUserId = isSender ? chatroom.receiverId : chatroom.senderId

  const scrollToBottom = useCallback((instant = false) => {
    const el = scrollAreaRef.current
    if (!el) return
    if (instant) {
      el.scrollTop = el.scrollHeight
    } else {
      try {
        el.scrollTo({ top: el.scrollHeight, behavior: "smooth" })
      } catch {
        el.scrollTop = el.scrollHeight
      }
    }
  }, [])

  useEffect(() => {
    setLoading(true)
    getChatroomMessages(chatId, currentUserId).then((msgs) => {
      setMessages(msgs)
      setLoading(false)
      setTimeout(() => scrollToBottom(true), 50)
    })

    socketService.connect(currentUserId)

    const joinAndMark = () => {
      socketService.joinChat(chatId)
      socketService.markAsRead(chatId)
    }

    if (socketService.isConnected()) {
      joinAndMark()
    }

    const offConnect = socketService.on("connect", joinAndMark)

    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("karaadi:messages-read"))
    }

    return () => {
      offConnect()
      socketService.leaveChat(chatId)
    }
  }, [chatId, currentUserId, scrollToBottom])

  useEffect(() => {
    const addMessage = (msg: any, fromChatRoom = false) => {
      if (!msg) return
      const incomingChatId = Number(msg.chatId ?? chatId)
      if (incomingChatId !== chatId) return
      if (fromChatRoom && msg.senderId === currentUserId) return
      const mapped: ChatMessage = {
        id: msg.id,
        chatId: incomingChatId,
        senderId: msg.senderId,
        senderName: msg.sender?.username || otherName,
        senderAvatar: msg.sender?.profileImage || otherAvatar,
        content: msg.content,
        timestamp: msg.timestamp || new Date().toISOString(),
        createdAt: msg.createdAt || msg.timestamp || new Date().toISOString(),
        read: false,
        sender: msg.sender,
      }
      setMessages((prev) => {
        if (prev.some((m) => m.id === mapped.id)) return prev
        return [...prev, mapped]
      })
      setTimeout(() => scrollToBottom(false), 50)
      onNewMessage?.(chatId, msg.content, mapped.timestamp)
    }

    const handleNewMessage = (data: unknown) => {
      const { chatId: incomingId, message } = data as { chatId: string; message: any }
      addMessage({ ...message, chatId: incomingId }, true)
    }

    const handleReceiveMessage = (data: unknown) => {
      addMessage(data as any, true)
    }

    const handleTyping = (data: unknown) => {
      const { userId, isTyping } = data as { userId: string; isTyping: boolean }
      if (userId === currentUserId) return
      setOtherTyping(isTyping)
      if (typingClearRef.current) clearTimeout(typingClearRef.current)
      if (isTyping) {
        typingClearRef.current = setTimeout(() => setOtherTyping(false), 2500)
      }
    }

    const off1 = socketService.on("newMessage", handleNewMessage)
    const off2 = socketService.on("receiveMessage", handleReceiveMessage)
    const off3 = socketService.on("userTyping", handleTyping)

    return () => {
      off1(); off2(); off3()
      if (typingClearRef.current) clearTimeout(typingClearRef.current)
      if (typingEmitRef.current) clearTimeout(typingEmitRef.current)
    }
  }, [chatId, currentUserId, otherName, otherAvatar, onNewMessage, scrollToBottom])

  useEffect(() => {
    scrollToBottom(false)
  }, [messages.length, scrollToBottom])

  const resetTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "48px"
    }
  }

  const handleSend = useCallback(async () => {
    const text = sanitize(input)
    if (!text || sending) return
    setInput("")
    resetTextarea()
    setSending(true)
    const tempId = -Date.now()
    const optimistic: ChatMessage = {
      id: tempId,
      chatId,
      senderId: currentUserId,
      senderName: "You",
      senderAvatar: null,
      content: text,
      timestamp: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }
    setMessages((prev) => [...prev, optimistic])
    setTimeout(() => scrollToBottom(true), 30)

    try {
      const saved = await sendChatMessage({ chatId, senderId: currentUserId, receiverId: otherUserId, content: text })
      if (saved) {
        setMessages((prev) => prev.map((m) => (m.id === tempId ? saved : m)))
        onNewMessage?.(chatId, text, saved.timestamp)
      }
    } catch {
      setMessages((prev) => prev.filter((m) => m.id !== tempId))
    } finally {
      setSending(false)
    }
  }, [input, sending, chatId, currentUserId, otherUserId, onNewMessage, scrollToBottom])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
      return
    }
    if (!typingEmitRef.current) {
      socketService.sendTyping(chatId, true)
      typingEmitRef.current = setTimeout(() => {
        typingEmitRef.current = null
      }, 1000)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = "auto"
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%", backgroundColor: "white" }}>
      <div className="flex items-center gap-2.5 px-3 py-2.5 bg-white border-b border-gray-200 flex-shrink-0">
        {otherAvatar ? (
          <img
            src={otherAvatar}
            alt={otherName}
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
            onError={(e) => { e.currentTarget.style.display = "none" }}
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {(otherName || "?").charAt(0).toUpperCase()}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm leading-tight truncate">{otherName}</p>
          {chatroom.itemTitle && (
            <p className="text-[11px] text-gray-400 truncate leading-tight">
              {chatroom.itemTitle}
              {chatroom.itemPrice ? ` · ${chatroom.itemPrice.toLocaleString("en-US")} kr` : ""}
            </p>
          )}
        </div>
      </div>

      <div
        ref={scrollAreaRef}
        className="px-3 py-3 space-y-1 bg-gray-50"
        style={{ flex: 1, overflowY: "auto", overscrollBehavior: "contain", WebkitOverflowScrolling: "touch", minHeight: 0 } as React.CSSProperties}
      >
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? "justify-start" : "justify-end"} animate-pulse`}>
              <div className={`h-10 rounded-2xl ${i % 2 === 0 ? "w-48 bg-gray-200" : "w-40 bg-blue-200"}`} />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-12 text-center">
            <p className="text-sm text-gray-400">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => {
              const prev = messages[idx - 1]
              const showSep = !prev || !sameDay(prev.timestamp, msg.timestamp)
              return (
                <div key={msg.id}>
                  {showSep && (
                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-gray-200" />
                      <span className="text-xs text-gray-400 font-medium px-2">{formatDate(msg.timestamp)}</span>
                      <div className="flex-1 h-px bg-gray-200" />
                    </div>
                  )}
                  <MessageBubble message={msg} isOwn={msg.senderId === currentUserId} />
                </div>
              )
            })}
            {otherTyping && (
              <div className="flex justify-start pl-2 pt-1">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
        <div aria-hidden="true" />
      </div>

      <div className="bg-white border-t border-gray-100 px-2 py-2 flex-shrink-0">
        <div className="flex items-end gap-1.5">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Message…"
            disabled={sending}
            rows={1}
            className="flex-1 resize-none rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#0063fb] focus:border-transparent placeholder:text-gray-400 transition-all touch-manipulation"
            style={{ fontSize: "16px", height: "44px", maxHeight: "110px", overflowY: "auto", lineHeight: "1.4" }}
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all touch-manipulation select-none ${
              !input.trim() || sending
                ? "bg-gray-100 text-gray-300 cursor-not-allowed"
                : "bg-[#0063fb] text-white active:scale-90 shadow-md"
            }`}
            aria-label="Send"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  )
}
