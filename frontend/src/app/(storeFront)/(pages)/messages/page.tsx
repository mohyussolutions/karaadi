"use client"

import { useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import dynamic from "next/dynamic"
import Loading from "@/app/ui/loading/Loading"

const ChatInbox = dynamic(
  () => import("@/app/(storeFront)/components/chats/chat/ChatInbox"),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center"><Loading /></div> },
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
    if (!loading && !user) {
      router.replace("/login?redirect=/messages")
    }
  }, [loading, user, router])

  return (
    <div
      className="-mx-4 sm:mx-0 flex flex-col overflow-hidden sm:p-4 lg:p-6"
      style={{ height: 'calc(100dvh - 3.5rem)' }}
    >
      <ChatInbox
        initialChatId={chatId ? Number(chatId) : undefined}
        sellerId={sellerId || undefined}
        itemId={itemId || undefined}
        itemModel={itemModel || undefined}
      />
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
