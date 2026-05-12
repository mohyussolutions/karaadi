"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import dynamic from "next/dynamic"
import Loading from "@/app/ui/loading/Loading"

const ChatInbox = dynamic(
  () => import("@/app/(storeFront)/components/chats/chat/ChatInbox"),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center"><Loading /></div> },
)

function MessagesContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) router.replace("/login?redirect=/messages")
  }, [loading, user, router])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const footer = document.querySelector("footer") as HTMLElement | null
    if (footer) footer.style.display = "none"
    return () => {
      document.body.style.overflow = prev
      if (footer) footer.style.display = ""
    }
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: "3rem",
        bottom: 0,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        backgroundColor: "#fefdfd",
        zIndex: 10,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
        }}
        className="sm:p-4 lg:p-6"
      >
        <div
          style={{ flex: 1, minHeight: 0, width: "100%", maxWidth: "64.5rem", margin: "0 auto", display: "flex", flexDirection: "column" }}
          className="rounded-none sm:rounded-2xl sm:overflow-hidden sm:border sm:border-gray-200 sm:shadow-md"
        >
          <ChatInbox
            initialChatId={searchParams.get("chatId") ? Number(searchParams.get("chatId")) : undefined}
            sellerId={searchParams.get("sellerId") || undefined}
            itemId={searchParams.get("itemId") || undefined}
            itemModel={searchParams.get("itemModel") || undefined}
          />
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense>
      <MessagesContent />
    </Suspense>
  )
}
