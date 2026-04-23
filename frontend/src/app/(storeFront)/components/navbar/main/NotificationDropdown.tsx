"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { IoNotificationsOutline } from "react-icons/io5"
import { fetchNotifications, markNotificationAsRead } from "@/actions/core/notificationsAction"
import { getCategoryRoute } from "@/app/(storeFront)/components/hooks/useGetRoute"

function getItemLink(n: any): string {
  if (!n.itemId || !n.itemType) return "/notifications"
  const base = getCategoryRoute(n.itemType)
  return `/${base}/${n.itemId}?type=${n.itemType}`
}

function formatTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "Just now"
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(diff / 86400000)}d ago`
}

type Props = {
  userId: string
  unreadCount: number
  onDecrement: () => void
}

export default function NotificationDropdown({ userId, unreadCount, onDecrement }: Props) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchData = useCallback(async () => {
    if (!userId) return
    try {
      const data = await fetchNotifications(userId, { limit: 10 })
      if (Array.isArray(data)) setNotifications(data)
    } catch {}
  }, [userId])

  useEffect(() => {
    if (open) fetchData()
  }, [open, fetchData])

  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const handleMarkRead = useCallback(async (id: string) => {
    await markNotificationAsRead(id)
    setNotifications((prev) =>
      prev.map((n) => (n.id === id || n._id === id ? { ...n, isRead: true } : n))
    )
    onDecrement()
  }, [onDecrement])

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-full text-gray-700 hover:text-[#0063FB] hover:bg-gray-100 transition-colors duration-150 whitespace-nowrap"
        aria-label="Notifications"
      >
        <span className="text-[20px] sm:text-[22px] flex items-center leading-none shrink-0 relative">
          <IoNotificationsOutline size={22} />
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
        <span className="hidden sm:inline text-sm font-medium">Notifications</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl border border-gray-200 shadow-xl z-[9999] overflow-hidden">
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">
                No notifications
              </div>
            ) : (
              notifications.map((n: any) => {
                const id = n.id || n._id
                return (
                  <div
                    key={id}
                    className={`px-4 py-3 transition-colors ${!n.isRead ? "bg-blue-50/50" : "bg-white"}`}
                  >
                    <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">
                      {n.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">{formatTime(n.createdAt)}</p>
                    <div className="flex gap-3 mt-2">
                      <Link
                        href={getItemLink(n)}
                        onClick={() => { if (!n.isRead) handleMarkRead(id); setOpen(false) }}
                        className="text-[10px] text-blue-600 font-black uppercase hover:opacity-70"
                      >
                        Read More
                      </Link>
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(id)}
                          className="text-[10px] text-gray-400 font-black uppercase hover:text-green-600 transition-colors"
                        >
                          Mark Read
                        </button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}
