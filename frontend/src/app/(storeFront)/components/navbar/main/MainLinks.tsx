"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { getNavItems } from "@/app/(links)/storeFrontLinks/MainLinks"
import { useEffect, useState } from "react"
import { fetchNotifications } from "@/actions/core/notificationsAction"
import Lang from "@/i18n/Lang"
import { useTranslation } from "react-i18next"
import { useLanguage } from "@/app/(storeFront)/components/hooks/useLanguage"
import { User } from "@/actions/core/chatActions"
import { getUnreadMessageCount } from "@/services/chatService"
import useNotificationSocket from "@/hooks/useNotificationSocket"
import { socketService } from "@/actions/sockets/socketService"

const NavItems = ({ user, authLoading }: { user: User | null; authLoading?: boolean }) => {
  const pathname = usePathname()
  const [notificationCount, setNotificationCount] = useState(0)
  const [messageCount, setMessageCount] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { t } = useTranslation()
  useLanguage()
  useNotificationSocket()

  useEffect(() => {
    setMounted(true)
  }, [])

  const userId = user?.id || (user as any)?._id
  const isUserValid = Boolean(userId)

  useEffect(() => {
    if (!mounted || !isUserValid || !userId) return

    let active = true

    const loadNotifications = async () => {
      try {
        const data = await fetchNotifications(userId)
        if (active && Array.isArray(data)) {
          setNotificationCount(data.filter((n: any) => !n.isRead).length)
        }
      } catch {
        if (active) setNotificationCount(0)
      }
    }

    const loadMessages = async () => {
      try {
        const count = await getUnreadMessageCount(userId)
        if (active) setMessageCount(count)
      } catch {
        if (active) setMessageCount(0)
      }
    }

    loadNotifications()
    loadMessages()

    socketService.connect(userId)

    const offUnread = socketService.on("unreadCountUpdate", (data: unknown) => {
      const { count } = data as { count: number }
      if (typeof count === "number") setMessageCount(count)
    })

    const offNewMessage = socketService.on("newMessage", () => {
      setMessageCount((prev) => prev + 1)
    })

    const offMarkedRead = socketService.on("messagesMarkedAsRead", () => {
      getUnreadMessageCount(userId).then((count) => {
        if (active) setMessageCount(count)
      }).catch(() => {})
    })

    return () => {
      active = false
      offUnread()
      offNewMessage()
      offMarkedRead()
    }
  }, [userId, isUserValid, mounted])

  const navItems = getNavItems(authLoading ? false : isUserValid, notificationCount)
  const isNewAd = (href: string) => href === "/new-ad"

  return (
    <div className="flex items-center gap-1">
      <Lang />
      <ul className="flex items-center gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const label = t(item.labelKey)
          const isMessages = item.href === "/messages"

          if (isNewAd(item.href)) {
            return (
              <li key={item.href} className="flex items-center px-1 sm:px-2">
                <Link
                  href={item.href}
                  className="flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-full text-gray-700 hover:text-[#0063FB] hover:bg-gray-100 text-sm font-medium transition-colors duration-150 whitespace-nowrap"
                  aria-label={label}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span className="text-[20px] leading-none">{item.icon}</span>
                  <span className="hidden sm:inline" suppressHydrationWarning>{label}</span>
                </Link>
              </li>
            )
          }

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`relative flex items-center gap-1.5 px-2 sm:px-4 py-2 rounded-full transition-colors duration-150 outline-none whitespace-nowrap
                  ${isActive ? "text-[#0063FB]" : "text-gray-700 hover:text-[#0063FB] hover:bg-gray-100"}`}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-[20px] sm:text-[22px] flex items-center leading-none shrink-0 relative">
                  {item.icon}
                  {isMessages && messageCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-blue-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center border-2 border-white">
                      {messageCount > 9 ? "9+" : messageCount}
                    </span>
                  )}
                </span>
                <span className="hidden sm:inline text-sm font-medium" suppressHydrationWarning>{label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default NavItems
