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

  const chatId = searchParams.get("chatId")
  const sellerId = searchParams.get("sellerId")
  const itemId = searchParams.get("itemId")
  const itemModel = searchParams.get("itemModel")

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
      className="fixed inset-x-0 z-10 overflow-hidden"
      style={{
        top: "3rem",
        height: "calc(100svh - 3rem - env(safe-area-inset-bottom, 0px))",
      }}
    >
      <div className="h-full w-full max-w-[64.5rem] mx-auto flex flex-col sm:p-4 lg:p-6">
        <ChatInbox
          initialChatId={chatId ? Number(chatId) : undefined}
          sellerId={sellerId || undefined}
          itemId={itemId || undefined}
          itemModel={itemModel || undefined}
        />
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
